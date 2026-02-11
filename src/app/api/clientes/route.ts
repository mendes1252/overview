import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/validations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const where = search
      ? {
          ativo: true,
          OR: [
            { nome: { contains: search, mode: "insensitive" as const } },
            { telefone: { contains: search } },
            { cpf: { contains: search } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { ativo: true };

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.cliente.count({ where }),
    ]);

    return NextResponse.json({
      data: clientes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    return NextResponse.json({ error: "Erro ao listar clientes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = clienteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.cpf) {
      const existing = await prisma.cliente.findUnique({
        where: { cpf: data.cpf.replace(/\D/g, "") },
      });
      if (existing) {
        return NextResponse.json({ error: "CPF já cadastrado" }, { status: 409 });
      }
    }

    const cliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        telefone: data.telefone.replace(/\D/g, ""),
        email: data.email || null,
        cpf: data.cpf ? data.cpf.replace(/\D/g, "") : null,
        whatsapp: data.whatsapp || null,
        dataNascimento: data.dataNascimento ? new Date(data.dataNascimento) : null,
        endereco: data.endereco || null,
        categoria: data.categoria,
        observacoes: data.observacoes || null,
      },
    });

    return NextResponse.json({ data: cliente }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
