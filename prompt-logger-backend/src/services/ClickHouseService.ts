import { Inject, Injectable } from '@nestjs/common';
import { ChatCompletion } from 'openai/resources';
import { User } from 'src/users/users.service';
import { GetChatCompletionDto } from 'src/dtos/AppDtos';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { quantile } from 'simple-statistics';
import { FilterOptionsDto } from 'src/dtos/FilterOptionsDtos';

@Injectable()
export class clickHouseService {
  constructor(@Inject('CLICKHOUSE') private readonly client: any) {}

  async insertData(
    input: GetChatCompletionDto,
    output: ChatCompletion,
    status: string,
    latency: number,
  ) {
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
          Status: '200',
          Request: input.content,
          Response: output.choices[0].message.content,
          Model: input.model,
          TotalTokens: output.usage.total_tokens,
          PromptTokens: output.usage.prompt_tokens,
          CompletionTokens: output.usage.completion_tokens,
          Latency: latency,
        },
      ],
      format: 'JSONEachRow',
    });
    return chatId;
  }

  async insertDataFailure(
    input: GetChatCompletionDto,
    reason: string,
    status: string,
  ) {
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
          Latency: 0,
        },
      ],
      format: 'JSONEachRow',
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
      format: 'JSONEachRow',
    });
    return conversationId;
  }

  async getConversations(userId: string) {
    const result = await this.client.query({
      query: `SELECT * FROM Conversations WHERE UserId = '${userId}'`,
      format: 'JSONEachRow',
    });
    const ans = await result.json();
    return ans;
  }

  async makeUser(username: string, password: string) {
    const userId: string = uuidv4();
    password = await bcrypt.hash(password, 10);
    await this.client.insert({
      table: 'User',
      values: [
        {
          UserId: userId,
          Username: username,
          Password: password,
        },
      ],
      format: 'JSONEachRow',
    });
    return true;
  }

  async getUsers(username: string) {
    const result = await this.client.query({
      query: `SELECT * FROM User WHERE Username = '${username}'`,
      format: 'JSONEachRow',
    });
    const ans = await result.json();
    if (ans.length == 0) {
      return null;
    }
    const user: User = {
      userId: ans[0].UserId,
      username: ans[0].Username,
      password: ans[0].Password,
    };
    return user;
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
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
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
    if (k != 'null') conditions.push(`ConversationId in (${k})`);
    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    console.log(whereClause);
    const res = await this.client.query({
      query: `SELECT * FROM Chats ${whereClause}`,
      format: 'JSONEachRow',
    });
    const ans = await res.json();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const pastFiveDaysLogs = ans.filter(
      (log) => new Date(log.CreatedAt) >= fiveDaysAgo,
    );

    const groupedByDay = pastFiveDaysLogs.reduce((groups, log) => {
      const date = new Date(log.CreatedAt);
      const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(log);

      return groups;
    }, {});

    const result = {};
    const days = Object.keys(groupedByDay);
    for (const day in groupedByDay) {
      const logs = groupedByDay[day];
      const res = {};
      res['no of requests'] = logs.length;
      res['avg latency'] = (
        logs.reduce((acc, curr) => acc + curr.Latency, 0) / logs.length
      ).toFixed(2);
      res['p95 latency'] = quantile(
        logs.map((x) => x.Latency),
        0.95,
      ).toFixed(2);
      res['total failures'] = logs.filter((x) => x.Status != '200').length;
      res['total input tokens'] = logs.reduce(
        (acc, curr) => acc + curr.PromptTokens,
        0,
      );
      res['total output tokens'] = logs.reduce(
        (acc, curr) => acc + curr.CompletionTokens,
        0,
      );
      res['total tokens'] = logs.reduce(
        (acc, curr) => acc + curr.TotalTokens,
        0,
      );
      result[day] = res;
    }
    result['days'] = days;
    result['no of requests'] = ans.length;
    result['avg latency'] = (
      ans.reduce((acc, curr) => acc + curr.Latency, 0) / ans.length
    ).toFixed(2);
    result['p95 latency'] = quantile(
      ans.map((x) => x.Latency),
      0.95,
    ).toFixed(2);
    result['total failures'] = ans.filter((x) => x.Status != '200').length;
    result['total input tokens'] = (
      ans.reduce((acc, curr) => acc + curr.PromptTokens, 0) / ans.length
    ).toFixed(2);
    result['total output tokens'] = (
      ans.reduce((acc, curr) => acc + curr.CompletionTokens, 0) / ans.length
    ).toFixed(2);
    result['total tokens'] = (
      ans.reduce((acc, curr) => acc + curr.TotalTokens, 0) / ans.length
    ).toFixed(2);
    return result;
  }

  async getCSV() {
    const result = await this.client.query({
      query: `SELECT * FROM Chats`,
      format: 'CSVWithNames',
    });
    const ans = await result.text();
    return ans;
  }
}
