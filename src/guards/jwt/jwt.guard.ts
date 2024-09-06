import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['session_token'];
    console.log('Token:', token); 
    if (!token) {
      console.log('Não foi encontrado token de sessão'); 
      throw new UnauthorizedException('Não foi encontrado token de sessão');
    }

    try {
      const { access_token } = typeof token === 'string' ? { access_token: token } : token;
      const payload = await this.jwtService.verifyAsync(access_token);
      console.log('Payload:', payload); 
      request['user'] = payload;
      return true;
    } catch (e) {
      console.log('Token de sessão inválido', e); 
      throw new UnauthorizedException('Token de sessão inválido');
    }
  }
}