import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteUser(@GetUser('id') userId: number) {
    await this.userService.deleteUser(userId);
  }
}
