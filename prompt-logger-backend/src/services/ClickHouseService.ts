import { Inject } from '@nestjs/common';
import { ChatCompletion } from 'openai/resources';
import { format } from 'path';
import { User } from 'src/controller/RequestTypes';
import { GetChatCompletionDto } from 'src/dtos/AppDtos';
import { v4 as uuidv4 } from 'uuid';


export class clickHouseService {
    constructor(@Inject('CLICKHOUSE') private readonly client : any) {
    }

    async insertData(input : GetChatCompletionDto, output: ChatCompletion, status: string, latency: number) {
      const chatId = uuidv4();
      const unixTimestampInMilliseconds: number = new Date().getTime();
      const created: number = Math.floor(unixTimestampInMilliseconds / 1000);
      await this.client.insert({
        table: 'Chats',
        values: [
          { 
            ChatId: chatId,
            ConversationId: input.conversationId,
            CreatedAt: created, 
            Status: "200", 
            Request: input.content, 
            Response: output.choices[0].message.content, 
            Model: input.model, 
            TotalTokens: output.usage.total_tokens, 
            PromptTokens: output.usage.prompt_tokens, 
            CompletionTokens: output.usage.completion_tokens,
            Latency: latency
          },
        ],
        format: "JSONEachRow"
      });
      return chatId;
  }

  async insertDataFailure(input : GetChatCompletionDto, reason: string, status: string) {
    const chatId = uuidv4();
    const unixTimestampInMilliseconds: number = new Date().getTime();
    const created: number = Math.floor(unixTimestampInMilliseconds / 1000);
    await this.client.insert({
      table: 'Chats',
      values: [
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
          Latency: 0
        },
      ],
      format: "JSONEachRow"
    });
    return chatId;
  }

  async makeConversation(userId: string, conversationName: string) {
    const conversationId = uuidv4();
    await this.client.insert({
      table: 'Conversations',
      values: [
        { 
          ConversationId: conversationId,
          UserId: userId,
          ConversationName: conversationName,
        },
      ],
      format: "JSONEachRow"
    });
    return conversationId;
  }

  async getConversations(userId: string) {
    const result = await this.client.query({
      query: `SELECT * FROM Conversations WHERE UserId = '${userId}'`,
      format: 'JSONEachRow',
    })
    const ans = await result.json();
    return ans;
  }

  async makeUser(username: string, password: string) {
    const userId: string = uuidv4();
    const output = await this.client.insert({
      table: 'User',
      values: [
        { 
          UserId: userId,
          Username: username,
          Password: password,
        },
      ],
      format: "JSONEachRow"
    });
    return userId;
  }

  async getUsers(username: string) {
    const result = await this.client.query({
      query: `SELECT * FROM User WHERE Username = '${username}'`,
      format: 'JSONEachRow',
    });
    const ans = await result.json();
    const user = new User(ans[0].UserId, ans[0].Username, ans[0].Password);
    return user;
  }

  async getChats(options: any) {
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
      conditions.push(`Status = '${options.status}'`);
    }
    options.conversationId = options.conversationId.map((x) => `'${x}'`);
    const k = options.conversationId.join(',');
    if(k!='null') conditions.push(`ConversationId in (${k})`);
  
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''; 
    console.log(whereClause); 
    const result = await this.client.query({
      query: `SELECT * FROM Chats ${whereClause} ORDER BY CreatedAt LIMIT 1000`,
      format: 'JSONEachRow',
    });
    const ans = await result.json();
    return ans;
   }

   async getStats(userId: string) {
    const conv = await this.getConversations(userId);
    let ids = conv.map((x) => x.ConversationId);
    ids = ids.map((x) => `'${x}'`);
    const k = ids.join(',');
    const conditions = [];
    if(k!='null') conditions.push(`ConversationId in (${k})`);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    console.log(whereClause);
    const result = await this.client.query({
      query: `SELECT * FROM Chats ${whereClause}`,
      format: 'JSONEachRow',
    });
    const ans = await result.json();
    return ans;
   }
}

