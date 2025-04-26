import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'
import { PrismaLoggedModule } from 'src/prisma-logged/prisma-logged.module'

@Module({
  imports: [
    PrismaModule,
    CustomFieldsModule,
    PrismaLoggedModule
  ],
  providers: [ContactsService],
  controllers: [ContactsController]
})
export class ContactsModule {}
