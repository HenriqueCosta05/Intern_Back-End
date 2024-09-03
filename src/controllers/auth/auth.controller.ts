import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { AuthService } from 'src/services';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  signIn(@Body() SignInDto: Record<string, any>) {
    return this.authService.signIn(SignInDto.email, SignInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('auth/register')
  signUp(@Body() SignUpDto: Record<string, any>) {
    return this.authService.register(
      SignUpDto.name,
      SignUpDto.phone_number,
      SignUpDto.email,
      SignUpDto.password,
    );
  }

}
