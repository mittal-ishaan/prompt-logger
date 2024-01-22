import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterOptionsDto {
  @ApiProperty({
    type: String,
    description: 'The model for which the chats are to be shown',
    required: false,
    example: 'gpt-3.5-turbo',
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    type: String,
    description: 'The Conversational ID from which the chats are to be shown',
    required: false,
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiProperty({
    type: String,
    description: 'The Start Date from which the chats are to be shown',
    required: false,
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @ApiProperty({
    type: String,
    description: 'The End Date from which the chats are to be shown',
    required: false,
    example: '2024-01-01',
  })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({
    type: String,
    description: 'The Status of the chats to be shown',
    required: false,
    example: '200',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
