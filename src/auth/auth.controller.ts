import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: AuthDto): Promise<object> {
    const token = await this.authService.signUp(dto);
    return { token };
  }

  @Post('sign-in')
  async signIn(@Body() dto: AuthDto): Promise<object> {
    const token = await this.authService.signIn(dto);
    return { token };
  }
}
