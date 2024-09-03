import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaClient;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaClient, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaClient>(PrismaClient);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should login a user', async () => {
    const loginDto = {
      email: 'john@doe.com',
      password: 'password',
    };

    const fakeUser = {
      user_id: '1',
      name: 'John Doe',
      phone_number: '1234567890',
      email: 'john@doe.com',
      password: 'hashedpassword',
    };

    (prisma.user.findUnique as jest.Mock).mockReturnValue(
      Promise.resolve(fakeUser),
    );
    (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
    (jest.spyOn(jwtService, 'sign') as jest.Mock).mockReturnValue('token');

    const result = await service.signIn(loginDto.email, loginDto.password);
    expect(result).toEqual({ access_token: 'token' });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginDto.email },
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      user_id: fakeUser.user_id,
    });
  });
  it('should register a user', async () => {
    const registerDto = {
      name: 'John Doe',
      phone_number: '1234567890',
      email: 'john@doe2.com',
      password: 'password',
    };

    const fakeUser = {
      user_id: '1',
      name: 'John Doe',
      phone_number: '1234567890',
      email: 'john@doe2.com',
      password: 'password',
    };

    (prisma.user.create as jest.Mock).mockReturnValue(
      Promise.resolve(fakeUser),
    );
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
      'hashedpassword',
    );
    (jest.spyOn(jwtService, 'sign') as jest.Mock).mockReturnValue('token');

    const result = await service.register(
      registerDto.name,
      registerDto.phone_number,
      registerDto.email,
      registerDto.password,
    );
    expect(result).toEqual({
      access_token: 'token',
    });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: registerDto.name,
        phone_number: registerDto.phone_number,
        email: registerDto.email,
        password: 'hashedpassword',
      },
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      user_id: fakeUser.user_id,
    });
  }, 30000);
});
