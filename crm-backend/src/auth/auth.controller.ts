import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express'; // обязательно импортируем!
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response, // добавляем Response
  ) {
    return this.authService.register(dto, res); // передаём Response в сервис
  }

  @Public()
  @Post('login')
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response, // добавляем Response
  ) {
    return this.authService.login(dto, res); // передаём Response в сервис
  }
}
