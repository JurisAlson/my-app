import { prisma } from "./prisma";

export async function writeAuditLog(
  action: string,
  userId?: number,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.auditLog.create({
    data: {
      action,
      userId,
      ipAddress,
      userAgent,
    },
  });
}