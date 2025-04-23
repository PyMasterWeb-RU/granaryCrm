import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UiConfigService } from './ui-config.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('ui-config')
export class UiConfigController {
  constructor(private readonly service: UiConfigService) {}

  @Get(':entity')
  get(@Param('entity') entity: string) {
    return this.service.getFields(entity);
  }

  @Put(':entity')
  update(
    @Param('entity') entity: string,
    @Body()
    fields: {
      name: string;
      label: string;
      section?: string;
      visible: boolean;
      required: boolean;
      order: number;
    }[],
  ) {
    return this.service.updateFields(entity, fields);
  }
}
