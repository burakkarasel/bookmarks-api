import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UpdateUserRequest } from './dto';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserDetails(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async updateUserDetails(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserRequest,
  ) {
    const user = await this.userService.updateUserDetails(userId, dto);
    return user;
  }

  @Delete()
  async deleteUser(@GetUser('id') userId: number) {
    await this.userService.deleteUser(userId);
    return { message: 'OK' };
  }
}
