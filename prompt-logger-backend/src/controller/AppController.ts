import { Controller, Get, Request, Post, UseGuards, Inject, Query, Body, Res, Sse } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { clickHouseService } from 'src/services/clickHouseService';
import { OpenAIService } from 'src/services/OpenAIService';
import { GetChatCompletionDto } from '../dtos/AppDtos';
import { ChatCompletion } from 'openai/resources';
import { quantile } from 'simple-statistics';
import { Response } from 'express';
import { pipeline } from 'stream';
import { Observable, catchError, finalize, from } from 'rxjs';
import { UUID } from 'crypto';

@Controller()
export class AppController {
  constructor(private authService: AuthService,
              @Inject(clickHouseService) private clikChat: clickHouseService,
              @Inject(OpenAIService) private openai: OpenAIService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('auth/signup')
  async makeUser(@Request() user) { 
    if ( await this.clikChat.getUsers(user.username)!= null ) {
      return false;
    }
    console.log(user);
    return this.clikChat.makeUser(user.username, user.password);
  }

  @Get('/conversations')
  async getConversations(@Query() user: any) {
    return this.clikChat.getConversations(user.userId);
  }

  @Post('/conversations')
  async makeConversation(@Body() conversation: any) {
    return this.clikChat.makeConversation(conversation.userId, conversation.conversationName);
  }

  @Post('/openAI')
  async getOpenAI(@Body() message: GetChatCompletionDto) {
    let output: ChatCompletion;
    let latency: number;
    try {
      const start = new Date().getTime();
      output = await this.openai.chatCompletion([{"role": "user", "content": message.content}], message.model);
      latency = new Date().getTime() - start;
    } catch(err) {
      await this.clikChat.insertDataFailure(message, err.error.message, err.status);
      throw err;
    }
    await this.clikChat.insertData(message, output, "200", latency);
    return output.choices[0].message.content;
  }

  @Post('/chats')
  async getChats(@Body() options: any) {
    console.log(options);
    if(options.conversationId)  {
      options.conversationId = [options.conversationId];
    }
    else {
      const ans = await this.clikChat.getConversations(options.userId);
      const ids = ans.map((x) => x.ConversationId);
      options.conversationId = ids;
    }
    console.log(options);
    const ans = await this.clikChat.getChats(options);
    const result = {};
    result['chats'] = ans;
    return result;
  }

  @Get('/stats')
  async getStats(@Query() userId: any) {
    const ans = await this.clikChat.getStats(userId.userId);
    
    const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);   
  const pastFiveDaysLogs = ans.filter(log => new Date(log.CreatedAt) >= fiveDaysAgo);
  
  const groupedByDay = pastFiveDaysLogs.reduce((groups, log) => {
    const date = new Date(log.CreatedAt);
    const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (!groups[day]) {
      groups[day] = [];
    }
    console.log(log)
    groups[day].push(log);

    return groups;
  }, {}); 

    const result = {};
    const days = Object.keys(groupedByDay);
    for (const day in groupedByDay) {
      const logs = groupedByDay[day];
      const res ={};
      res['no of requests'] = logs.length;
      res['avg latency'] = (logs.reduce((acc, curr) => acc + curr.Latency, 0) / logs.length).toFixed(2);
      res['p95 latency'] = quantile(logs.map((x) => x.Latency), 0.95).toFixed(2);
      res['total failures'] = logs.filter((x) => x.Status != "200").length;
      res['total input tokens'] = logs.reduce((acc, curr) => acc + curr.PromptTokens, 0);
      res['total output tokens'] = logs.reduce((acc, curr) => acc + curr.CompletionTokens, 0);
      res['total tokens'] = logs.reduce((acc, curr) => acc + curr.TotalTokens, 0);
      result[day] = res;
    }
    result['days'] = days;
    result['no of requests'] = ans.length;
    result['avg latency'] = (ans.reduce((acc, curr) => acc + curr.Latency, 0) / ans.length).toFixed(2);
    result['p95 latency'] = quantile(ans.map((x) => x.Latency), 0.95).toFixed(2);
    result['total failures'] = ans.filter((x) => x.Status != "200").length;
    result['total input tokens'] = (ans.reduce((acc, curr) => acc + curr.PromptTokens, 0) / ans.length).toFixed(2);
    result['total output tokens'] = (ans.reduce((acc, curr) => acc + curr.CompletionTokens, 0) / ans.length).toFixed(2);
    result['total tokens'] = (ans.reduce((acc, curr) => acc + curr.TotalTokens, 0) / ans.length).toFixed(2);
    return result;
  }

  @Sse('/openAI/stream')
  async getOpenAIStream(): Promise<Observable<any>>{
    const completion = await this.openai.chatCompletionStream([{"role": "user", "content": "Hello How are you"}], 'gpt-3.5-turbo');
    const observable = from(completion);
    return observable;
  }
}