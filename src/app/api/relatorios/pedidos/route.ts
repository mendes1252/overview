import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dataInicio = searchParams.get("dataInicio");
    const dataFim = searchParams.get("dataFim");
    const status = searchParams.get("status");
    const clienteId = searchParams.get("clienteId");

    const where: Record<string, unknown> = {};

    if (dataInicio && dataFim) {
      where.createdAt = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim + "T23:59:59.999Z"),
      };
    } else if (dataInicio) {
      where.createdAt = { gte: new Date(dataInicio) };
    } else if (dataFim) {
      where.createdAt = { lte: new Date(dataFim + "T23:59:59.999Z") };
    }

    if (status && status !== "todos") {
      where.status = status;
    }

    if (clienteId) {
      where.clienteId = clienteId;
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      include: { cliente: true },
      orderBy: { createdAt: "desc" },
    });

    const totalPedidos = pedidos.length;
    const valorTotal = pedidos.reduce(
      (acc, p) => acc + Number(p.valorFinal),
      0
    );
    const ticketMedio = totalPedidos > 0 ? valorTotal / totalPedidos : 0;

    return NextResponse.json({
      data: pedidos,
      totais: {
        totalPedidos,
        valorTotal,
        ticketMedio,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}
