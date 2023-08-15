import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
