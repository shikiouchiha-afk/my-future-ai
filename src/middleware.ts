import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/premium", "/dashboard", "/admin"];
const authOnlyPrefixes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const premiumCookie = request.cookies.get("myfuture_premium")?.value === "1";
  const adminCookie = request.cookies.get("myfuture_admin")?.value === "1";
  const sessionCookie = request.cookies.get("myfuture_session")?.value === "1";

  if (authOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    if (pathname.startsWith("/admin") && !adminCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/premium") && !sessionCookie) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/dashboard") && !sessionCookie) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/premium/:path*", "/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
