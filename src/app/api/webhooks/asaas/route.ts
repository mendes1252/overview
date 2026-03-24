import { NextResponse, type NextRequest } from "next/server";

// Sprint 4: Full Asaas webhook handler
export async function POST(request: NextRequest) {
  const body = await request.json();
  const event = body?.event as string | undefined;

  // TODO: Sprint 4 — implement webhook signature verification and event processing
  // Events: PAYMENT_CONFIRMED, PAYMENT_OVERDUE, PAYMENT_REFUNDED, SUBSCRIPTION_DELETED
  console.log("[Asaas Webhook] Event received:", event);

  return NextResponse.json({ received: true });
}
