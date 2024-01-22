import {
  Body,
  Controller,
  Inject,
  Post,
  Sse,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ChatCompletion } from 'openai/resources';
import { Observable, from } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetChatCompletionDto } from 'src/dtos/GetChatCompletionDto';
import { OpenAIService } from 'src/services/OpenAIService';
import { clickHouseService } from 'src/services/clickHouseService';

@Controller('openAI')
export class OpenAIController {
  constructor(
    @Inject(OpenAIService) private openai: OpenAIService,
    @Inject(clickHouseService) private clikChat: clickHouseService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async getOpenAI(@Body() message: GetChatCompletionDto) {
    let output: ChatCompletion;
    let latency: number;
    try {
      const start = new Date().getTime();
      output = await this.openai.chatCompletion(
        [{ role: 'user', content: message.content }],
        message.model,
      );
      latency = new Date().getTime() - start;
    } catch (err) {
      await this.clikChat.insertDataFailure(
        message,
        err.error.message,
        err.status,
      );
      throw new HttpException(err.status, err.error.message);
    }
    await this.clikChat.insertData(message, output, '200', latency);
    return output.choices[0].message.content;
  }

  @Sse('/stream')
  async getOpenAIStream(): Promise<Observable<any>> {
    const completion = await this.openai.chatCompletionStream(
      [{ role: 'user', content: 'Hello How are you' }],
      'gpt-3.5-turbo',
    );
    const observable = from(completion);
    return observable;
  }
}
