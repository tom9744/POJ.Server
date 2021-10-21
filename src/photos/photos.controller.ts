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
import { Photo } from './models/photos.model';
import { UpdatePhotoDto } from './DTOs/update-photo.dto';
import { MULTER_OPTIONS } from 'src/library/multer.config';

@Controller('photos')
export class PhotosController {
  constructor(private photoService: PhotosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', null, MULTER_OPTIONS)) // Allow Multiple Files
  createPhotos(@UploadedFiles() files: Express.Multer.File[]): void {
    this.photoService.create(files);
  }

  @Get()
  readAllPhotos(): Photo[] {
    return this.photoService.findAll();
  }

  @Get('/:id')
  readPhotoById(@Param('id') id: string): Photo {
    return this.photoService.findOneById(id);
  }

  @Patch('/:id')
  updatePhotoLocation(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ): void {
    this.photoService.update(id, updatePhotoDto);
  }

  @Delete('/:id')
  deletePhoto(@Param('id') id: string): void {
    this.photoService.delete(id);
  }
}
