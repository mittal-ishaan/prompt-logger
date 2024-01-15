import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async get(): Promise<string> {
    return 'Hello World!';
  }
}