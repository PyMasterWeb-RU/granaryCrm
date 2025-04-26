import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { PrismaService } from '../prisma/prisma.service';
import { FolderStorageModule } from '../folder-storage/folder-storage.module';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [FolderStorageModule, PrismaModule, CustomFieldsModule],
  controllers: [FileStorageController],
  providers: [FileStorageService, PrismaService],
})
export class FileStorageModule {}
