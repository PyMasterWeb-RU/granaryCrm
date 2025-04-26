import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
  ],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService], // <-- обязательно экспортируем!
})
export class AuditLogModule {}
