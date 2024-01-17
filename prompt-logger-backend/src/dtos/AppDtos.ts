import { IsString, IsUUID } from "class-validator";

export class GetChatCompletionDto { 
    @IsString()
    content: string;

    @IsString()
    model: string;

    @IsUUID() 
    conversationId: string;
}