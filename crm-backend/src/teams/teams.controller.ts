import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RolesGuard } from 'src/common/guards/roles.guard'

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private service: TeamsService) {}

  @Post()
  @Roles('admin', 'superadmin')
  @UseGuards(RolesGuard)
  create(@Body('name') name: string) {
    return this.service.create(name);
  }

  @Get()
  list() {
    return this.service.list();
  }

  @Patch(':userId')
  @Roles('admin', 'superadmin')
  @UseGuards(RolesGuard)
  assign(@Param('userId') id: string, @Body('teamId') teamId: string) {
    return this.service.assignUser(id, teamId);
  }
}
