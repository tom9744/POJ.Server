import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { PhotosService } from './photos.service';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { MULTER_OPTIONS } from 'src/library/multer.config';
import { Photo } from './entities/photo.entity';
import { CreatePhotosDto } from './dtos/create-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private photoService: PhotosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', null, MULTER_OPTIONS)) // Allow Multiple Files
  createPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPhotosDto: CreatePhotosDto,
  ): Promise<Photo[]> {
    return this.photoService.create(files, createPhotosDto);
  }

  @Get()
  readAllPhotos(): Promise<Photo[]> {
    return this.photoService.findAll();
  }

  @Get('/:id')
  readPhotoById(@Param('id') id: number): Promise<Photo> {
    return this.photoService.findOneById(id);
  }

  @Patch('/:id')
  updatePhotoLocation(
    @Param('id') id: number,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ): void {
    this.photoService.update(id, updatePhotoDto);
  }

  @Delete('/:id')
  deletePhoto(@Param('id') id: number): void {
    this.photoService.delete(id);
  }
}
