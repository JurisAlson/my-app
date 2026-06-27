import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { RegisterSchema } from "@/app/lib/validation";
import { hashPassword } from "@/app/lib/password";
import { writeAuditLog } from "@/app/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input.",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, username, password } = result.data;

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists.",
        },
        { status: 409 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    // Audit log
    await writeAuditLog("USER_REGISTERED", user.id);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}