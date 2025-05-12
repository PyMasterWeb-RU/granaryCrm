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
import axios from 'axios'; // Импортируем axios для запросов к ip-api

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
        throw new ConflictException('Пользователь с таким email уже существует');
      }
      throw e;
    }

    const token = this.jwt.sign({ sub: user.id });
    console.log('Register: Created token for user:', user.id, 'Token:', token);

    // Получаем местоположение с помощью ip-api
    let location = 'Unknown Location';
    try {
      const ip = res.req.ip || '127.0.0.1';
      console.log('Register: Fetching location for IP:', ip);
      const geo = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip`).then(res => res.data);
      console.log('Register: Geo response:', geo);
      if (geo.status !== 'success') {
        console.error('Register: GeoIP failed:', geo.message);
      } else {
        const parts = [
          geo.city || 'Unknown',
          geo.regionName || 'Unknown',
          geo.country || 'Unknown',
          geo.zip || ''
        ].filter(part => part); // Убираем пустые части
        location = parts.join(', ');
      }
    } catch (err) {
      console.error('Register: GeoIP error:', err.message);
    }

    try {
      await this.prisma.session.create({
        data: {
          userId: user.id,
          deviceName: res.req.headers['user-agent'] || 'Unknown Device',
          lastSeen: new Date(),
          location,
          token,
        },
      });
      console.log('Register: Session created for user:', user.id, 'Location:', location);
    } catch (err) {
      console.error('Register: Failed to create session:', err);
      throw new Error('Failed to create session');
    }

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
    console.log('Login: Created token for user:', user.id, 'Token:', token);

    // Получаем местоположение с помощью ip-api
    let location = 'Unknown Location';
    try {
      const ip = res.req.ip || '127.0.0.1';
      console.log('Login: Fetching location for IP:', ip);
      const geo = await axios.get(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,zip`).then(res => res.data);
      console.log('Login: Geo response:', geo);
      if (geo.status !== 'success') {
        console.error('Login: GeoIP failed:', geo.message);
      } else {
        const parts = [
          geo.city || 'Unknown',
          geo.regionName || 'Unknown',
          geo.country || 'Unknown',
          geo.zip || ''
        ].filter(part => part); // Убираем пустые части
        location = parts.join(', ');
      }
    } catch (err) {
      console.error('Login: GeoIP error:', err.message);
    }

    try {
      await this.prisma.session.create({
        data: {
          userId: user.id,
          deviceName: res.req.headers['user-agent'] || 'Unknown Device',
          lastSeen: new Date(),
          location,
          token,
        },
      });
      console.log('Login: Session created for user:', user.id, 'Location:', location);
    } catch (err) {
      console.error('Login: Failed to create session:', err);
      throw new Error('Failed to create session');
    }

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