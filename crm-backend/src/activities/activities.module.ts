import { Module } from '@nestjs/common';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesCron } from './activities.cron';
import { ActivitiesService } from './activities.service';

@Module({
  imports: [AuditLogModule],
  providers: [ActivitiesService, ActivitiesCron],
  controllers: [ActivitiesController],
})
export class ActivitiesModule {}
