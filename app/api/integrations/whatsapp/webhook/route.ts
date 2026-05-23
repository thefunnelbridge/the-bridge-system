import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token && expectedToken && token === expectedToken && challenge) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload) {
    return NextResponse.json({ error: "Invalid WhatsApp webhook payload." }, { status: 400 });
  }

  // Production flow:
  // 1. Validate webhook source and signature at the edge.
  // 2. Extract WhatsApp message events from payload.entry[].changes[].
  // 3. Upsert Bridge Inbox™ conversation by organization + channel contact id.
  // 4. Generate Bridge Pulse™ alert if SLA, owner or next action is missing.
  // 5. Store raw payload in Supabase for audit and troubleshooting.
  return NextResponse.json({
    received: true,
    bridgeAction: "whatsapp_event_ready_for_bridge_inbox",
  });
}
