import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  enviarEmail,
  getEmailConfirmacaoRecebimento,
  getEmailRoupasProntas,
  getEmailLembreteRetirada,
} from "@/lib/resend";
import { formatCurrency, formatDate } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { pedidoId, tipo } = await req.json();

    if (!pedidoId || !tipo) {
      return NextResponse.json(
        { error: "pedidoId e tipo são obrigatórios" },
        { status: 400 }
      );
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
      include: { cliente: true },
    });

    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    if (!pedido.cliente.email) {
      return NextResponse.json(
        { error: "Cliente não possui email cadastrado" },
        { status: 400 }
      );
    }

    let emailContent: { subject: string; html: string };

    switch (tipo) {
      case "confirmacao_recebimento":
        emailContent = getEmailConfirmacaoRecebimento({
          nomeCliente: pedido.cliente.nome,
          protocolo: pedido.protocolo,
          valorTotal: formatCurrency(Number(pedido.valorFinal)),
          dataPrevisaoEntrega: pedido.dataPrevisaoEntrega
            ? formatDate(pedido.dataPrevisaoEntrega)
            : "A definir",
        });
        break;
      case "roupas_prontas":
        emailContent = getEmailRoupasProntas({
          nomeCliente: pedido.cliente.nome,
          protocolo: pedido.protocolo,
        });
        break;
      case "lembrete_retirada":
        emailContent = getEmailLembreteRetirada({
          nomeCliente: pedido.cliente.nome,
          protocolo: pedido.protocolo,
        });
        break;
      default:
        return NextResponse.json({ error: "Tipo de notificação inválido" }, { status: 400 });
    }

    const result = await enviarEmail({
      to: pedido.cliente.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    await prisma.notificacao.create({
      data: {
        clienteId: pedido.clienteId,
        pedidoId: pedido.id,
        tipo,
        canal: "email",
        mensagem: emailContent.subject,
        status: result.success ? "enviado" : "erro",
        erroDescricao: result.success ? null : result.error,
      },
    });

    if (result.success) {
      return NextResponse.json({ message: "Email enviado com sucesso" });
    } else {
      return NextResponse.json(
        { error: "Falha ao enviar email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
