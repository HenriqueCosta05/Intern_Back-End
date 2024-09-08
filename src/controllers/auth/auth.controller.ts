import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async signUp(@Body() SignUpDto: Record<string, any>, @Res() res: Response) {
    const { access_token } = await this.authService.register(
      SignUpDto.name,
      SignUpDto.phone_number,
      SignUpDto.email,
      SignUpDto.password,
    );
    res.cookie('session_token', access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });
    return res.send({ message: 'Registro efetuado com sucesso!' });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() SignInDto: Record<string, any>, @Res() res: Response) {
    const { access_token } = await this.authService.signIn(
      SignInDto.email,
      SignInDto.password,
    );
    res.cookie('session_token', access_token, {
      secure: process.env.NODE_ENV === 'production',      
      httpOnly: true,

    });
    return res.send({ message: 'Login efetuado com sucesso!' });
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const token = req.cookies['session_token'];
    if (!token) {
      throw new UnauthorizedException({
        message: 'Token de sessão não encontrado!',
      });
    }
      const user = await this.authService.getProfile(token);
      return user;
    } catch (e) {
      throw new UnauthorizedException('Token de sessão inválido');
    }
  }
