import { AuthGuard } from '@/guards/auth/auth.guard';
import { TaskService } from '@/services/tasks/task.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.taskService.findAll({
      token,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.taskService.findOne({
      taskWhereUniqueInput: { task_id: id },
      token,
    });
  }

  @Post()
  async create(@Body() taskDto: any, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    const task: Prisma.TaskCreateInput = {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
      user: {
        connect: { user_id: taskDto.user_id },
      },
    };
    return this.taskService.createTask({
      data: task,
      token,
    });
  }

  @Put(':id')
  async update(@Body() task: Task, @Param('id') id: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.taskService.updateTask({
      where: { task_id: id },
      data: task,
      token,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.taskService.deleteTask({
      where: { task_id: id },
      token,
    });
  }
}