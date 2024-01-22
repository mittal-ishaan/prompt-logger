import { IsNotEmpty } from 'class-validator';

export class GetStatsDto {
  @IsNotEmpty()
  userId: string;
}
