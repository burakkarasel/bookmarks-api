import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  ParseIntPipe,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { GetUser } from '../auth/decorator';
import { BookmarkDto } from './dto/bookmark.dto';

@UseGuards(JwtGuard)
@Controller('api/v1/bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  async createBookmark(
    @GetUser('id') userId: number,
    @Body() dto: BookmarkDto,
  ) {
    const bookmark = await this.bookmarkService.createBookmark(userId, dto);
    return bookmark;
  }

  @Get(':bookmarkId')
  async getBookmarkById(
    @GetUser('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    const bookmark = await this.bookmarkService.getBookmarkById(
      userId,
      bookmarkId,
    );
    return bookmark;
  }

  @Get()
  async listBookmarksOfUser(@GetUser('id') userId: number) {
    const bookmarks = await this.bookmarkService.listBookmarksOfUser(userId);
    return bookmarks;
  }

  @Patch(':bookmarkId')
  async updateBookmarkDetails(
    @GetUser('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    @Body() dto: BookmarkDto,
  ) {
    const updatedBookmark = await this.bookmarkService.updateBookmark(
      userId,
      bookmarkId,
      dto,
    );
    return updatedBookmark;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookmarkId')
  async deleteBookmark(
    @GetUser('id') userId: number,
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
  ) {
    await this.bookmarkService.deleteBookmark(userId, bookmarkId);
    return { message: 'OK' };
  }
}
