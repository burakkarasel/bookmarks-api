import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookmarkDto } from './dto/bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prismaService: PrismaService) {}

  createBookmark(userId: number, dto: BookmarkDto) {
    return this.prismaService.bookmark.create({
      data: {
        userId,
        title: dto.title,
        link: dto.link,
        description: dto.description,
      },
    });
  }

  getBookmarkById(bookmarkId: number) {
    return this.prismaService.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
  }

  listBookmarksOfUser(userId: number) {
    return this.prismaService.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
  }

  updateBookmark(bookmarkId: number, dto: BookmarkDto) {
    return this.prismaService.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        link: dto.link,
      },
    });
  }

  deleteBookmark(bookmarkId: number) {
    return this.prismaService.bookmark.delete({
      where: {
        id: bookmarkId,
      },
      select: {
        id: true,
      },
    });
  }
}
