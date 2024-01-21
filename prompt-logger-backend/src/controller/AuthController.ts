import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Inject,
  HttpException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { clickHouseService } from 'src/services/clickHouseService';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(clickHouseService) private clikChat: clickHouseService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async makeUser(@Body() user) {
    if ((await this.clikChat.getUsers(user.username)) != null) {
      throw new HttpException('User already exists', 400);
    }
    return this.clikChat.makeUser(user.username, user.password);
  }
}
