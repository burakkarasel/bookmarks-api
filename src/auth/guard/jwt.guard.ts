import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwtAccessToken') {
  constructor() {
    super();
  }
}
