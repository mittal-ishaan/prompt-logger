import { Controller, Get, Request, Post, UseGuards, Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { clickHouseService } from 'src/services/clickHouseService';

@Controller()
export class AppController {
  constructor(private authService: AuthService,
              @Inject(clickHouseService) private clik: clickHouseService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get()
  getHello() {
    return this.clik.insert("Hello");
  }
}