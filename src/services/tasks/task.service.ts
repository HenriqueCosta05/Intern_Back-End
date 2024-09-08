import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOne(params: {
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput;
    token: string;
  }): Promise<Task | null> {
    const { taskWhereUniqueInput, token } = params;

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const task = await this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });

    if (task?.user_id !== payload.sub) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar essa tarefa',
      );
    }

    return task;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    token: string;
  }): Promise<Task[]> {
    const { skip, take, cursor, where, orderBy, token } = params;

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const userWhere = { ...where, user_id: payload.sub };

    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where: userWhere,
      orderBy,
    });
  }

  async createTask(params: {
    data: Prisma.TaskCreateInput;
    token: string;
  }): Promise<Task> {
    const { data, token } = params;

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const taskData = { ...data, user: { connect: { user_id: payload.sub } } };

    return this.prisma.task.create({
      data: taskData,
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
    token: string;
  }): Promise<Task> {
    const { where, data, token } = params;

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const task = await this.prisma.task.findUnique({
      where,
    });

    if (task?.user_id !== payload.sub) {
      throw new UnauthorizedException();
    }

    return this.prisma.task.update({
      data,
      where,
    });
  }

  async deleteTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    token: string;
  }): Promise<Task> {
    const { where, token } = params;

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });

    const task = await this.prisma.task.findUnique({
      where,
    });

    if (task?.user_id !== payload.sub) {
      throw new UnauthorizedException();
    }

    return this.prisma.task.delete({
      where,
    });
  }
}
