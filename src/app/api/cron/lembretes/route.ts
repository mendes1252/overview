import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmail, getEmailLembreteRetirada } from "@/lib/resend";

export async function GET(req: Request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Find orders that have been "pronto" for more than 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const pedidosProntos = await prisma.pedido.findMany({
      where: {
        status: "pronto",
        updatedAt: { lte: oneDayAgo },
      },
      include: { cliente: true },
    });

    let enviados = 0;
    let erros = 0;

    for (const pedido of pedidosProntos) {
      if (!pedido.cliente.email) continue;

      // Check if we already sent a reminder for this order today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingReminder = await prisma.notificacao.findFirst({
        where: {
          pedidoId: pedido.id,
          tipo: "lembrete_retirada",
          enviadoEm: { gte: today },
        },
      });

      if (existingReminder) continue;

      const emailContent = getEmailLembreteRetirada({
        nomeCliente: pedido.cliente.nome,
        protocolo: pedido.protocolo,
      });

      const result = await enviarEmail({
        to: pedido.cliente.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      await prisma.notificacao.create({
        data: {
          clienteId: pedido.clienteId,
          pedidoId: pedido.id,
          tipo: "lembrete_retirada",
          canal: "email",
          mensagem: emailContent.subject,
          status: result.success ? "enviado" : "erro",
          erroDescricao: result.success ? null : result.error,
        },
      });

      if (result.success) enviados++;
      else erros++;
    }

    return NextResponse.json({
      message: `Lembretes processados: ${enviados} enviados, ${erros} erros`,
      total: pedidosProntos.length,
      enviados,
      erros,
    });
  } catch (error) {
    console.error("Erro no cron de lembretes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
