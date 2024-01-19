import { Request } from 'express';

export class User {
  userId: string;
  username: string;
  password: string;

  constructor(userId: string, username: string, password: string) {
    this.userId = userId;
    this.username = username;
    this.password = password;
  }
}

export interface RequestDto extends Request {
  user: User;
}
