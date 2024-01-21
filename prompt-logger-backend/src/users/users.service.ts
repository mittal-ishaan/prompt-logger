import { Inject, Injectable } from '@nestjs/common';
import { clickHouseService } from 'src/services/clickHouseService';
export type User = any;

@Injectable()
export class UsersService {
  constructor(@Inject(clickHouseService) private clikChat: clickHouseService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.clikChat.getUsers(username);
  }
}
