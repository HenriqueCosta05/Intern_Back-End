import { PrismaClient, Task, User } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should create a task', async () => {
    const user = await prisma.user.create({
      data: {
        user_id: '1',
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@doe.com',
        password: 'password',
      },
    });

    const task = await prisma.task.create({
      data: {
        task_id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        user: { connect: { user_id: user.user_id } },
      },
    });

    expect(task).toMatchObject({
      task_id: '1',
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      user_id: user.user_id,
    });
  });

  it('should find all tasks', async () => {
    const user = await prisma.user.create({
      data: {
        user_id: '1',
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@doe.com',
        password: 'password',
      },
    });

    await prisma.task.createMany({
      data: [
        {
          task_id: '1',
          title: 'Test Task 1',
          description: 'This is a test task 1',
          status: 'pending',
          user_id: user.user_id,
        },
        {
          task_id: '2',
          title: 'Test Task 2',
          description: 'This is a test task 2',
          status: 'completed',
          user_id: user.user_id,
        },
      ],
    });

    const tasks = await prisma.task.findMany();
    expect(tasks.length).toBe(2);
  });

  it('should find a task by id', async () => {
    const user = await prisma.user.create({
      data: {
        user_id: '1',
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@doe.com',
        password: 'password',
      },
    });

    const createdTask = await prisma.task.create({
      data: {
        task_id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        user_id: user.user_id,
      },
    });

    const task = await prisma.task.findUnique({
      where: { task_id: createdTask.task_id },
    });

    expect(task).toMatchObject({
      task_id: '1',
      title: 'Test Task',
      description: 'This is a test task',
      status: 'pending',
      user_id: user.user_id,
    });
  });

  it('should update a task', async () => {
    const user = await prisma.user.create({
      data: {
        user_id: '1',
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@doe.com',
        password: 'password',
      },
    });

    const createdTask = await prisma.task.create({
      data: {
        task_id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        user_id: user.user_id,
      },
    });

    const updatedTask = await prisma.task.update({
      where: { task_id: createdTask.task_id },
      data: { status: 'completed' },
    });

    expect(updatedTask.status).toBe('completed');
  });

  it('should delete a task', async () => {
    const user = await prisma.user.create({
      data: {
        user_id: '1',
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'john@doe.com',
        password: 'password',
      },
    });

    const createdTask = await prisma.task.create({
      data: {
        task_id: '1',
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        user_id: user.user_id,
      },
    });

    await prisma.task.delete({
      where: { task_id: createdTask.task_id },
    });

    const task = await prisma.task.findUnique({
      where: { task_id: createdTask.task_id },
    });

    expect(task).toBeNull();
  });
});
