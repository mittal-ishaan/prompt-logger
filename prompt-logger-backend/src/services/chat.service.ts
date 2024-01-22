import { Inject, Injectable } from '@nestjs/common';
import { ChatCompletion } from 'openai/resources';
import { GetChatCompletionDto } from 'src/dtos/GetChatCompletionDto';
import { v4 as uuidv4 } from 'uuid';
import { clickHouseService } from '../db/click-house.service';
import { FilterOptionsDto } from 'src/dtos/FilterOptionsDtos';

@Injectable()
export class ChatService {
  constructor(
    @Inject(clickHouseService) private clickhouse: clickHouseService,
  ) {}

  async insertChatSuccess(
    input: GetChatCompletionDto,
    output: ChatCompletion,
    latency: number,
  ) {
    const chatId = uuidv4();
    const unixTimestampInMilliseconds: number = new Date().getTime();
    const created: number = Math.floor(unixTimestampInMilliseconds / 1000);
    await this.clickhouse.insert('Chats', [
      {
        ChatId: chatId,
        ConversationId: input.conversationId,
        CreatedAt: created,
        Status: '200',
        Request: input.content,
        Response: output.choices[0].message.content,
        Model: input.model,
        TotalTokens: output.usage.total_tokens,
        PromptTokens: output.usage.prompt_tokens,
        CompletionTokens: output.usage.completion_tokens,
        Latency: latency,
      },
    ]);
    return chatId;
  }

  async insertChatFailure(
    input: GetChatCompletionDto,
    reason: string,
    status: string,
  ) {
    const chatId = uuidv4();
    const unixTimestampInMilliseconds: number = new Date().getTime();
    const created: number = Math.floor(unixTimestampInMilliseconds / 1000);
    await this.clickhouse.insert('Chats', [
      {
        ChatId: chatId,
        ConversationId: input.conversationId,
        CreatedAt: created,
        Status: status,
        Request: input.content,
        Response: reason,
        Model: input.model,
        TotalTokens: 0,
        PromptTokens: 0,
        CompletionTokens: 0,
        Latency: 0,
      },
    ]);
    return chatId;
  }

  async getChats(options: FilterOptionsDto, ids: string[]) {
    const conditions = [];

    if (options.dateFrom) {
      conditions.push(`CreatedAt >= toDateTime('${options.dateFrom}')`);
    }

    if (options.dateTo) {
      conditions.push(`CreatedAt <= toDateTime('${options.dateTo}')`);
    }

    if (options.model) {
      conditions.push(`Model = '${options.model}'`);
    }

    if (options.status) {
      if (options.status == '200') {
        conditions.push(`Status = '${options.status}'`);
      } else {
        conditions.push(`Status != '200'`);
      }
    }
    ids = ids.map((x) => `'${x}'`);
    const k = ids.join(',');
    if (k != 'null') conditions.push(`ConversationId in (${k})`);
    const whereClause =
      conditions.length > 0
        ? `${conditions.join(' AND ')} ORDER BY CreatedAt LIMIT 1000`
        : '';
    const ans = await this.clickhouse.select('Chats', whereClause);
    return ans;
  }
}
