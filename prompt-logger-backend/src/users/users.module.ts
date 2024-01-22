import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { clickHouseService } from 'src/db/click-house.service';
import { DatabaseModule } from 'src/db/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, clickHouseService],
  exports: [UsersService],
})
export class UsersModule {}
