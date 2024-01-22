import { Inject, Injectable } from '@nestjs/common';
import { clickHouseService } from 'src/db/click-house.service';
import { User } from '../types/UserType';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject(clickHouseService) private clikChat: clickHouseService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.getUsers(username);
  }

  async makeUser(username: string, password: string) {
    const userId: string = uuidv4();
    password = await bcrypt.hash(password, 10);
    await this.clikChat.insert('User', [
      {
        UserId: userId,
        Username: username,
        Password: password,
      },
    ]);
    return true;
  }

  async getUsers(username: string) {
    const ans = await this.clikChat.select('User', `Username = '${username}'`);
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
}
