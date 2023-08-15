import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserRequest } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  getUserDetails(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  updateUserDetails(userId: number, dto: UpdateUserRequest) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });
  }
}
