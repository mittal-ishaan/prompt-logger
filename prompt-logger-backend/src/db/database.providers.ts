import { createClient } from '@clickhouse/client';
import { userModel } from './models/user';
import { conversationModel } from './models/conversations';
import { chatModel } from './models/chats';

export const databaseProviders = [
  {
    provide: 'CLICKHOUSE',
    useFactory: async () => {
      const client = createClient({
        host: process.env.CLICKHOUSE_HOST ?? 'http://localhost:8123',
        username: process.env.CLICKHOUSE_USER ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '',
      });
      const models = [userModel, conversationModel, chatModel];
      const ans = await Promise.all(
        models.map((model) => client.query({ query: model })),
      );
      console.log(ans);
      return client;
    },
  },
];
