import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';

@Module({
  providers: [EmailTemplateService],
  controllers: [EmailTemplateController]
})
export class EmailTemplateModule {}
