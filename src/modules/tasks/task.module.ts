import { TaskController } from '@/controllers/tasks/task.controller';
import { PrismaService } from '@/services/prisma/prisma.service';
import { TaskService } from '@/services/tasks/task.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, JwtService],
  exports: [TaskService, PrismaService, JwtService],
})
export class TaskModule {}
