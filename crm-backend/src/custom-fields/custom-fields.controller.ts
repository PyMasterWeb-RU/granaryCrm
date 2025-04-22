import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomFieldsService } from './custom-fields.service';

@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly customFieldsService: CustomFieldsService) {}

  @Get(':entity')
  getFields(@Param('entity') entity: string) {
    return this.customFieldsService.getFieldsForEntity(entity);
  }

  @Get(':entity/:id/values')
  getValues(@Param('entity') entity: string, @Param('id') id: string) {
    return this.customFieldsService.getValuesForEntity(entity, id);
  }

  @Post(':entity/:id/values')
  saveValues(
    @Param('entity') entity: string,
    @Param('id') entityId: string,
    @Body() values: Record<string, any>,
  ) {
    return this.customFieldsService.saveValues(entity, entityId, values);
  }
}
