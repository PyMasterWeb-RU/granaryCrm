import { Module } from '@nestjs/common';
import { FolderStorageService } from './folder-storage.service';
import { FolderStorageController } from './folder-storage.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
        PrismaModule,
        CustomFieldsModule,
      ],
  controllers: [FolderStorageController],
  providers: [FolderStorageService, PrismaService],
  exports: [FolderStorageService], // нужно для file-storage
})
export class FolderStorageModule {}
