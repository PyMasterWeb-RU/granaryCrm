import { Module, forwardRef } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { ActivitiesCron } from './activities.cron';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AutomationModule } from 'src/automation/automation.module'; // 🧠 Добавь импорт, если есть связь
import { TelegramModule } from 'src/telegram/telegram.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { PrismaLoggedModule } from 'src/prisma-logged/prisma-logged.module'
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
  imports: [
    AutomationModule,
    TelegramModule,
    CustomFieldsModule,
    PrismaLoggedModule,
    AuditLogModule,
    PrismaModule,
    forwardRef(() => AutomationModule),
  ],
  providers: [ActivitiesService, ActivitiesCron],
  controllers: [ActivitiesController],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
