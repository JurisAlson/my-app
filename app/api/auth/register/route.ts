import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";
import { RegisterSchema } from "@/app/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = RegisterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    const { email } = validation.data;

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
        {
          status: 409,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email is available.",
    });

} catch (error) {
  console.error("REGISTER API ERROR:");
  console.error(error);

  return NextResponse.json(
    {
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : String(error),
    },
    {
      status: 500,
    }
  );
}
}