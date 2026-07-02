import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "./app/lib/jwt";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/dashboard"];

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // User is NOT logged in
  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  try {
    // Verify JWT
    verifyToken(token);

    // Logged-in user trying to access login/register
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid or expired token
    const response = isProtectedRoute
      ? NextResponse.redirect(new URL("/login", req.url))
      : NextResponse.next();

    response.cookies.set({
      name: "token",
      value: "",
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};