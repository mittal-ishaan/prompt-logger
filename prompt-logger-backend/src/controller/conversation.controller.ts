import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserParam } from 'src/decorators/UserParam';
import { User } from 'src/types/UserType';
import { ConversationDto } from 'src/dtos/ConversationsDto';
import { ConversationsService } from 'src/services/conversation.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationController {
  constructor(
    @Inject(ConversationsService) private clickhouse: ConversationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets the conversations for a user',
  })
  @ApiResponse({ status: 200, description: 'The conversations for the user' })
  async getConversations(@UserParam() user: User) {
    return this.clickhouse.getConversations(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creates a new conversation for a user',
  })
  @ApiResponse({ status: 200, description: 'The conversation ID' })
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
