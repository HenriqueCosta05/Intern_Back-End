import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '..';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(
        username: string,
        password: string,
    ): Promise<{access_token: string}> {
        const user = await this.usersService.findOne(username);
        if(user?.password !== password) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.user_id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}
