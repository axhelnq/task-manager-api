import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegReq } from './dto/register.dto';
import { hash, verify } from 'argon2';
import type { JwtPayload } from './interfaces/jwt.interface';
import { LoginReq } from './dto/login.dto';
import type { Request, Response } from 'express';
import { isDev } from 'src/utils/isDev.util';
import { timeToMs } from 'src/utils/timeToMs.util';
import type { StringValue } from 'ms';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;
  private readonly JWT_ACCESS_TOKEN_TTL_MS: number;
  private readonly JWT_REFRESH_TOKEN_TTL_MS: number;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );

    this.JWT_ACCESS_TOKEN_TTL_MS = timeToMs(this.JWT_ACCESS_TOKEN_TTL);
    this.JWT_REFRESH_TOKEN_TTL_MS = timeToMs(this.JWT_REFRESH_TOKEN_TTL);

    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(dto: RegReq, res: Response) {
    const { name, email, password } = dto;

    const existUser = await this.prisma.user.findUnique({ where: { email } });

    if (existUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    return this.sendTokens(res, user.id);
  }

  async login(dto: LoginReq, res: Response) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await verify(user.password, password);

    if (!isPasswordValid) {
      throw new NotFoundException('User not found');
    }

    return this.sendTokens(res, user.id);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is not available');
    }

    const payload: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return this.sendTokens(res, user.id);
    }
  }

  private generateTokens(id: string) {
    const payload: JwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as StringValue | number,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as StringValue | number,
    });

    return { accessToken, refreshToken };
  }

  logout(res: Response) {
    this.setTokenToCookie(res, 'refreshToken', '', new Date(0));
    this.setTokenToCookie(res, 'accessToken', '', new Date(0));
    return true;
  }

  async validateUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private sendTokens(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    // Зберігаємо refresh token в куках
    this.setTokenToCookie(
      res,
      'refreshToken',
      refreshToken,
      new Date(Date.now() + this.JWT_REFRESH_TOKEN_TTL_MS),
    );

    // Зберігаємо access token в куках
    const accessTokenExpires = new Date(
      Date.now() + this.JWT_ACCESS_TOKEN_TTL_MS,
    );
    this.setTokenToCookie(res, 'accessToken', accessToken, accessTokenExpires);

    return { accessToken };
  }

  private setTokenToCookie(
    res: Response,
    name: string,
    token: string,
    expires: Date,
  ) {
    res.cookie(name, token, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: !isDev(this.configService) ? 'none' : 'lax',
    });
  }
}
