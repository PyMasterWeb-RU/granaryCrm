import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  getOverview(@CurrentUser() user) {
    return this.dashboardService.getOverview(user.userId);
  }

  @Get('deals-by-stage')
  getDealsByStage(@CurrentUser() user) {
    return this.dashboardService.getDealsByStage(user.userId);
  }

  @Get('tasks-by-status')
  getTasksByStatus(@CurrentUser() user) {
    return this.dashboardService.getTasksByStatus(user.userId);
  }
}
