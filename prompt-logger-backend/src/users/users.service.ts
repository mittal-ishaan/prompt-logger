import { Inject, Injectable } from '@nestjs/common';
import { clickHouseService } from 'src/services/clickHouseService';

export type User = {
  userId: string;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(@Inject(clickHouseService) private clikChat: clickHouseService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.clikChat.getUsers(username);
  }
}
