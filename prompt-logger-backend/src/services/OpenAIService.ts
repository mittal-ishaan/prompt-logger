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
        return completion;
    }
    async chatCompletion(messages: any, model: string): Promise<ChatCompletion> {
        const completion = await this.openai.chat.completions.create({
            messages: messages,
            model: model,
        });
        return completion;
    }
};