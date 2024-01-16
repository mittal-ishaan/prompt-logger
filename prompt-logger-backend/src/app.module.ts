import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controller/AppController';
import { AppService } from './services/AppService';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { clickHouseService } from './services/clickHouseService';
import { DatabaseModule } from './db/database.module';


@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot(), DatabaseModule],
  controllers: [AppController],
  providers: [Logger, AppService, clickHouseService],
})
export class AppModule {}
