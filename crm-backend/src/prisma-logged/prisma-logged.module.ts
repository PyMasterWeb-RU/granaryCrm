import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaLoggedService } from './prisma-logged.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [AuditLogModule, PrismaModule, CustomFieldsModule],
  providers: [PrismaLoggedService, PrismaService],
  exports: [PrismaLoggedService],
})
export class PrismaLoggedModule {}
