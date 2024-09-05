import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { mockUser, authServiceMock } from '__mocks__/auth-service.mock';

describe('AuthController', () => {
  let controller: AuthController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a new user', async () => {
    const result = await controller.signUp(mockUser);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const result = await controller.signIn(mockUser);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('token');
  });
});
