import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { clickHouseService } from 'src/services/clickHouseService';
import { UserParam } from 'src/decorators/UserParam';
import { User } from 'src/types/UserType';
import { ConversationDto } from 'src/dtos/ConversationsDto';

@Controller('conversations')
export class ConversationController {
  constructor(@Inject(clickHouseService) private clikChat: clickHouseService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversations(@UserParam() user: User) {
    return this.clikChat.getConversations(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async makeConversation(
    @Body() conversation: ConversationDto,
    @UserParam() user: User,
  ) {
    return this.clikChat.makeConversation(
      user.userId,
      conversation.conversationName,
    );
  }
}
