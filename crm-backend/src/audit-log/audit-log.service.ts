import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async logChange(params: {
    entity: string;
    entityId: string;
    userId: string;
    action: 'create' | 'update' | 'delete';
    changes?: Record<string, { from: any; to: any }>;
  }) {
    return this.prisma.auditLog.create({ data: params });
  }

  async getLogsForEntity(entity: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
