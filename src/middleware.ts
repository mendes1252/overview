import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/",
  "/clientes",
  "/pedidos",
  "/relatorios",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("auth-token")?.value;
  const isLoggedIn = token === "authenticated";

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route + "/"))
  );

  if (pathname === "/" && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
