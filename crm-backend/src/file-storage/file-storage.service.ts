import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import * as path from 'path';
import * as fs from 'fs';
import { Express } from 'express';
import { randomUUID } from 'crypto'

@Injectable()
export class FileStorageService {
  constructor(
    private prisma: PrismaService,
    private folderService: FolderStorageService,
  ) {}

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    accountId?: string,
    dealId?: string,
    folderId?: string,
  ) {
    let targetFolderId = folderId;

    if (!folderId && dealId) {
      const deal = await this.prisma.deal.findUnique({ where: { id: dealId }, include: { account: true } });
      if (!deal) throw new Error('Сделка не найдена');

      const accountFolder = await this.folderService.findOrCreateAccountFolder(
        deal.accountId!,
        deal.account!.name,
        userId,
      );

      const dealFolder = await this.folderService.findOrCreateDealFolder(
        dealId,
        deal.title,
        userId,
        accountFolder.id,
      );

      targetFolderId = dealFolder.id;
    }

    const filePath = path.join('uploads', 'files', `${Date.now()}-${file.originalname}`);
    fs.renameSync(file.path, filePath);

    return this.prisma.file.create({
      data: {
        name: file.originalname,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        folderId: targetFolderId,
        userId,
        dealId,
        contactId: null,
        taskId: null,
        access: 'private',
      },
    });
  }

	async downloadFile(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }

  async generatePublicLink(fileId: string, minutes = 60) {
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    const publicLink = randomUUID();

    return this.prisma.file.update({
      where: { id: fileId },
      data: {
        publicLink,
        access: 'public',
        expiresAt,
      },
    });
  }

  async getByPublicLink(publicLink: string) {
    const file = await this.prisma.file.findFirst({ where: { publicLink, access: 'public' } });
    if (!file || (file.expiresAt && new Date() > file.expiresAt)) {
      throw new NotFoundException('Ссылка недействительна или истекла');
    }
    return file;
  }

  async deleteFile(userId: string, fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== userId) {
      throw new NotFoundException('Нет доступа или файл не найден');
    }

    fs.unlinkSync(file.path);
    return this.prisma.file.delete({ where: { id: fileId } });
  }
}
