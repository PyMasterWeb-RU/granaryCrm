import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }, req: Request) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Извлекаем токен из заголовка или куки
    const token =
      ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
      req.cookies?.access_token;

    // Проверяем, существует ли сессия с данным токеном
    const session = await this.prisma.session.findUnique({
      where: { token },
    });
    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    // Проверяем, что пользователь существует
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Обновляем lastSeen
    await this.prisma.session.update({
      where: { id: session.id },
      data: { lastSeen: new Date() },
    });

    return { userId: user.id, email: user.email, token };
  }
}
