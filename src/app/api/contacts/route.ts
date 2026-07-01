import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseServer';
import { isValidEmail } from '@/utils/validators';
import { isRateLimited } from '@/utils/rateLimit';
import { sendContactEmail } from '@/utils/email';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { fullName, email, message, captchaToken } = await req.json();

    if (!fullName || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // 2. CAPTCHA Verification
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA token is missing' }, { status: 400 });
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
        return NextResponse.json({ error: 'CAPTCHA verification failed' }, { status: 400 });
      }
    } else {
      console.warn('RECAPTCHA_SECRET_KEY is not defined. Skipping server-side verification.');
    }

    const { error } = await supabase
      .from('contacts')
      .insert([{ full_name: fullName, email, message }]);

    if (error) throw error;

    // Gửi email thông báo cho Admin
    try {
      await sendContactEmail({ fullName, email, message });
    } catch (mailError) {
      console.error('Failed to send contact notification email:', mailError);
    }
    
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: unknown) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

