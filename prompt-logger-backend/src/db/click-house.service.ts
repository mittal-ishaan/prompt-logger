import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class clickHouseService {
  constructor(@Inject('CLICKHOUSE') private readonly client: any) {}

  async insert(table: string, values: any[]) {
    await this.client.insert({
      table: table,
      values: values,
      format: 'JSONEachRow',
    });
  }

  async select(table: string, conditions: string) {
    const result = await this.client.query({
      query: `SELECT * FROM ${table} WHERE ${conditions}`,
      format: 'JSONEachRow',
    });
    return await result.json();
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
