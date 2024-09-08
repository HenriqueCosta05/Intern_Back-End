import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from '@/services/auth/auth.service';
import { UsersService } from '@/services/users/users.service';
import { AuthController } from '@/controllers/auth/auth.controller';
import { PrismaService } from '@/services/prisma/prisma.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService, UsersService],
})
export class AuthModule {}
