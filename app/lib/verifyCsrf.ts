import { NextRequest } from "next/server";
import { verifyCsrfToken } from "./csrf";

export function validateCsrf(req: NextRequest) {
  const cookieToken = req.cookies.get("csrf-token")?.value;

  const headerToken =
    req.headers.get("x-csrf-token") ?? undefined;

  return verifyCsrfToken(cookieToken, headerToken);
}