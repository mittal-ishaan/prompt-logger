import {
  Controller,
  Get,
  Post,
  UseGuards,
  Inject,
  Query,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { clickHouseService } from 'src/services/clickHouseService';
import { OpenAIService } from 'src/services/OpenAIService';
import { AppService } from 'src/services/AppService';
import { User } from './RequestTypes';
import { UserParam } from 'src/decorators/UserParam';
import { FilterOptionsDto } from 'src/dtos/FilterOptionsDtos';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    @Inject(clickHouseService) private clikChat: clickHouseService,
    @Inject(OpenAIService) private openai: OpenAIService,
    @Inject(AppService) private appService: AppService,
  ) {}

  //implement its decorator later
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@UserParam() user: User) {
    return user;
  }

  @Get('/health')
  async getHealth() {
    return this.appService.getHealth();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/chats')
  async getChats(@Body() options: FilterOptionsDto, @UserParam() user: User) {
    console.log(user);
    let ids = [];
    if (options.conversationId) {
      ids = [options.conversationId];
    } else {
      const ans = await this.clikChat.getConversations(user.userId);
      ids = ans.map((x) => x.ConversationId);
    }
    const ans = await this.clikChat.getChats(options, ids);
    const result = {};
    result['chats'] = ans;
    return result;
  }

  @Get('/stats')
  async getStats(@Query() userId: any) {
    const ans = await this.clikChat.getStats(userId.userId);
    return ans;
  }

  @Post('/csv')
  async getCSV() {
    return this.clikChat.getCSV();
  }
}
