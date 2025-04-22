import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FolderStorageService {
  constructor(private prisma: PrismaService) {}

  async createFolder(name: string, userId: string, parentId?: string, access: string = 'private') {
    return this.prisma.fileFolder.create({
      data: {
        name,
        userId,
        parentId,
        access,
      },
    });
  }

  async findOrCreateAccountFolder(accountId: string, accountName: string, userId: string) {
    const existing = await this.prisma.fileFolder.findFirst({
      where: { accountId },
    });

    if (existing) return existing;

    return this.prisma.fileFolder.create({
      data: {
        name: accountName,
        userId,
        access: 'private',
        accountId,
      },
    });
  }

  async findOrCreateDealFolder(dealId: string, dealName: string, userId: string, accountFolderId: string) {
    const existing = await this.prisma.fileFolder.findFirst({
      where: { dealId },
    });

    if (existing) return existing;

    return this.prisma.fileFolder.create({
      data: {
        name: dealName,
        userId,
        access: 'private',
        parentId: accountFolderId,
        dealId,
      },
    });
  }

  async getAllUserFolders(userId: string) {
    return this.prisma.fileFolder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteFolder(folderId: string, userId: string) {
    const folder = await this.prisma.fileFolder.findUnique({ where: { id: folderId } });
    if (!folder || folder.userId !== userId) throw new Error('Нет доступа');

    await this.prisma.file.deleteMany({ where: { folderId } });
    return this.prisma.fileFolder.delete({ where: { id: folderId } });
  }
}
