import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard"];
  const guestRoutes = ["/login", "/register"];

  const isProtected = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  const isGuest = guestRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  // No token
  if (!token) {
    if (isProtected) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // Token exists
  try {
    verifyToken(token);

    // Logged in user trying to access login/register
    if (isGuest) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch {
    // Invalid or expired token
    const response = NextResponse.redirect(
      new URL("/login", req.url)
    );

    response.cookies.set({
      name: "token",
      value: "",
      expires: new Date(0),
      path: "/",
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