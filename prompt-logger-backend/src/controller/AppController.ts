import { Controller, Get, Request, Post, UseGuards, Inject, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { clickHouseService } from 'src/services/clickHouseService';
import { OpenAIService } from 'src/services/OpenAIService';
import { GetChatCompletionDto } from '../dtos/AppDtos';

@Controller()
export class AppController {
  constructor(private authService: AuthService,
              @Inject(clickHouseService) private clik: clickHouseService,
              @Inject(OpenAIService) private openai: OpenAIService) {}

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

  @Get('/openAI')
  getOpenAI(@Query() message: GetChatCompletionDto) {
    return this.openai.chatCompletion([{"role": "user", "content": message.content}]);
  }
}