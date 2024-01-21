import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { clickHouseService } from 'src/services/clickHouseService';

@Controller('conversations')
export class ConversationController {
  constructor(@Inject(clickHouseService) private clikChat: clickHouseService) {}
  @Get()
  async getConversations(@Query() user: any) {
    return this.clikChat.getConversations(user.userId);
  }

  @Post()
  async makeConversation(@Body() conversation: any) {
    return this.clikChat.makeConversation(
      conversation.userId,
      conversation.conversationName,
    );
  }
}
