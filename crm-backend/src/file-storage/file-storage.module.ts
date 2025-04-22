import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FolderStorageModule } from '../folder-storage/folder-storage.module';

@Module({
  imports: [FolderStorageModule],
  controllers: [FileStorageController],
  providers: [FileStorageService, PrismaService],
})
export class FileStorageModule {}
