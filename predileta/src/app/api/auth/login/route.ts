import { NextResponse } from "next/server";
import { validateCredentials, createSession, SESSION_COOKIE } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);
    const session = await validateCredentials(email, password);

    if (!session) {
      return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
    }

    const token = await createSession(session);
    const res = NextResponse.json({ ok: true, role: session.role, name: session.name });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error("[auth/login]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
