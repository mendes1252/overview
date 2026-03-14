import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) return new TextEncoder().encode("fallback-dev-secret-do-not-use-in-prod");
  return new TextEncoder().encode(s);
};

type Role = "admin" | "manager" | "operator";

const ROUTE_ROLES: Record<string, Role[]> = {
  "/pdv": ["admin", "manager", "operator"],
  "/gestao": ["admin", "manager"],
};

async function getPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { role: Role; userId: string; email: string; name: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("predileta_session")?.value;

  // Allow public routes
  if (pathname.startsWith("/login") || pathname === "/") {
    if (token) {
      const payload = await getPayload(token);
      if (payload) {
        return NextResponse.redirect(new URL("/pdv/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  // API routes: let them handle their own auth via getSession()
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // All other routes require auth
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await getPayload(token);
  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("predileta_session");
    return res;
  }

  // Check route-level permissions
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_ROLES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/pdv/dashboard", req.url));
      }
      break;
    }
  }

  // Inject user context into headers for Server Components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-role", payload.role);
  requestHeaders.set("x-user-name", payload.name);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
