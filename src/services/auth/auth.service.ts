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

   const access_token = this.jwtService.sign({ sub: user.user_id });
   return { access_token };
  }

  async register(
    name: string,
    phone_number: string,
    email: string,
    password: string,
  ) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        'Email já cadastrado no sistema! Tente novamente com outro email.',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      name,
      phone_number,
      email,
      password: hashedPassword,
      tasks: {
        create: [],
      },
    });

    const access_token = this.jwtService.sign({ sub: user.user_id });
    return { access_token };
  }

  async getProfile(user_id: string) {
    try {
      const result = await this.usersService.findById(user_id);
      return result;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Token de sessão inválido',
      });
    }
  }

  async verifyToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
