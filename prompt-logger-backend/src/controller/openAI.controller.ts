import {
  Body,
  Controller,
  Inject,
  Post,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ChatCompletion } from 'openai/resources';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetChatCompletionDto } from 'src/dtos/GetChatCompletionDto';
import { OpenAIService } from 'src/services/openAI.service';
import { ChatService } from 'src/services/chat.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('openAI')
@Controller('openAI')
export class OpenAIController {
  constructor(
    @Inject(OpenAIService) private openai: OpenAIService,
    @Inject(ChatService) private chat: ChatService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gets the openAI response for the request/message from the a user',
  })
  @ApiResponse({ status: 200, description: 'The response for the user' })
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
      await this.chat.insertChatFailure(message, err.error.message, err.status);
      throw new HttpException(err.status, err.error.message);
    }
    await this.chat.insertChatSuccess(message, output, latency);
    return output.choices[0].message.content;
  }

  //To be implemented - Stream Chat feature
  // @Sse('/stream')
  // async getOpenAIStream(): Promise<Observable<any>> {
  //   const completion = await this.openai.chatCompletionStream(
  //     [{ role: 'user', content: 'Hello How are you' }],
  //     'gpt-3.5-turbo',
  //   );
  //   const observable = from(completion);
  //   return observable;
  // }
}
