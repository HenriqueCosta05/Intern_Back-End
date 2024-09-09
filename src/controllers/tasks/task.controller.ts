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
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  private extractToken(req): string {
    const token = req.cookies?.session_token;
    if (!token) {
      throw new UnauthorizedException('Token de sessão não encontrado');
    }
    return token;
  }

  @Get()
  async findAll(@Request() req) {
    const token = this.extractToken(req);
    return this.taskService.findAll({
      token,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const token = this.extractToken(req);
    return this.taskService.findOne({
      taskWhereUniqueInput: { task_id: id },
      token,
    });
  }

  @Post()
  async create(@Body() taskDto: any, @Request() req) {
    const token = this.extractToken(req);
    const task: Prisma.TaskCreateInput = {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
      user: {
        connect: { user_id: taskDto.user_id },
      }
    };
    return this.taskService.createTask({
      data: task,
      token,
    });
  }

  @Put(':id')
  async update(@Body() taskDto: any, @Param('id') id: string, @Request() req) {
    const token = this.extractToken(req);
    const task: Prisma.TaskUpdateInput = {
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
      user: {
        connect: { user_id: taskDto.user_id },
      },
    };
    return this.taskService.updateTask({
      where: { task_id: id },
      data: task,
      token,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    const token = this.extractToken(req);
    return this.taskService.deleteTask({
      where: { task_id: id },
      token,
    });
  }
}