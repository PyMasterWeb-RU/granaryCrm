import { Module } from '@nestjs/common';
import { ImapService } from './imap.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailSyncTask } from './sync.task'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
        PrismaModule,
        CustomFieldsModule,
      ],
  providers: [ImapService, PrismaService, EmailSyncTask],
  exports: [ImapService],
})
export class ImapModule {}
