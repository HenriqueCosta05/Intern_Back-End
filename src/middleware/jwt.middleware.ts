import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['session_token'];
    console.log('Token:', token); 
    if (!token) {
      console.log('Token de sessão não encontrado'); 
      throw new UnauthorizedException('Token de sessão não encontrado');
    }

    try {
      const { access_token } = typeof token === 'string' ? { access_token: token } : token;
      const payload = await this.jwtService.verifyAsync(access_token);
      console.log('Payload:', payload); 
      req['user'] = payload;
      next();
    } catch (e) {
      console.log('Token de sessão inválido', e); 
      throw new UnauthorizedException('Token de sessão inválido');
    }
  }
}