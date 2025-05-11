import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
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

    let user;
    try {
      user = await this.prisma.user.create({
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
    } catch (e: any) {
      if (
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2002' &&
        (e.meta?.target as string[]).includes('email')
      ) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
      throw e;
    }

    const token = this.jwt.sign({ sub: user.id });

    // Создаем сессию
    await this.prisma.session.create({
      data: {
        userId: user.id,
        deviceName: res.req.headers['user-agent'] || 'Unknown Device',
        lastSeen: new Date(),
        location: 'Unknown Location', // Можно заменить на геолокацию
        token,
      },
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
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

    // Создаем сессию
    await this.prisma.session.create({
      data: {
        userId: user.id,
        deviceName: res.req.headers['user-agent'] || 'Unknown Device',
        lastSeen: new Date(),
        location: 'Unknown Location', // Можно заменить на геолокацию
        token,
      },
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    return { message: 'ok' };
  }
}
