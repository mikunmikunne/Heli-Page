import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // Log to console for debugging
    console.log("[Behavior Tracker API] Received Event:", payload);

    // Get Webhook URL from environment variables or use httpbin.org as a default test fallback
    const webhookUrl = process.env.TRACKING_WEBHOOK_URL || "https://httpbin.org/post";

    // Forward event payload to the Webhook URL
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "heli-smart-massage-chair",
        event: payload.type,
        details: payload.label,
        url: payload.url,
        path: payload.path,
        timestamp: new Date().toISOString(),
        metadata: {
          screenSize: payload.screenSize,
          referrer: payload.referrer,
        }
      }),
    });

    if (!response.ok) {
      console.warn(`[Behavior Tracker API] Webhook returned status: ${response.status}`);
    }

    return NextResponse.json({ success: true, forwardedTo: webhookUrl }, { status: 200 });

  } catch (err: any) {
    console.error("[Behavior Tracker API] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
