import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseServer";
import { isValidEmail } from "@/utils/validators";
import { isRateLimited } from "@/utils/rateLimit";
import { sendNewsletterConfirmationEmail } from "@/utils/email";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // Save newsletter contact entry into Supabase "contacts" table
    const { error } = await supabase
      .from("contacts")
      .insert([
        {
          full_name: "Newsletter Subscriber",
          email: email,
          message: "Đăng ký nhận bản tin khuyến mãi & sức khỏe từ trang chủ Heli.",
        }
      ]);

    if (error) {
      console.error("[Newsletter API] Supabase Insert Error:", error);
      throw error;
    }

    // Send SMTP confirmation email to subscriber
    try {
      await sendNewsletterConfirmationEmail(email);
    } catch (emailErr) {
      console.error("[Newsletter API] Failed to send SMTP confirmation email:", emailErr);
    }

    // Forward to Tracking Webhook
    const webhookUrl = process.env.TRACKING_WEBHOOK_URL || "https://httpbin.org/post";
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "heli-smart-massage-chair",
          event: "newsletter_subscription",
          details: `Đăng ký bản tin từ: ${email}`,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (whErr) {
      console.error("[Newsletter API] Webhook notification failed:", whErr);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error("[Newsletter API] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
