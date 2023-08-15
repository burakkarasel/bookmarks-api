import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class BookmarkDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEmpty()
  description?: string;

  @IsNotEmpty()
  @IsString()
  link: string;
}
