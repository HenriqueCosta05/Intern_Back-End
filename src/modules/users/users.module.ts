import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from '@/services/users/users.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '@/services/prisma/prisma.service';
@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersService, PrismaService],
  exports: [UsersService, PrismaService],
})
export class UsersModule {}
