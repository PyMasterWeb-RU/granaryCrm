import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('deals-summary')
  getDealsSummary() {
    return this.service.getDealsSummary();
  }

  @Get('deals-by-month')
  getDealsByMonth() {
    return this.service.getDealsByMonth();
  }

  @Get('tasks-summary')
  getTasksSummary() {
    return this.service.getTasksSummary();
  }

  @Get('user-activity')
  getUserActivity() {
    return this.service.getUserActivity();
  }
}
