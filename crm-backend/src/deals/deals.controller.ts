import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Owns } from '../common/decorators/owns.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll() {
    return this.dealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findById(id);
  }

  @Post()
  create(@Body() body, @CurrentUser() user: any) {
    return this.dealsService.create({ ...body, ownerId: user.userId });
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @Owns('deal')
  update(@Param('id') id: string, @Body() body) {
    return this.dealsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @Owns('deal')
  remove(@Param('id') id: string) {
    return this.dealsService.delete(id);
  }

	@Patch(':id/move')
	async moveDeal(@Param('id') id: string, @Body() body: { stage: string }) {
		return this.dealsService.moveToStage(id, body.stage);
	}

	@Get('kanban')
	getKanbanDeals() {
		return this.dealsService.getKanbanDeals();
	}
}
