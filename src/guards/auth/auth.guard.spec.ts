import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'secret' });
    guard = new AuthGuard(jwtService);
  });
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
