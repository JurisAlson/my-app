import { prisma } from "./prisma";

export async function createAuditLog(
  userId: number | null,
  action: string,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,
      ipAddress,
      userAgent,
    },
  });
}