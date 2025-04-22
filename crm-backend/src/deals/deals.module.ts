import { Module } from '@nestjs/common';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';

@Module({
  imports: [AuditLogModule],
  providers: [DealsService],
  controllers: [DealsController],
})
export class DealsModule {}
