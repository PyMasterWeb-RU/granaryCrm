import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AclService {
  constructor(private prisma: PrismaService) {}

  async canAccess(userId: string, entity: string, entityId: string, ownerId: string): Promise<boolean> {
    if (userId === ownerId) return true;

    const shared = await this.prisma.sharedAccess.findFirst({
      where: {
        userId,
        entity,
        entityId,
      },
    });

    return !!shared;
  }

  async assertCanAccess(userId: string, entity: string, entityId: string, ownerId: string) {
    const allowed = await this.canAccess(userId, entity, entityId, ownerId);
    if (!allowed) throw new ForbiddenException('Нет доступа к ресурсу');
  }

  async shareAccess(entity: string, entityId: string, userId: string, canEdit = false) {
    return this.prisma.sharedAccess.upsert({
      where: {
        userId_entityId_entity: {
          userId,
          entityId,
          entity,
        },
      },
      update: { canEdit },
      create: { userId, entityId, entity, canEdit },
    });
  }

  async revokeAccess(entity: string, entityId: string, userId: string) {
    return this.prisma.sharedAccess.deleteMany({
      where: { entity, entityId, userId },
    });
  }

  async listAccess(entity: string, entityId: string) {
    return this.prisma.sharedAccess.findMany({
      where: { entity, entityId },
      include: { user: true },
    });
  }
}
