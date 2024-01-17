import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";
import { getEncoding, encodingForModel } from "js-tiktoken";

@Injectable()
export class OpenAIService {
    openai: OpenAI;
    constructor() {
        this.openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    }
    async chatCompletionStream(messages: any, model: string): Promise<any> {
        let cnt = 0;
        const completion = await this.openai.chat.completions.create({
            messages: messages,
            model: model,
            stream: true,
        });
        for await (const chunk of completion) {
            cnt += 1;
            console.log(chunk.choices[0].delta);
        }
        console.log(cnt);
        return completion.controller;
    }
    async chatCompletion(messages: any, model: string): Promise<ChatCompletion> {
        const completion = await this.openai.chat.completions.create({
            messages: messages,
            model: model,
        });
        return completion;
    }
};