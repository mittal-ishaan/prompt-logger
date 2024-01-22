import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationDto {
  @ApiProperty({
    type: String,
    description: 'The name of the conversation',
    required: true,
    example: 'My Conversation',
  })
  @IsString()
  @IsNotEmpty()
  conversationName: string;
}
