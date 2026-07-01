import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseServer';
import { sendBookingEmails } from '@/utils/email';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const responseCode = searchParams.get('vnp_ResponseCode');
    const bookingId = searchParams.get('vnp_TxnRef');
    const amountStr = searchParams.get('vnp_Amount');
    
    const isSuccess = responseCode === '00';

    if (!bookingId) {
      return NextResponse.redirect(new URL('/booking', req.url));
    }

    if (isSuccess) {
      // 1. Update order status in Supabase
      try {
        const { data: updatedData, error } = await supabase
          .from('bookings')
          .update({
            details: `[Paid via VNPay Sandbox] Status: Completed. Amount paid: ${parseInt(amountStr || '0') / 100} VND.`
          })
          .eq('id', bookingId)
          .select('*');

        if (error) {
          console.error('Failed to update booking status in Supabase:', error.message);
        } else if (updatedData && updatedData[0]) {
          const booking = updatedData[0];
          // 2. Send booking emails
          await sendBookingEmails({
            fullName: booking.full_name,
            companyName: booking.company_name,
            email: booking.email,
            phone: booking.phone,
            employeeCount: booking.employee_count,
            preferredDate: booking.preferred_date,
            location: booking.location,
            details: `[THÀNH CÔNG] Đã nhận thanh toán đặt cọc 20%. ${booking.details}`
          });
        }
      } catch (err) {
        console.error('Error handling database update on payment callback:', err);
      }

      // Redirect to success screen
      return NextResponse.redirect(new URL(`/booking/success?bookingId=${bookingId}`, req.url));
    } else {
      // Redirect to failure screen
      return NextResponse.redirect(new URL(`/booking/failed?bookingId=${bookingId}`, req.url));
    }

  } catch (err: any) {
    console.error('Failed in payment callback handler:', err);
    return NextResponse.redirect(new URL('/booking/failed', req.url));
  }
}
