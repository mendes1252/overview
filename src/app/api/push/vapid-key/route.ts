import { NextResponse } from "next/server";

export async function GET() {
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!vapidKey) {
    return NextResponse.json({ error: "VAPID key not configured" }, { status: 500 });
  }

  return NextResponse.json({ publicKey: vapidKey });
}
