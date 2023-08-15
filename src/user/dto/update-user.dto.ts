import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
