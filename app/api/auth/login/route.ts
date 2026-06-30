import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { LoginSchema } from "@/app/lib/validation";
import { verifyPassword } from "@/app/lib/password";
import { createAuditLog } from "@/app/lib/audit";
import { generateToken } from "@/app/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // User doesn't exist
    if (!user) {
      await prisma.loginAttempt.create({
        data: {
          email,
          success: false,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Account disabled
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account has been disabled.",
        },
        { status: 403 }
      );
    }

    // Verify password
    const validPassword = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!validPassword) {
      await prisma.loginAttempt.create({
        data: {
          email,
          success: false,
          userId: user.id,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Successful login
    await prisma.loginAttempt.create({
      data: {
        email,
        success: true,
        userId: user.id,
      },
    });

    await createAuditLog(
      "USER_LOGIN",
      user.id,
      req.headers.get("x-forwarded-for") ?? undefined,
      req.headers.get("user-agent") ?? undefined
    );

    // Generate JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });

    // Store JWT in HttpOnly cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}