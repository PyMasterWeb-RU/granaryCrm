import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('automation')
export class AutomationController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getAll() {
    return this.prisma.automationRule.findMany();
  }

  @Post()
  create(@Body() body) {
    return this.prisma.automationRule.create({ data: body });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.prisma.automationRule.update({ where: { id }, data: body });
  }
}
