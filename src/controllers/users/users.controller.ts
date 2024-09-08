import { AuthGuard } from '@/guards/auth/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Put,
  UseGuards,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from '@/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne({
      user_id: id,
    });
    return user;
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    const updatedUser = await this.usersService.updateUser({
      data: updateUserDto,
      where: { user_id: id },
    });
    return updatedUser;
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const removedUser = await this.usersService.deleteUser({
      user_id: id,
    });
    return removedUser;
  }

  /* IMPORTANTE: O método POST não faria sentido nesse caso, visto que usuários se cadastram e fazem login. */
}
