import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { PrismaLoggedModule } from 'src/prisma-logged/prisma-logged.module'
import { FolderStorageModule } from 'src/folder-storage/folder-storage.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
    PrismaLoggedModule,
    FolderStorageModule
  ],
  providers: [AccountsService],
  controllers: [AccountsController]
})
export class AccountsModule {}
