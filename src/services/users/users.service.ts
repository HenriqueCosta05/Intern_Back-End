import { Injectable } from '@nestjs/common';
import { User } from 'src/types';

@Injectable()
export class UsersService {
    
    async findOne(email: string): Promise<User | undefined> {
        return this.users.find
    }
}
