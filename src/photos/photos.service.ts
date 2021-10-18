import { Injectable, NotFoundException } from '@nestjs/common';
import { ExifParserService } from 'src/shared/exif-parser/exif-parser.service';

import { v1 as uuid } from 'uuid';

import { UpdatePhotoDto } from './DTOs/update-photo.dto';
import { Photo } from './types/photo.interface';

@Injectable()
export class PhotosService {
  private readonly photos = [];

  constructor(private exifParserService: ExifParserService) {}

  create(files: Array<Express.Multer.File>): void {
    this.exifParserService.parse(files[0]);

    const createdPhotos: Photo[] = files.map((file) => {
      return {
        id: uuid(),
        file,
        location: [37.424039, 126.993378],
        takenDate: new Date(),
      };
    });

    this.photos.push(...createdPhotos);
  }

  findAll(): Photo[] {
    return this.photos;
  }

  findOneById(id: string): Photo {
    const foundPhoto = this.photos.find((photo) => photo.id === id);

    if (!foundPhoto) {
      throw new NotFoundException();
    }

    return foundPhoto;
  }

  update(id: string, updatePhotoDto: UpdatePhotoDto): void {
    const targetIndex = this.photos.findIndex((photo) => photo.id === id);

    if (targetIndex < 0) {
      throw new NotFoundException();
    }

    const originalPhoto = this.photos[targetIndex];
    const updatedPhoto = {
      ...originalPhoto,
      ...updatePhotoDto,
    };

    this.photos[targetIndex] = updatedPhoto; // Update Instance
  }

  delete(id: string): void {
    this.photos.filter((photo) => photo.id !== id); // Delete Instance
  }
}
