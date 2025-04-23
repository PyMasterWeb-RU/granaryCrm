import { Module } from '@nestjs/common';
import { UiConfigService } from './ui-config.service';
import { UiConfigController } from './ui-config.controller';

@Module({
  providers: [UiConfigService],
  controllers: [UiConfigController]
})
export class UiConfigModule {}
