import { Module } from '@nestjs/common';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { FolderStorageModule } from 'src/folder-storage/folder-storage.module'
import { AutomationModule } from 'src/automation/automation.module'
import { TelegramModule } from 'src/telegram/telegram.module'
import { PrismaLoggedModule } from 'src/prisma-logged/prisma-logged.module'

@Module({
  imports: [
    AuditLogModule,
    PrismaModule,
    CustomFieldsModule,
    FolderStorageModule,
    AutomationModule,
    TelegramModule,
    PrismaLoggedModule
  ],
  providers: [DealsService],
  controllers: [DealsController],
})
export class DealsModule {}
