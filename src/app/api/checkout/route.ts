import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sprint 4: Full Asaas checkout integration
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { plan } = body as { plan: string };

  if (!["starter", "pro", "multi"].includes(plan)) {
    return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
  }

  // TODO: Sprint 4 — integrate Asaas checkout
  return NextResponse.json(
    { message: "Checkout Asaas será implementado na Sprint 4" },
    { status: 501 }
  );
}
