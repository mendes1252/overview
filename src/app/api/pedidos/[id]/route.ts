import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: true,
        itens: true,
        notificacoes: {
          orderBy: { enviadoEm: "desc" },
        },
      },
    });

    if (!pedido) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: pedido });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return NextResponse.json({ error: "Erro ao buscar pedido" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pedido.update({
      where: { id },
      data: { status: "cancelado" },
    });

    return NextResponse.json({ message: "Pedido cancelado com sucesso" });
  } catch (error) {
    console.error("Erro ao cancelar pedido:", error);
    return NextResponse.json({ error: "Erro ao cancelar pedido" }, { status: 500 });
  }
}
