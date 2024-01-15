import { Module } from '@nestjs/common';
import { AppController } from './controller/AppController';
import { AppService } from './services/AppService';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
