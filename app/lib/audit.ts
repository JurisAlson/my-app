import { prisma } from "@/app/lib/prisma";

export async function createAuditLog(
  action: string,
  userId?: number,
  ipAddress?: string,
  userAgent?: string
) {
  return prisma.auditLog.create({
    data: {
      action,
      userId,
      ipAddress,
      userAgent,
    },
  });
}