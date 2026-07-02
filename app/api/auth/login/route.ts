import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { LoginSchema } from "@/app/lib/validation";
import { verifyPassword } from "@/app/lib/password";
import { createAuditLog } from "@/app/lib/audit";
import { generateToken } from "@/app/lib/jwt";
import { checkRateLimit, resetRateLimit } from "@/app/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Get client IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      "127.0.0.1";

    // Rate limiting
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many login attempts. Please try again in 15 minutes.",
        },
        { status: 429 }
      );
    }

    // Validate input
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

    // Find user
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
          ipAddress: ip,
          userAgent: req.headers.get("user-agent") ?? undefined,
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

    // Account temporarily locked
if (user.lockedUntil && user.lockedUntil > new Date()) {
  const remainingSeconds = Math.ceil(
    (user.lockedUntil.getTime() - Date.now()) / 1000
  );

  return NextResponse.json(
    {
      success: false,
      message: "Account is temporarily locked.",
      lockedUntil: user.lockedUntil,
      remainingSeconds,
    },
    { status: 423 }
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

    // Wrong password
    if (!validPassword) {
      const failedAttempts = user.failedLoginAttempts + 1;

      const updateData: {
        failedLoginAttempts: number;
        lockedUntil?: Date;
      } = {
        failedLoginAttempts: failedAttempts,
      };

      if (failedAttempts >= 5) {
        updateData.lockedUntil = new Date(
          Date.now() + 15 * 60 * 1000
        );
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: updateData,
      });

      await prisma.loginAttempt.create({
        data: {
          email,
          success: false,
          userId: user.id,
          ipAddress: ip,
          userAgent: req.headers.get("user-agent") ?? undefined,
        },
      });

if (failedAttempts >= 5) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Account locked for 15 minutes due to multiple failed login attempts.",
      lockedUntil: updateData.lockedUntil,
      remainingSeconds: 15 * 60,
    },
    {
      status: 423,
    }
  );
}

    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password.",
      },
      {
        status: 401,
      }
    );
    }

    // Reset failed login counter
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Successful login
    await prisma.loginAttempt.create({
      data: {
        email,
        success: true,
        userId: user.id,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });

    await createAuditLog(
      "USER_LOGIN",
      user.id,
      ip,
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
      maxAge: 60 * 60 * 24 * 7,
    });

    // Reset IP rate limiter
    resetRateLimit(ip);

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