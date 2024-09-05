import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService tests', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, JwtService, AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = await service.register(
      mockUser.name,
      mockUser.phone_number,
      mockUser.email,
      mockUser.password,
    );
    expect(result).toHaveProperty('access_token');
    expect(usersService.createUser).toHaveBeenCalledWith({
      name: mockUser.name,
      phone_number: mockUser.phone_number,
      email: mockUser.email,
      password: expect.any(String),
    });
  });

  it('should login an existing user', async () => {
    const hashedPassword = await bcrypt.hash(mockUser.password, 10);
    (prismaService.user.findFirst as jest.Mock).mockResolvedValue({
      ...mockUser,
      password: hashedPassword,
    });

    const isPasswordValid = await bcrypt.compare(
      mockUser.password,
      hashedPassword,
    );
    if (isPasswordValid) {
      const result = await service.signIn(mockUser.email, mockUser.password);
      expect(result).toHaveProperty('access_token');
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
    }
  });
});
