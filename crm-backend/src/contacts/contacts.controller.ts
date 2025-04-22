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
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OwnershipGuard } from '../common/guards/ownership.guard';
import { Owns } from '../common/decorators/owns.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  @Post()
  create(@Body() body, @CurrentUser() user: any) {
    return this.contactsService.create({ ...body, ownerId: user.userId });
  }

  @Patch(':id')
  @UseGuards(OwnershipGuard)
  @Owns('contact')
  update(@Param('id') id: string, @Body() body) {
    return this.contactsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(OwnershipGuard)
  @Owns('contact')
  remove(@Param('id') id: string) {
    return this.contactsService.delete(id);
  }
}
