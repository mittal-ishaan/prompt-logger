import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { clickHouseService } from '../db/click-house.service';

@Injectable()
export class ConversationsService {
  constructor(
    @Inject(clickHouseService) private clickhouse: clickHouseService,
  ) {}

  async makeConversation(userId: string, conversationName: string) {
    const conversationId = uuidv4();
    await this.clickhouse.insert('Conversations', [
      {
        ConversationId: conversationId,
        UserId: userId,
        ConversationName: conversationName,
      },
    ]);
    return conversationId;
  }

  async getConversations(userId: string) {
    const ans = await this.clickhouse.select(
      'Conversations',
      `UserId = '${userId}'`,
    );
    return ans;
  }
}
