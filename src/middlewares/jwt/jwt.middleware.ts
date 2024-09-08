import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromCookies(req);

    if (!token) {
      throw new UnauthorizedException('Token de sessão não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      req['user'] = payload;
      next();
    } catch (e) {
      throw new UnauthorizedException('Token de sessão inválido');
    }
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies?.session_token;
  }
}