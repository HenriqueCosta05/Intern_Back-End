import { AuthService } from '@/services/auth/auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() SignInDto: Record<string, any>) {
    return this.authService.signIn(SignInDto.email, SignInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() SignUpDto: Record<string, any>) {
    return this.authService.register(
      SignUpDto.name,
      SignUpDto.phone_number,
      SignUpDto.email,
      SignUpDto.password,
    );
  }
}
