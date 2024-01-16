import { Injectable } from "@nestjs/common";
import OpenAI from "openai";

@Injectable()
export class OpenAIService {
    openai: OpenAI;
    constructor() {
        this.openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    }
    async chatCompletion(messages: any): Promise<string> {
        const completion = await this.openai.chat.completions.create({
            messages: messages,
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content;
    }
};