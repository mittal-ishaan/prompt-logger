import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    type: String,
    description: 'The Username of the user - can not be duplicated',
    required: true,
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    description:
      'The Password of the user - The password is hashed before being stored in the database',
    required: true,
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
