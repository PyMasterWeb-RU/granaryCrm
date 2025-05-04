import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FolderStorageService {
  constructor(private prisma: PrismaService) {}

  async findUnique(query: { where: { id: string } }) {
    return this.prisma.fileFolder.findUnique(query);
  }

  async createFolder(
    name: string,
    userId: string,
    parentId?: string,
    access: string = 'private',
  ) {
    return this.prisma.fileFolder.create({
      data: {
        name,
        userId,
        parentId,
        access,
      },
    });
  }

  async updateFolder(
    folderId: string,
    userId: string,
    data: { name?: string; parentId?: string },
  ) {
    const folder = await this.prisma.fileFolder.findUnique({
      where: { id: folderId },
    });
    if (!folder || folder.userId !== userId) {
      throw new Error('Нет доступа');
    }
    return this.prisma.fileFolder.update({
      where: { id: folderId },
      data: {
        name: data.name,
        parentId: data.parentId,
      },
    });
  }

  async generatePublicLink(folderId: string, minutes = 60) {
    const folder = await this.prisma.fileFolder.findUnique({
      where: { id: folderId },
    });
    if (!folder) throw new NotFoundException('Папка не найдена');
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    const publicLink = randomUUID();
    return this.prisma.fileFolder.update({
      where: { id: folderId },
      data: {
        publicLink,
        access: 'public',
        expiresAt,
      },
    });
  }

  async getByPublicLink(publicLink: string) {
    const folder = await this.prisma.fileFolder.findFirst({
      where: { publicLink, access: 'public' },
    });
    if (!folder || (folder.expiresAt && new Date() > folder.expiresAt)) {
      throw new NotFoundException('Ссылка недействительна или истекла');
    }
    return this.getFolderContents(folder.id);
  }

  async getFolderContents(folderId: string) {
    const [subfolders, files] = await Promise.all([
      this.prisma.fileFolder.findMany({
        where: { parentId: folderId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.file.findMany({
        where: { folderId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { folderId, subfolders, files };
  }

  async findOrCreateAccountFolder(
    accountId: string,
    accountName: string,
    userId: string,
  ) {
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

  async findOrCreateDealFolder(
    dealId: string,
    dealName: string,
    userId: string,
    accountFolderId: string,
  ) {
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
    const folder = await this.prisma.fileFolder.findUnique({
      where: { id: folderId },
    });
    if (!folder || folder.userId !== userId) throw new Error('Нет доступа');

    await this.prisma.file.deleteMany({ where: { folderId } });
    return this.prisma.fileFolder.delete({ where: { id: folderId } });
  }
}
