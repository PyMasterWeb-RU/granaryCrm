import { Module } from '@nestjs/common';
import { FolderStorageService } from './folder-storage.service';
import { FolderStorageController } from './folder-storage.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FolderStorageController],
  providers: [FolderStorageService, PrismaService],
  exports: [FolderStorageService], // нужно для file-storage
})
export class FolderStorageModule {}
