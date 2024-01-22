import { Inject, Injectable } from '@nestjs/common';
import { clickHouseService } from '../db/click-house.service';
import { ConversationsService } from './conversation.service';
import { quantile } from 'simple-statistics';

@Injectable()
export class StatsService {
  constructor(
    @Inject(clickHouseService) private clickhouse: clickHouseService,
    @Inject(ConversationsService) private convService: ConversationsService,
  ) {}

  async getStats(userId: string) {
    const conv = await this.convService.getConversations(userId);
    let ids = conv.map((x) => x.ConversationId);
    ids = ids.map((x) => `'${x}'`);
    const k = ids.join(',');
    const conditions = [];
    if (k != 'null') conditions.push(`ConversationId in (${k})`);
    const whereClause =
      conditions.length > 0
        ? `${conditions.join(' AND ')} ORDER BY CreatedAt LIMIT 1000`
        : '';
    const ans = await this.clickhouse.select('Chats', whereClause);
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
}
