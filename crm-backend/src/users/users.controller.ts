import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.userId);
  }

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('me')
  async updateProfile(@CurrentUser() user: any, @Body('name') name: string) {
    return this.usersService.updateName(user.userId, name);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.changeRole(id, role);
  }
}
