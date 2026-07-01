import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, amount, description } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const hashSecret = process.env.VNP_HASH_SECRET;
    
    // If VNPay is configured, we can generate a real VNPay Sandbox URL
    if (tmnCode && hashSecret) {
      const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const date = new Date();
      const createDate = formatDate(date);
      
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
      
      const vnpParams: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: bookingId,
        vnp_OrderInfo: description || 'Heli Smart Massage Chair Deposit',
        vnp_OrderType: 'other',
        vnp_Amount: String(amount * 100), // VNPay expects amount in cents/VND*100
        vnp_ReturnUrl: `${req.headers.get('origin')}/api/payments/callback`,
        vnp_IpAddr: ip,
        vnp_CreateDate: createDate,
      };

      const sortedParams = sortObject(vnpParams);
      const signData = new URLSearchParams(sortedParams).toString();
      
      // Compute signature
      const crypto = require('crypto');
      const hmac = crypto.createHmac("sha512", hashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
      
      const paymentUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${signed}`;
      return NextResponse.json({ vnpayUrl: paymentUrl }, { status: 200 });
    }

    // Otherwise, redirect to a beautiful local Mock Payment Gateway Page for sandbox testing
    const mockUrl = `/booking/payment-mock?bookingId=${bookingId}&amount=${amount}&description=${encodeURIComponent(description)}`;
    return NextResponse.json({ vnpayUrl: mockUrl }, { status: 200 });

  } catch (err: any) {
    console.error('Failed to create payment URL:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// VNPay helpers
function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

function formatDate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds());
}
