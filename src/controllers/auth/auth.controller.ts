import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../../services/auth/auth.service';
import { JwtAuthGuard } from '../../guards/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() SignInDto: Record<string, any>, @Res() res: Response) {
    const token = await this.authService.signIn(
      SignInDto.email,
      SignInDto.password,
    );
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Apenas em produção
      sameSite: 'strict',
    });
    return res.send({ message: 'Login efetuado com sucesso!' });
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() SignUpDto: Record<string, any>, @Res() res: Response) {
    const token = await this.authService.register(
      SignUpDto.name,
      SignUpDto.phone_number,
      SignUpDto.email,
      SignUpDto.password,
    );
    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.send({ message: 'Registro efetuado com sucesso!' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    return { message: 'Usuário autenticado:', user };
  }
}
