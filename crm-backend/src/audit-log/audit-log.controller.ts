import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get(':entity/:id')
  getLogs(@Param('entity') entity: string, @Param('id') id: string) {
    return this.auditLogService.getLogsForEntity(entity, id);
  }
}
