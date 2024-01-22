import { Controller, Get, Post, UseGuards, Inject, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppService } from 'src/services/app.service';
import { User } from 'src/types/UserType';
import { UserParam } from 'src/decorators/UserParam';
import { FilterOptionsDto } from 'src/dtos/FilterOptionsDtos';
import { ConversationsService } from 'src/services/conversation.service';
import { ChatService } from 'src/services/chat.service';
import { StatsService } from 'src/services/stats.service';

@Controller()
export class AppController {
  constructor(
    @Inject(ChatService) private readonly chat: ChatService,
    @Inject(ConversationsService)
    private readonly conversations: ConversationsService,
    @Inject(StatsService) private readonly stats: StatsService,
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
    let ids = [];
    if (options.conversationId) {
      ids = [options.conversationId];
    } else {
      const ans = await this.conversations.getConversations(user.userId);
      ids = ans.map((x) => x.ConversationId);
    }
    const ans = await this.chat.getChats(options, ids);
    const result = {};
    result['chats'] = ans;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/stats')
  async getStats(@UserParam() user: User) {
    const ans = await this.stats.getStats(user.userId);
    return ans;
  }

  //to be implemented -Export to CSV in dashboard
  // @Post('/csv')
  // async getCSV() {
  //   return this.clikChat.getCSV();
  // }
}
