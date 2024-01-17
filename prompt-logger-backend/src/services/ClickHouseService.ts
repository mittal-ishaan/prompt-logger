import { createClient } from '@clickhouse/client'
import { Inject } from '@nestjs/common';

export class clickHouseService {
    constructor(@Inject('CLICKHOUSE') private readonly client : any) {
    }

    async insert(data: any) {
        const insertQuery = `
      INSERT INTO your_database.Chats
      (ConversationId, ChatId, CreatedAt, Status, Request, Response, Model, "Total Tokens", "Prompt Tokens", "Completion Tokens")
      VALUES
      (${data.ConversationId}, , :CreatedAt, :Status, :Request, :Response, :Model, :TotalTokens, :PromptTokens, :CompletionTokens);
    `;
    }
} 