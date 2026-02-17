import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

// Rota temporaria para diagnosticar envio de email
// DELETE THIS FILE after debugging
export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ error: "Campo 'to' obrigatorio" }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject: "Teste de email - pulse",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Email de teste</h2>
          <p>Se voce recebeu este email, o Resend esta funcionando!</p>
          <p><strong>De:</strong> ${process.env.EMAIL_FROM || "pulse <onboarding@resend.dev>"}</p>
          <p><strong>Para:</strong> ${to}</p>
          <p><strong>RESEND_API_KEY:</strong> ${process.env.RESEND_API_KEY ? "configurada (" + process.env.RESEND_API_KEY.substring(0, 8) + "...)" : "NAO CONFIGURADA"}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: result.success,
      from: process.env.EMAIL_FROM || "pulse <onboarding@resend.dev>",
      to,
      resendApiKeySet: !!process.env.RESEND_API_KEY,
      data: result.data || null,
      error: result.success ? null : String(result.error),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || String(error),
    }, { status: 500 });
  }
}
