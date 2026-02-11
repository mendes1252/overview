import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmail, getEmailRoupasProntas } from "@/lib/resend";

const VALID_STATUSES = ["recebido", "em_lavagem", "pronto", "entregue", "cancelado"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { status };

    if (status === "entregue") {
      updateData.dataEntrega = new Date();
    }

    const pedido = await prisma.pedido.update({
      where: { id },
      data: updateData,
      include: { cliente: true },
    });

    // Send email when status changes to "pronto"
    if (status === "pronto" && pedido.cliente.email) {
      const emailContent = getEmailRoupasProntas({
        nomeCliente: pedido.cliente.nome,
        protocolo: pedido.protocolo,
      });

      const emailResult = await enviarEmail({
        to: pedido.cliente.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      await prisma.notificacao.create({
        data: {
          clienteId: pedido.clienteId,
          pedidoId: pedido.id,
          tipo: "roupas_prontas",
          canal: "email",
          mensagem: emailContent.subject,
          status: emailResult.success ? "enviado" : "erro",
          erroDescricao: emailResult.success ? null : emailResult.error,
        },
      });
    }

    return NextResponse.json({ data: pedido });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}
