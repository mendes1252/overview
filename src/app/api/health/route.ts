import { NextResponse } from "next/server";

export async function GET() {
  const emailFrom = process.env.EMAIL_FROM || "";

  const checks = {
    database: !!process.env.DATABASE_URL,
    auth: !!process.env.AUTH_SECRET,
    email: {
      configured: !!process.env.RESEND_API_KEY,
      customDomain: !!emailFrom && !emailFrom.includes("resend.dev"),
    },
    appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
    payments: !!process.env.ASAAS_API_KEY,
    ai: !!process.env.OPENAI_API_KEY,
  };

  const allRequired = checks.database && checks.auth && checks.email.configured;

  return NextResponse.json({
    status: allRequired ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    services: checks,
  });
}
