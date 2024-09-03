import { AuthGuard } from '@/guards/auth/auth.guard';
import { Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return 'Find all users';
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne() {
    return 'Find one user';
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update() {
    return 'Update user';
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove() {
    return 'Remove user';
  }

  /* IMPORTANTE: O método POST não faria sentido nesse caso, visto que usuários se cadastram e fazem login. */
}
