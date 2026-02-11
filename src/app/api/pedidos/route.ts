import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pedidoSchema } from "@/lib/validations";
import { generateProtocolo, formatCurrency, formatDate } from "@/lib/utils";
import {
  enviarEmail,
  getEmailConfirmacaoRecebimento,
} from "@/lib/resend";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const clienteId = searchParams.get("clienteId");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where: Record<string, unknown> = {};
    if (status && status !== "todos") where.status = status;
    if (clienteId) where.clienteId = clienteId;
    if (search) {
      where.OR = [
        { protocolo: { contains: search, mode: "insensitive" } },
        { cliente: { nome: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [pedidos, total] = await Promise.all([
      prisma.pedido.findMany({
        where,
        include: {
          cliente: true,
          itens: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.pedido.count({ where }),
    ]);

    return NextResponse.json({
      data: pedidos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    return NextResponse.json({ error: "Erro ao listar pedidos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = pedidoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const protocolo = generateProtocolo();

    const valorTotal = data.itens.reduce(
      (acc, item) => acc + item.precoUnitario * item.quantidade,
      0
    );
    const valorFinal = valorTotal - (data.desconto || 0);

    const pedido = await prisma.pedido.create({
      data: {
        protocolo,
        clienteId: data.clienteId,
        status: "recebido",
        valorTotal,
        desconto: data.desconto || 0,
        valorFinal,
        observacoes: data.observacoes || null,
        dataPrevisaoEntrega: new Date(data.dataPrevisaoEntrega),
        formaPagamento: data.formaPagamento || null,
        itens: {
          create: data.itens.map((item) => ({
            descricao: item.descricao,
            tipoServico: item.tipoServico,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            precoTotal: item.precoUnitario * item.quantidade,
            cor: item.cor || null,
            defeitos: item.defeitos || null,
          })),
        },
      },
      include: { cliente: true, itens: true },
    });

    // Update client stats
    await prisma.cliente.update({
      where: { id: data.clienteId },
      data: {
        totalPedidos: { increment: 1 },
        totalGasto: { increment: valorFinal },
      },
    });

    // Send confirmation email if client has email
    if (pedido.cliente.email) {
      const emailContent = getEmailConfirmacaoRecebimento({
        nomeCliente: pedido.cliente.nome,
        protocolo: pedido.protocolo,
        valorTotal: formatCurrency(valorFinal),
        dataPrevisaoEntrega: formatDate(pedido.dataPrevisaoEntrega!),
      });

      const emailResult = await enviarEmail({
        to: pedido.cliente.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });

      // Log notification
      await prisma.notificacao.create({
        data: {
          clienteId: pedido.clienteId,
          pedidoId: pedido.id,
          tipo: "confirmacao_recebimento",
          canal: "email",
          mensagem: emailContent.subject,
          status: emailResult.success ? "enviado" : "erro",
          erroDescricao: emailResult.success ? null : emailResult.error,
        },
      });
    }

    return NextResponse.json({ data: pedido }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }
}
