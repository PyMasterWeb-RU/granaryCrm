import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PrismaModule } from 'src/prisma/prisma.module'
import { CustomFieldsModule } from 'src/custom-fields/custom-fields.module'

@Module({
  imports: [
      PrismaModule,
      CustomFieldsModule,
    ],
  providers: [SettingsService],
  controllers: [SettingsController]
})
export class SettingsModule {}
