import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
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

  async validateUser(userId: string): Promise<any> {
    return this.usersService.findOne({ user_id: userId });
  }
}
