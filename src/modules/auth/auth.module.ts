import { Module } from '@nestjs/common';
import { UsersModule } from '..';
import { AuthService } from 'src/services';
import { AuthController } from 'src/controllers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';

@Module({
    imports: [UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '3600s'},
        })
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {
    
}
