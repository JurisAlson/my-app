import crypto from "crypto";

export function generateCsrfToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyCsrfToken(
  cookieToken?: string,
  headerToken?: string
) {
  if (!cookieToken || !headerToken) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}