import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserParam } from 'src/decorators/UserParam';
import { User } from 'src/types/UserType';
import { ConversationDto } from 'src/dtos/ConversationsDto';
import { ConversationsService } from 'src/services/conversation.service';

@Controller('conversations')
export class ConversationController {
  constructor(
    @Inject(ConversationsService) private clickhouse: ConversationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getConversations(@UserParam() user: User) {
    return this.clickhouse.getConversations(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async makeConversation(
    @Body() conversation: ConversationDto,
    @UserParam() user: User,
  ) {
    return this.clickhouse.makeConversation(
      user.userId,
      conversation.conversationName,
    );
  }
}
