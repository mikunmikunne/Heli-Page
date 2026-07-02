import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseServer';
import { isValidEmail, isValidPhoneNumber } from '@/utils/validators';
import { isRateLimited } from '@/utils/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { 
      fullName, 
      email, 
      phone, 
      bookingType, 
      chairId, 
      quantity, 
      shippingAddress, 
      preferredDate, 
      preferredTime, 
      showroomLocation, 
      details,
      totalAmount,
      depositAmount,
      captchaToken 
    } = body;

    // 1. Server-side Validation
    if (!fullName || !email || !phone) {
      return NextResponse.json({ error: 'Missing contact information fields' }, { status: 400 });
    }
    if (!isValidEmail(email) || !isValidPhoneNumber(phone)) {
      return NextResponse.json({ error: 'Invalid email or phone format' }, { status: 400 });
    }

    if (bookingType === 'experience') {
      if (!preferredDate || !showroomLocation) {
        return NextResponse.json({ error: 'Missing date or showroom location for experience booking' }, { status: 400 });
      }
    } else {
      if (!shippingAddress) {
        return NextResponse.json({ error: 'Missing delivery address for pre-order' }, { status: 400 });
      }
    }

    // 2. CAPTCHA Verification
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA verification is required.' }, { status: 400 });
    }

    if (process.env.RECAPTCHA_SECRET_KEY) {
      const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        }).toString(),
      });
      const verifyJson = await verifyRes.json();

      if (!verifyJson.success) {
        return NextResponse.json({ error: 'CAPTCHA verification failed.' }, { status: 400 });
      }
    }

    // Generate descriptive location & details for backward compatibility with db schema
    const dbLocation = bookingType === 'experience' 
      ? `Showroom: ${showroomLocation}` 
      : `Shipping: ${shippingAddress}`;
      
    // Parse cart items if present
    let finalModelDesc = `${chairId} (x${quantity || 1})`;
    if (chairId === "cart_checkout" && body.cartItems && Array.isArray(body.cartItems)) {
      finalModelDesc = body.cartItems
        .map((item: any) => `${item.chairId} (x${item.quantity})`)
        .join(", ");
    }

    const dbDetails = bookingType === 'experience'
      ? `Showroom Trial Session at ${preferredTime}. Note: ${details || 'None'}`
      : `Heli Pre-order: Model ${finalModelDesc}. Amount: ${totalAmount} VND. Note: ${details || 'None'}`;

    // 3. Insert to Supabase DB
    const { data: dbData, error } = await supabase
      .from('bookings')
      .insert([
        {
          full_name: fullName,
          company_name: bookingType === 'order' ? 'Individual Pre-order' : 'Showroom Booking',
          email: email,
          phone: phone,
          employee_count: bookingType === 'order' ? finalModelDesc : '1-20 employees',
          preferred_date: preferredDate || new Date().toISOString().split('T')[0],
          location: dbLocation,
          details: dbDetails,
        }
      ])
      .select('id');

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    const bookingId = dbData?.[0]?.id || 'mock-id-' + Math.random().toString(36).substring(2, 9);

    if (bookingType === 'experience') {
      try {
        const { sendBookingEmails } = await import('@/utils/email');
        await sendBookingEmails({
          fullName,
          email,
          phone,
          companyName: 'Showroom Booking',
          employeeCount: '1-20 employees',
          preferredDate: preferredDate || new Date().toISOString().split('T')[0],
          location: dbLocation,
          details: dbDetails,
        });
        console.log('Showroom booking confirmation email dispatched.');
      } catch (emailErr) {
        console.error('Failed to send showroom booking confirmation email:', emailErr);
      }
    }
    
    return NextResponse.json({ success: true, bookingId }, { status: 200 });

  } catch (error: unknown) {
    console.error('Booking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
