import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json({
      success: true,
      message: "Validation passed.",
      data: validation.data,
    });

  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request.",
      },
      {
        status: 400,
      }
    );
  }
}