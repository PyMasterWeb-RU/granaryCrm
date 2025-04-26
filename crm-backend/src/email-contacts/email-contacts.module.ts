import { Module } from '@nestjs/common';
import { EmailContactsService } from './email-contacts.service';
import { EmailContactsController } from './email-contacts.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
  ],
  providers: [EmailContactsService],
  controllers: [EmailContactsController]
})
export class EmailContactsModule {}
