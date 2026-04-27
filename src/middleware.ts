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
  "/affiliate",
];

const authRoutes = ["/login", "/cadastro", "/recuperar-senha", "/redefinir-senha"];

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? "";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // Custom domain detection: if request comes from a different domain, resolve to /bio/[username]
  if (
    APP_DOMAIN &&
    !host.includes(APP_DOMAIN) &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1") &&
    !host.includes("vercel.app") &&
    pathname === "/"
  ) {
    // Look up the storefront by customDomain via a lightweight API call.
    // We use a separate endpoint to avoid importing Prisma (not available in edge runtime).
    const res = await fetch(
      `${req.nextUrl.origin}/api/bio/domain?domain=${encodeURIComponent(host)}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const { username } = await res.json();
      if (username) {
        return NextResponse.rewrite(new URL(`/bio/${username}`, req.url));
      }
    }
    // Unknown domain — show 404 rather than the app
    return NextResponse.rewrite(new URL("/bio/_notfound", req.url));
  }

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
