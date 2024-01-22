import { Controller, Get, Post, UseGuards, Inject, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppService } from 'src/services/app.service';
import { User } from 'src/types/UserType';
import { UserParam } from 'src/decorators/UserParam';
import { FilterOptionsDto } from 'src/dtos/FilterOptionsDtos';
import { ConversationsService } from 'src/services/conversation.service';
import { ChatService } from 'src/services/chat.service';
import { StatsService } from 'src/services/stats.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Chats, stats and health')
@Controller()
export class AppController {
  constructor(
    @Inject(ChatService) private readonly chat: ChatService,
    @Inject(ConversationsService)
    private readonly conversations: ConversationsService,
    @Inject(StatsService) private readonly stats: StatsService,
    @Inject(AppService) private appService: AppService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets a users details if they are logged in. This is used to check if a user is logged in.',
  })
  @ApiResponse({ status: 200, description: 'The profile details.' })
  getProfile(@UserParam() user: User) {
    return user;
  }

  @Get('/health')
  @ApiOperation({ summary: 'Gets the health of the server' })
  @ApiResponse({ status: 200, description: 'The health of the server' })
  async getHealth() {
    return this.appService.getHealth();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/chats')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets the chats for a user based on the filters provided. If no filters are provided, all chats are returned.',
  })
  @ApiResponse({ status: 200, description: 'The chats for the user' })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Gets the stats for a user. This includes the number of requests, latency, and the number of failures.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The stats for the user including number of request, latency, p95 latency, average latency and the number of failures overall and foor last five days of the user logged in.',
  })
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
