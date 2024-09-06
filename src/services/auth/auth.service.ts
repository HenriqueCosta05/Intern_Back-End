import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Usuário não encontrado!',
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Credenciais Inválidas',
      });
    }
    const payload = { sub: user.user_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(
    name: string,
    phone_number: string,
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        message:
          'Email já cadastrado no sistema! Tente novamente com outro email.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      name,
      phone_number,
      email,
      password: hashedPassword,
    });

    const payload = { sub: user.user_id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

}
