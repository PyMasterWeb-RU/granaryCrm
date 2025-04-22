import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
	Query,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Owns } from '../common/decorators/owns.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() body, @CurrentUser() user: any) {
    return this.service.create({ ...body, ownerId: user.userId });
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @Owns('activity')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @Owns('activity')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

	@Patch(':id/move')
	async moveActivity(@Param('id') id: string, @Body() body: { status: string }) {
		return this.service.moveToStatus(id, body.status);
	}

	@Get('kanban')
	getKanbanActivities() {
		return this.service.getKanbanActivities();
	}

	@Get('calendar')
	getCalendar(
		@Query('from') from: string,
		@Query('to') to: string,
		@Query('userId') userId?: string,
	) {
		return this.service.getCalendar(new Date(from), new Date(to), userId);
	}
}
