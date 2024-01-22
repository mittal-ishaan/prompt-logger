import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetChatCompletionDto {
  @IsString()
  content: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
