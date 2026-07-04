import { NextRequest, NextResponse } from "next/server";

import { validateCsrf } from "@/app/lib/verifyCsrf";

export async function POST(req: NextRequest) {
  if (!validateCsrf(req)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid CSRF token.",
      },
      {
        status: 403,
      }
    );
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set({
    name: "csrf-token",
    value: "",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

  return response;
}