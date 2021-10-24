import { IsString } from 'class-validator';

export class CreatePhotosDto {
  @IsString()
  journeyTitle: string;
}
