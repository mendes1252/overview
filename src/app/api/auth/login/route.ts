import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const appPassword = process.env.APP_PASSWORD || "predileta2024";

    if (password !== appPassword) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const response = NextResponse.json({ message: "Login realizado com sucesso" });
    response.cookies.set("auth-token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
