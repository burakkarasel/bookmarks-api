import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  async createBookmark(userId: number, dto: BookmarkDto) {
    try {
      const bookmark = await this.prismaService.bookmark.create({
        data: {
          userId,
          title: dto.title,
          link: dto.link,
          description: dto.description,
        },
      });

      return bookmark;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException("User doesn't exists");
        }
      }
      throw error;
    }
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    if (bookmark.userId !== userId) {
      throw new ForbiddenException('Forbidden action');
    }
    return bookmark;
  }

  listBookmarksOfUser(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async updateBookmark(userId: number, bookmarkId: number, dto: BookmarkDto) {
    try {
      const updatedBookmark = await this.prismaService.bookmark.update({
        where: {
          id: bookmarkId,
        },
        data: {
          title: dto.title,
          description: dto.description,
          link: dto.link,
        },
      });

      if (!updatedBookmark) {
        throw new NotFoundException('Bookmark not found');
      }

      if (updatedBookmark.userId !== userId) {
        throw new ForbiddenException('Forbidden action');
      }

      return updatedBookmark;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Bookmark not found');
        }
      }
      throw error;
    }
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    try {
      const bookmark = await this.prismaService.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

      if (!bookmark) {
        throw new NotFoundException('Bookmark not found');
      }

      if (bookmark.userId !== userId) {
        throw new ForbiddenException('Forbidden action');
      }

      await this.prismaService.bookmark.delete({
        where: {
          id: bookmarkId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Bookmark not found');
        }
      }
      throw error;
    }
  }
}
