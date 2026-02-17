import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/tarefas",
  "/habitos",
  "/metas",
  "/relatorios",
  "/configuracoes",
  "/onboarding",
];

const authRoutes = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for session token cookie (NextAuth v5 sets this)
  const token =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;
  const isLoggedIn = !!token;

  // Protected routes - redirect to login if not authenticated
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Auth routes - redirect to dashboard if already logged in
  const isAuthRoute = authRoutes.some((route) => pathname === route);
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
