import { IsOptional } from 'class-validator';

export class UpdatePhotoDto {
  @IsOptional()
  modifyDate: Date;

  @IsOptional()
  latitude: number;

  @IsOptional()
  longitude: number;
}
