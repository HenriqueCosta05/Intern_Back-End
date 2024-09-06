import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './services/auth/auth.service';
import { PrismaService } from './services/prisma/prisma.service';
import { UsersService } from './services/users/users.service';
import { UsersController } from './controllers/users/users.controller';
import { TaskController } from './controllers/tasks/task.controller';
import { TaskService } from './services/tasks/task.service';
import { TaskModule } from './modules/tasks/task.module';
import { JwtMiddleware } from './middleware/jwt.middleware';

@Module({
  imports: [AuthModule, UsersModule, TaskModule],
  controllers: [AppController, AuthController, UsersController, TaskController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    PrismaService,
    TaskService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(UsersController, TaskController);
  }
}
