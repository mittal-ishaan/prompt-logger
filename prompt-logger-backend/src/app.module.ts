import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { clickHouseService } from './db/click-house.service';
import { DatabaseModule } from './db/database.module';
import { OpenAIService } from './services/openAI.service';
import { AuthController } from './controller/auth.controller';
import { ConversationController } from './controller/conversation.controller';
import { OpenAIController } from './controller/openAI.controller';
import { ConversationsService } from './services/conversation.service';
import { ChatService } from './services/chat.service';
import { StatsService } from './services/stats.service';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot(), DatabaseModule],
  controllers: [
    AppController,
    AuthController,
    ConversationController,
    OpenAIController,
  ],
  providers: [
    Logger,
    AppService,
    clickHouseService,
    OpenAIService,
    ConversationsService,
    ChatService,
    StatsService,
  ],
})
export class AppModule {}
