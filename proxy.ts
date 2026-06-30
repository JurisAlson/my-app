import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/jwt";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // No JWT cookie
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Verify JWT
      verifyToken(token);

      // Token is valid
      return NextResponse.next();
    } catch {
      // Invalid or expired token
      const response = NextResponse.redirect(new URL("/login", req.url));

      response.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
      });

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};