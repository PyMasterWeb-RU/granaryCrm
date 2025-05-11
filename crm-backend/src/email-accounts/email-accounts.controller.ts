import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EmailAccountsService } from './email-accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('email-accounts')
export class EmailAccountsController {
  constructor(private readonly emailAccountsService: EmailAccountsService) {}

  @Get('me')
  async getMyEmailAccount(@CurrentUser() user: any) {
    return this.emailAccountsService.getMyEmailAccount(user.userId);
  }

  @Post()
  async updateEmailAccount(
    @CurrentUser() user: any,
    @Body()
    data: {
      email: string;
      smtpHost: string;
      smtpPort: number;
      smtpSecure: boolean;
      imapHost?: string;
      imapPort?: number;
      imapSecure?: boolean;
      password?: string;
    },
  ) {
    return this.emailAccountsService.updateEmailAccount(user.userId, data);
  }
}
