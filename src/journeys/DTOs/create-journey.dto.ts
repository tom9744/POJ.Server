import { IsDateString, IsString } from 'class-validator';

export class CreateJourneyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
