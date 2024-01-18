import { Controller, Get, Request, Post, UseGuards, Inject, Query, Body } from '@nestjs/common';
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
              @Inject(clickHouseService) private clikChat: clickHouseService,
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

  // @Get()
  // getHello() {
  //   return this.clik.insert("Hello");
  // }

  @Get('/conversations')
  async getConversations(@Query() user: any) {
    return this.clikChat.getConversations(user.userId);
  }

  @Post('/conversations')
  async makeConversation(@Query() conversation: any) {
    return this.clikChat.makeConversation(conversation.userId, conversation.conversationName);
  }

  @Post('/signup')
  async makeUser(@Query() user: any) { 
    return this.clikChat.makeUser(user.username, user.password);
  }

  @Post('/openAI')
  async getOpenAI(@Body() message: GetChatCompletionDto) {
    let output: ChatCompletion;
    let latency: number;
    try {
      const start = new Date().getTime();
      output = await this.openai.chatCompletion([{"role": "user", "content": message.content}], message.model);
      latency = new Date().getTime() - start;
    } catch(err) {
      await this.clikChat.insertDataFailure(message, err.error.message, err.status);
      throw err;
    }
    await this.clikChat.insertData(message, output, "200", latency);
    return output.choices[0].message.content;
  }

  @Get('/chats')
  async getChats(@Query() options: any) {
    return this.clikChat.getChats(options);
  }
}