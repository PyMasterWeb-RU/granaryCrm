import { Module } from '@nestjs/common';
import { EmailInboxController } from './email-inbox.controller';
import { PrismaService } from '../prisma/prisma.service';
import { EmailInboxService } from './email-inbox.service';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
  ],
  controllers: [EmailInboxController],
  providers: [EmailInboxService, PrismaService],
  exports: [EmailInboxService],
})
export class EmailInboxModule {}
