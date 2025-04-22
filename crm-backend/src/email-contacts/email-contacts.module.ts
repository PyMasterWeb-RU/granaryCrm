import { Module } from '@nestjs/common';
import { EmailContactsService } from './email-contacts.service';
import { EmailContactsController } from './email-contacts.controller';

@Module({
  providers: [EmailContactsService],
  controllers: [EmailContactsController]
})
export class EmailContactsModule {}
