import { TaskController } from '@/controllers/tasks/task.controller';
import { PrismaService } from '@/services/prisma/prisma.service';
import { TaskService } from '@/services/tasks/task.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  exports: [TaskService, PrismaService],
})
export class TaskModule {}
