import { Module } from '@nestjs/common';
import { UsersService } from 'src/services';

@Module({
    imports: [],
    controllers: [],
    providers: [UsersService],
})
export class UsersModule {}
