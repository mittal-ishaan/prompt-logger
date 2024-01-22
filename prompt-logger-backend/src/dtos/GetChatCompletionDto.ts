import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetChatCompletionDto {
  @ApiProperty({
    type: String,
    description: 'The Request/message from the user',
    required: true,
    example: 'What is quantm physics?',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    description: 'The model to use for generating the response',
    required: true,
    example: 'gpt-3.5-turbo',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    type: String,
    description: 'The conversation ID of the chat in which the user is',
    required: true,
    example: '1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
