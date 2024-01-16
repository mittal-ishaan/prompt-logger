import { IsString } from "class-validator";

export class GetChatCompletionDto { 
    @IsString()
    content: string;
}