import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "warkop-pos-super-secret-key"
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Izinkan akses ke halaman login dan folder public/api
  if (pathname === "/login" || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    if (token && pathname === "/login") {
      // Jika sudah login tapi mau ke /login, redirect ke home masing-masing
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (payload.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
        return NextResponse.redirect(new URL("/dashboard/kasir", request.url));
      } catch (e) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 2. Proteksi Route: Jika tidak ada token, paksa ke login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // 3. Verifikasi Token & Cek Role
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    // Proteksi Admin: Hanya ADMIN yang boleh ke /admin
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/kasir", request.url));
    }

    // Proteksi Kasir: Hanya CASHIER atau ADMIN yang boleh ke /dashboard/kasir
    if (pathname.startsWith("/dashboard/kasir") && role !== "CASHIER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Token tidak valid atau expired
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
