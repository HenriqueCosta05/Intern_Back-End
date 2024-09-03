import { jwtConstants } from '@/constants/jwt-constants';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from '@/services/auth/auth.service';
import { UsersService } from '@/services/users/users.service';
import { AuthController } from '@/controllers/auth/auth.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AuthService, UsersService, JwtModule],
  controllers: [AuthController],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
