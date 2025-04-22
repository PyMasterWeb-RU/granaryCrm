import { Injectable } from '@nestjs/common';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaLoggedService {
  constructor(
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  async updateWithLog<T>(
    entity: string,
    entityId: string,
    userId: string,
    data: Partial<T>,
    fetchCurrent: () => Promise<T>,
    updateOperation: () => Promise<T>,
  ): Promise<T> {
    const before = await fetchCurrent();
    const after = await updateOperation();

    const changes: Record<string, { from: any; to: any }> = {};

    for (const key of Object.keys(data)) {
      const from = before[key];
      const to = data[key];
      if (from !== to) {
        changes[key] = { from, to };
      }
    }

    if (Object.keys(changes).length > 0) {
      await this.auditLogService.logChange({
        entity,
        entityId,
        userId,
        action: 'update',
        changes,
      });
    }

    return after;
  }

  async deleteWithLog<T>(
    entity: string,
    entityId: string,
    userId: string,
    deleteOperation: () => Promise<T>,
  ): Promise<T> {
    const deleted = await deleteOperation();

    await this.auditLogService.logChange({
      entity,
      entityId,
      userId,
      action: 'delete',
    });

    return deleted;
  }

  async createWithLog<T>(
    entity: string,
    entityId: string,
    userId: string,
    createOperation: () => Promise<T>,
  ): Promise<T> {
    const created = await createOperation();

    await this.auditLogService.logChange({
      entity,
      entityId,
      userId,
      action: 'create',
    });

    return created;
  }
}
