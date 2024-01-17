import { Controller, Get, Request, Post, UseGuards, Inject, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { clickHouseService } from 'src/services/clickHouseService';
import { OpenAIService } from 'src/services/OpenAIService';
import { GetChatCompletionDto } from '../dtos/AppDtos';
import { ChatCompletion } from 'openai/resources';

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
  async getOpenAI(@Query() message: GetChatCompletionDto) {
    let output: ChatCompletion;
    try {
      output = await this.openai.chatCompletion([{"role": "user", "content": message.content}], message.model);
    } catch(err) {
      console.log(err);
      throw err;
    }
    //this.clik.insert(output);
    console.log(output);
    return output.choices[0].message.content;
  }
}

//DB SCHEMA.
//RETRIVE A SPECIFIC CONVERSATION AND PASS IT AS HISTORY.
//Find all metrics for a specific user with filters.