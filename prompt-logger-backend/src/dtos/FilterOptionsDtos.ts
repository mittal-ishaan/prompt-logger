import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterOptionsDto {
  @ApiProperty({
    type: String,
    description: 'The model to use',
    required: false,
    example: 'gpt-3.5-turbo',
  })
  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  conversationId?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
