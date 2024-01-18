import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: "f0ee7d87-a8df-4fb1-b36d-f6f486fa2fbb",
      username: 'john',
      password: 'changeme',
    },
    {
      userId: "f0ee7d87-a8df-4fb1-b36d-f6f486fa2fbb",
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}