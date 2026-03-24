import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sprint 4: Upsell campaigns
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // TODO: Sprint 4 — return active upsell campaigns based on user behavior
  return NextResponse.json({ campaigns: [] });
}
