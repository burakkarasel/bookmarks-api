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
  async getBookmarkById(@Param('bookmarkId', ParseIntPipe) bookmarkId: number) {
    const bookmark = await this.bookmarkService.getBookmarkById(bookmarkId);
    return bookmark;
  }

  @Get()
  async listBookmarksOfUser(@GetUser('id') userId: number) {
    const bookmarks = await this.bookmarkService.listBookmarksOfUser(userId);
    return bookmarks;
  }

  @Patch(':bookmarkId')
  async updateBookmarkDetails(
    @Param('bookmarkId', ParseIntPipe) bookmarkId: number,
    @Body() dto: BookmarkDto,
  ) {
    const updatedBookmark = await this.bookmarkService.updateBookmark(
      bookmarkId,
      dto,
    );
    return updatedBookmark;
  }

  @Delete(':bookmarkId')
  async deleteBookmark(@Param('bookmarkId', ParseIntPipe) bookmarkId: number) {
    await this.bookmarkService.deleteBookmark(bookmarkId);
    return { message: 'OK' };
  }
}
