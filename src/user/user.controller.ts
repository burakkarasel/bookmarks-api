import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserDetails(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async updateUserDetails(@GetUser('id') userId: number) {
    return { userId };
  }
}
