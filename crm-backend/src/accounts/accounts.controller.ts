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
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Owns } from '../common/decorators/owns.decorator';
import { OwnershipGuard } from '../common/guards/ownership.guard';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll();
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
