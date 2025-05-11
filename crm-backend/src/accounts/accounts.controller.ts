import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Owns } from '../common/decorators/owns.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { AccountsService } from './accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get('my')
  async getMyAccount(@CurrentUser() user: any) {
    return this.accountsService.getMyAccount(user.userId);
  }

  @Patch('my')
  async updateMyAccount(
    @CurrentUser() user: any,
    @Body()
    body: {
      name?: string;
      industry?: string;
      phone?: string;
      email?: string;
      website?: string;
      address?: string;
      inn?: string;
      ogrn?: string;
      kpp?: string;
    },
  ) {
    return this.accountsService.updateMyAccount(user.userId, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findById(id);
  }

  @Post()
  create(@Body() body, @CurrentUser() user: any) {
    return this.accountsService.create({ ...body, ownerId: user.userId });
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @Owns('account')
  update(@Param('id') id: string, @Body() body) {
    return this.accountsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @Owns('account')
  remove(@Param('id') id: string) {
    return this.accountsService.delete(id);
  }
}
