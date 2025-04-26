import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express'; // для работы с куками
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto, res: Response) {
    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name,
        role: {
          connectOrCreate: {
            where: { name: 'user' },
            create: { name: 'user' },
          },
        },
      },
    });

    const token = this.jwt.sign({ sub: user.id });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // в dev оставляем false, чтобы работало по http
      sameSite: 'none', // чтобы браузер принял куку на кросс-сайте
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'ok' };
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Неверный email');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Неверный пароль');

    const token = this.jwt.sign({ sub: user.id });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
    });

    return { message: 'ok' };
  }
}
