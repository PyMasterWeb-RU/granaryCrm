import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  // Получить все опции категории
  @Get('options/:category')
  getOptions(@Param('category') category: string) {
    return this.service.getOptions(category);
  }

  // Добавить новую опцию
  @Post('options/:category')
  createOption(@Param('category') category: string, @Body() body: { label: string; value: string; position?: number }) {
    return this.service.createOption(category, body.label, body.value, body.position || 0);
  }

  @Patch('options/:id')
  updateOption(@Param('id') id: string, @Body() body: { label: string; value: string; position: number }) {
    return this.service.updateOption(id, body.label, body.value, body.position);
  }

  @Delete('options/:id')
  deleteOption(@Param('id') id: string) {
    return this.service.deleteOption(id);
  }

  // Системные параметры
  @Get('system')
  getSystemSettings() {
    return this.service.getSystemSettings();
  }

  @Post('system')
  updateSystem(@Body() body: { key: string; value: string }) {
    return this.service.updateSystemSetting(body.key, body.value);
  }
}
