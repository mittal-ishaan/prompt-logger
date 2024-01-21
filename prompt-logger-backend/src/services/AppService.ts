import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHealth(): Promise<string> {
    return 'Hello World!';
  }
}
