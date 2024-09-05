import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../../modules/auth/auth.module';
import { mockUser } from '__mocks__/auth-service.mock';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
      providers: [UsersService, JwtService, PrismaService, AuthService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const user = mockUser;
    const result = await service.createUser(user);
    expect(result).toHaveProperty('user_id');
  });

  it('should find a user by email', async () => {
    const user = mockUser;
    const result = await service.findByEmail(user.email);
    expect(result).toHaveProperty('user_id');
  });

  it('should find all users', async () => {
    const result = await service.findAll({});
    expect(result).toHaveLength(1);
  });

  it('should update a user', async () => {
    const user = mockUser;
    const result = await service.updateUser({
      where: { user_id: user.user_id },
      data: { name: 'new name' },
    });
    expect(result).toHaveProperty('user_id');
  });

  it('should delete a user', async () => {
    const user = mockUser;
    const result = await service.deleteUser({ user_id: user.user_id });
    expect(result).toEqual(user);
  });

});
