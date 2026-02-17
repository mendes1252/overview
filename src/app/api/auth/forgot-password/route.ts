import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generatePasswordResetEmail } from "@/lib/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email e obrigatorio" },
        { status: 400 }
      );
    }

    // Always return success to avoid email enumeration
    const successResponse = NextResponse.json({
      message: "Se o email estiver cadastrado, voce recebera um link de recuperacao.",
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      // User doesn't exist or uses OAuth — return success anyway
      return successResponse;
    }

    // Delete any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Generate token (expires in 1 hour)
    const token = uuidv4();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send reset email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/redefinir-senha?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: "Redefinir senha - pulse",
      html: generatePasswordResetEmail(resetUrl),
    });

    return successResponse;
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
