import { AuthGuard } from '@/guards/auth/auth.guard';
import { Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  @Get()
  findAll() {
    return 'Tasks';
  }

  @Get(':id')
  findOne() {
    return 'Task';
  }

  @Post()
  create() {
    return 'Create Task';
  }

  @Put(':id')
  update() {
    return 'Update Task';
  }

  @Delete(':id')
  delete() {
    return 'Delete Task';
  }
}
