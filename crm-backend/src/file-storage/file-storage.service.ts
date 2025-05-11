import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { FolderStorageService } from '../folder-storage/folder-storage.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FileStorageService {
  constructor(
    private prisma: PrismaService,
    private folderService: FolderStorageService,
  ) {}

  async listFiles(userId: string, folderId?: string) {
    console.log('listFiles called with:', {
      userId,
      folderId: folderId ?? 'null',
    });
    const normalizedFolderId =
      folderId === '' || folderId === undefined ? null : folderId;
    const files = await this.prisma.file.findMany({
      where: { userId, folderId: normalizedFolderId },
      orderBy: { createdAt: 'desc' },
    });
    const response = files.map((f) => ({
      id: f.id,
      name: f.name,
      path: f.path,
      userId: f.userId,
      folderId: f.folderId,
      size: f.size,
      mimeType: f.mimeType,
    }));
    console.log('listFiles response:', response);
    return response;
  }

  async listFilesByDealId(userId: string, dealId: string) {
    console.log('listFilesByDealId called with:', { userId, dealId });
    const files = await this.prisma.file.findMany({
      where: { userId, dealId },
      orderBy: { createdAt: 'desc' },
    });
    const response = files.map((f) => ({
      id: f.id,
      name: f.name,
      path: f.path,
      userId: f.userId,
      folderId: f.folderId,
      size: f.size,
      mimeType: f.mimeType,
    }));
    console.log('listFilesByDealId response:', response);
    return response;
  }

  async listAllFiles(userId: string) {
    const files = await this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    const response = files.map((f) => ({
      id: f.id,
      name: f.name,
      path: f.path,
      userId: f.userId,
      folderId: f.folderId,
      size: f.size,
      mimeType: f.mimeType,
    }));
    console.log('listAllFiles response:', response);
    return response;
  }

  async uploadFile(
    userId: string,
    file: Express.Multer.File,
    accountId?: string,
    dealId?: string,
    folderId?: string,
  ) {
    console.log('uploadFile called with:', {
      userId,
      originalname: file.originalname,
      folderId,
      accountId,
      dealId,
    });

    // Автоматически определяем folderId для dealId или accountId
    let targetFolderId = folderId;
    if (dealId && accountId) {
      // Получаем реальное имя компании из базы
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) {
        throw new NotFoundException(`Компания с ID ${accountId} не найдена`);
      }
      const accountFolder = await this.folderService.findOrCreateAccountFolder(
        accountId,
        account.name, // Используем реальное имя компании
        userId,
      );
      const dealFolder = await this.folderService.findOrCreateDealFolder(
        dealId,
        `Deal_${dealId}`,
        userId,
        accountFolder.id,
      );
      targetFolderId = dealFolder.id;
    } else if (accountId) {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) {
        throw new NotFoundException(`Компания с ID ${accountId} не найдена`);
      }
      const accountFolder = await this.folderService.findOrCreateAccountFolder(
        accountId,
        account.name, // Используем реальное имя компании
        userId,
      );
      targetFolderId = accountFolder.id;
    }

    const filePath = path.join(
      'Uploads',
      'files',
      `${Date.now()}-${file.originalname}`,
    );
    fs.renameSync(file.path, filePath);

    let decodedName: string;
    try {
      decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    } catch (err) {
      console.warn(
        `Failed to convert filename encoding: ${file.originalname}`,
        err,
      );
      decodedName = file.originalname;
    }

    const createdFile = await this.prisma.file.create({
      data: {
        name: decodedName,
        path: filePath,
        size: file.size,
        mimeType: file.mimetype,
        folderId: targetFolderId,
        userId,
        dealId: dealId ?? null,
        contactId: null,
        taskId: null,
        access: 'private',
      },
    });

    console.log('Uploaded file:', {
      id: createdFile.id,
      name: createdFile.name,
      path: createdFile.path,
    });
    return createdFile;
  }

  async updateFile(
    fileId: string,
    userId: string,
    data: { name?: string; folderId?: string },
  ) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== userId) {
      throw new NotFoundException('Нет доступа или файл не найден');
    }

    let updatedName: string | undefined = data.name;
    if (updatedName) {
      try {
        updatedName = Buffer.from(updatedName, 'latin1').toString('utf8');
      } catch {
        console.warn(`Failed to convert updated filename: ${data.name}`);
      }
    }

    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: {
        name: updatedName,
        folderId: data.folderId,
      },
    });

    console.log('Updated file:', {
      id: updatedFile.id,
      name: updatedFile.name,
    });
    return updatedFile;
  }

  async downloadFile(fileId: string) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) throw new NotFoundException('Файл не найден');
    return file;
  }

  async generatePublicLink(fileId: string, minutes = 60) {
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    const publicLink = randomUUID();
    const updatedFile = await this.prisma.file.update({
      where: { id: fileId },
      data: { publicLink, access: 'public', expiresAt },
    });
    console.log('Generated public link:', { id: fileId, publicLink });
    return updatedFile;
  }

  async getByPublicLink(publicLink: string) {
    const file = await this.prisma.file.findFirst({
      where: { publicLink, access: 'public' },
    });
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
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.warn(`Failed to delete file from disk: ${file.path}`, err);
    }
    return this.prisma.file.delete({ where: { id: fileId } });
  }
}
