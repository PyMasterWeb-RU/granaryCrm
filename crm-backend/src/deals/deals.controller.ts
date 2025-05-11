import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Owns } from '../common/decorators/owns.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { DealsService } from './deals.service';

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get('cb-rate')
  async getCBRate(
    @Query('date') date: string,
    @Query('currency') currency: string,
  ) {
    console.log(`[getCBRate] Запрос курса: date=${date}, currency=${currency}`);
    // Проверка формата даты YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      console.error(`[getCBRate] Неверный формат даты: ${date}`);
      throw new BadRequestException('Invalid date format, expected YYYY-MM-DD');
    }

    // Парсинг даты в UTC
    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(parsed.getTime())) {
      console.error(`[getCBRate] Неверное значение даты: ${date}`);
      throw new BadRequestException('Invalid date value');
    }

    console.log(`[getCBRate] Парсированная дата: ${parsed.toISOString()}`);
    const rate = await this.dealsService.getCBRate(parsed, currency);
    console.log(`[getCBRate] Результат: rate=${rate}`);
    return { rate };
  }

  @Get()
  findAll() {
    console.log(`[findAll] Запрос всех сделок`);
    return this.dealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`[findOne] Запрос сделки с ID: ${id}`);
    return this.dealsService.findById(id);
  }

  @Post()
  create(@Body() body: any, @CurrentUser() user: any) {
    console.log(`[create] Входящие данные для создания сделки:`, body);
    const data = { ...body, ownerId: user.userId };
    console.log(`[create] Подготовленные данные:`, data);
    return this.dealsService.create(data);
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @Owns('deal')
  update(@Param('id') id: string, @Body() body: any) {
    console.log(`[update] Обновление сделки ${id}:`, body);
    return this.dealsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @Owns('deal')
  remove(@Param('id') id: string) {
    console.log(`[remove] Удаление сделки ${id}`);
    return this.dealsService.delete(id);
  }

  @Patch(':id/move')
  async moveDeal(@Param('id') id: string, @Body() body: { stage: string }) {
    console.log(`[moveDeal] Перемещение сделки ${id} в этап ${body.stage}`);
    return this.dealsService.moveToStage(id, body.stage);
  }

  @Get('kanban')
  getKanbanDeals() {
    console.log(`[getKanbanDeals] Запрос сделок для канбана`);
    return this.dealsService.getKanbanDeals();
  }
}
