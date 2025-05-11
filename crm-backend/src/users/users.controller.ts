import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

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

  @Patch('me/notifications')
  async updateNotificationSettings(
    @CurrentUser() user: any,
    @Body('notificationsEnabled') notificationsEnabled: boolean,
  ) {
    return this.usersService.updateNotificationSettings(
      user.userId,
      notificationsEnabled,
    );
  }

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 800 * 1024 }, // 800KB
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('No file uploaded');
    return this.usersService.updateAvatar(
      user.userId,
      `/uploads/avatars/${file.filename}`,
    );
  }

  @Get('me/devices')
  async getDevices(@CurrentUser() user: any) {
    return this.usersService.getDevices(user.userId);
  }

  @Post('me/devices/:sessionId/logout')
  async logoutDevice(
    @CurrentUser() user: any,
    @Param('sessionId') sessionId: string,
  ) {
    return this.usersService.logoutDevice(user.userId, sessionId);
  }

  @Post('me/logout-all')
  async logoutAllDevices(@CurrentUser() user: any) {
    return this.usersService.logoutAllDevices(user.userId, user.token);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.changeRole(id, role);
  }
}
