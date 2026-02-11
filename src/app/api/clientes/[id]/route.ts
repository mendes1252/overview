import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validations";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        pedidos: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ data: cliente });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json({ error: "Erro ao buscar cliente" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = clienteSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (data.nome !== undefined) updateData.nome = data.nome;
    if (data.telefone !== undefined) updateData.telefone = data.telefone.replace(/\D/g, "");
    if (data.email !== undefined) updateData.email = data.email || null;
    if (data.cpf !== undefined) updateData.cpf = data.cpf ? data.cpf.replace(/\D/g, "") : null;
    if (data.whatsapp !== undefined) updateData.whatsapp = data.whatsapp || null;
    if (data.dataNascimento !== undefined) updateData.dataNascimento = data.dataNascimento ? new Date(data.dataNascimento) : null;
    if (data.endereco !== undefined) updateData.endereco = data.endereco || null;
    if (data.categoria !== undefined) updateData.categoria = data.categoria;
    if (data.observacoes !== undefined) updateData.observacoes = data.observacoes || null;

    const cliente = await prisma.cliente.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: cliente });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json({ error: "Erro ao atualizar cliente" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.cliente.update({
      where: { id },
      data: { ativo: false },
    });

    return NextResponse.json({ message: "Cliente removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    return NextResponse.json({ error: "Erro ao deletar cliente" }, { status: 500 });
  }
}
