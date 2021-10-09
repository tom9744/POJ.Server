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
import { Photo } from './types/photo.interface';
import { UpdatePhotoDto } from './DTOs/update-photo.dto';
import { BufferStream } from 'src/utils/exif-parser/buffer-stream';
import { EXIFParser } from 'src/utils/exif-parser/parser';

@Controller('photos')
export class PhotosController {
  constructor(private photoService: PhotosService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 20)) // Allow Multiple Files
  createPhotos(@UploadedFiles() files: Array<Express.Multer.File>): void {
    const buffer = files[0].buffer;
    const bufferStream = new BufferStream(buffer, 0, buffer.length, true);
    const parser = new EXIFParser();

    parser.parse(bufferStream);

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
