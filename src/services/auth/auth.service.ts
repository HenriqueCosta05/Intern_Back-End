import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '..';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async signIn(
        email: string,
        password: string,
    ): Promise<{access_token: string}> {
        const user = await this.usersService.findByEmail(email);
        if(user?.password !== bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException();
        }
        const payload = {sub: user.user_id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
    }

    async register(
        name: string,
        phone_number: string,
        email: string,
        password: string,
    ): Promise<{access_token: string}> {
        const user = await this.usersService.createUser({
            user_id: '',
            name,
            phone_number,
            email,
            password: bcrypt.hashSync(password, 10),
        });
        const payload = {sub: user.user_id};
        return {
            access_token: await this.jwtService.signAsync(payload),
        }
}

    async validateUser(userId: string): Promise<any> {
        return this.usersService.findOne({user_id: userId});
    }
}
