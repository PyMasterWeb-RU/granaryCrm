import { Module } from '@nestjs/common';
import { UiConfigService } from './ui-config.service';
import { UiConfigController } from './ui-config.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
      PrismaModule,
      CustomFieldsModule,
    ],
  providers: [UiConfigService],
  controllers: [UiConfigController]
})
export class UiConfigModule {}
