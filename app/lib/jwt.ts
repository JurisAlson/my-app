import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

const JWT_OPTIONS: jwt.SignOptions = {
  algorithm: "HS256",
  expiresIn: "1d",
  issuer: "secureauth",
  audience: "secureauth-users",
};

export interface TokenPayload {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: "secureauth",
    audience: "secureauth-users",
  }) as TokenPayload;
}