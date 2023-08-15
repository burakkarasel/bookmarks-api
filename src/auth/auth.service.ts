import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(dto: AuthDto): Promise<string> {
    try {
      // hash the password
      const hash = await argon.hash(dto.password);
      // create the user in DB
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
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

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }
      throw error;
    }
  }
  async signIn(dto: AuthDto): Promise<string> {
    // get the user from DB by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user is not present throw error
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // compare password and the hash
    const pwMatch = await argon.verify(user.hash, dto.password);

    // if they do not match throw error
    if (!pwMatch) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('SECRET_KEY'),
      expiresIn: this.configService.get('EXPIRES_IN'),
    });
  }
}
