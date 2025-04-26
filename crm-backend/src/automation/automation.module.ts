import { Module, forwardRef } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { ActivitiesModule } from 'src/activities/activities.module';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    TelegramModule,
    forwardRef(() => ActivitiesModule),
  ],
  providers: [AutomationService],
  controllers: [AutomationController],
  exports: [AutomationService]
})
export class AutomationModule {}
