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
import { extname, join } from 'path';
import { existsSync } from 'fs';
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
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `avatar-${uniqueSuffix}${ext}`;
          const filePath = join(process.cwd(), 'uploads', 'avatars', filename);
          console.log('Saving file to:', filePath);
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)) {
          console.error('Invalid file type:', file.mimetype);
          return cb(new Error('Only image files are allowed!'), false);
        }
        console.log('File accepted:', file.originalname);
        cb(null, true);
      },
      limits: { fileSize: 800 * 1024 }, // 800KB
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      console.error('No file uploaded for user:', user.userId);
      throw new Error('No file uploaded');
    }
    const avatarPath = `/uploads/avatars/${file.filename}`;
    const filePath = join(process.cwd(), 'uploads', 'avatars', file.filename);
    console.log('Uploading avatar for user:', user.userId, 'Path:', avatarPath);
    if (!existsSync(filePath)) {
      console.error('File not found after upload:', filePath);
      throw new Error('File not found after upload');
    }
    try {
      const updatedUser = await this.usersService.updateAvatar(user.userId, avatarPath);
      console.log('Avatar updated successfully:', updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error updating avatar:', err);
      throw err;
    }
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