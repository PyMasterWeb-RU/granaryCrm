import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaLoggedService } from './prisma-logged.service';

@Module({
  imports: [AuditLogModule],
  providers: [PrismaLoggedService, PrismaService],
  exports: [PrismaLoggedService],
})
export class PrismaLoggedModule {}
