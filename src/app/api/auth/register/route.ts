import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha sao obrigatorios" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email ja esta em uso" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create default categories
    await prisma.category.createMany({
      data: [
        { name: "Trabalho", color: "#3B82F6", userId: user.id },
        { name: "Pessoal", color: "#10B981", userId: user.id },
        { name: "Saude", color: "#F59E0B", userId: user.id },
        { name: "Estudos", color: "#8B5CF6", userId: user.id },
      ],
    });

    // Send welcome email (non-blocking)
    sendEmail({
      to: email,
      subject: "Bem-vindo ao pulse!",
      html: generateWelcomeEmail(name),
    }).catch((err) => console.error("Failed to send welcome email:", err));

    return NextResponse.json(
      { message: "Usuario criado com sucesso", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
