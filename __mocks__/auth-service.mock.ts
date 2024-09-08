import { User } from '@prisma/client';
import { AuthService } from '@/services/auth/auth.service';

export const mockUser = {
  name: 'John Doe',
  phone_number: '1234567890',
  email: 'john@doe.com',
  password: 'password',
} as User;

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    register: jest.fn().mockResolvedValue({ access_token: 'token' }),
    signIn: jest.fn().mockResolvedValue({ access_token: 'token' }),
    resetPassword: jest
      .fn()
      .mockResolvedValue({ message: 'Password reset successfully' }),
  },
};
