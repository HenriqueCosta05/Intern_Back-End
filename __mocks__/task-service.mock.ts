import { Task } from '@prisma/client';
import { mockUser } from './auth-service.mock';

export const mockTask = {
  title: 'Test Task',
  description: 'This is a test task',
  status: 'pending',
  user_id: mockUser.user_id,
} as Task;

export const mockTasks = [
  {
    task_id: '1',
    title: 'Test Task 1',
    description: 'This is a test task 1',
    status: 'pending',
    user_id: mockUser.user_id,
  },
  {
    task_id: '2',
    title: 'Test Task 2',
    description: 'This is a test task 2',
    status: 'completed',
    user_id: mockUser.user_id,
  },
] as Task[];

export const TaskService = {
  createTask: jest.fn().mockResolvedValue(mockTask),
  findAll: jest.fn().mockResolvedValue(mockTasks),
  findOne: jest.fn().mockResolvedValue(mockTask),
  updateTask: jest.fn().mockResolvedValue(mockTask),
  deleteTask: jest.fn().mockResolvedValue(mockTask),
};
