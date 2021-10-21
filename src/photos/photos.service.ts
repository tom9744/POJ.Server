import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { ExifParserService } from 'src/shared/exif-parser/exif-parser.service';
import { MetadataService } from 'src/shared/metadata/metadata.service';

import { v1 as uuid } from 'uuid';

import { UpdatePhotoDto } from './DTOs/update-photo.dto';
import { Photo } from './models/photos.model';

@Injectable()
export class PhotosService {
  private readonly photos: Photo[] = [];

  constructor(
    private exifParserService: ExifParserService,
    private metadataService: MetadataService,
  ) {}

  create(files: Array<Express.Multer.File>): void {
    const photos = files.map((file) => {
      const buffer = readFileSync(file.path);
      const parsedData = this.exifParserService.parse(buffer);
      const cameraInfo = this.metadataService.readCameraInfo(parsedData);
      const coordinate = this.metadataService.readCoordinates(parsedData);
      const modifyDate = this.metadataService.readModifyDate(parsedData);
      const metadata = { ...cameraInfo, ...modifyDate, coordinate };
      return { id: uuid(), file, metadata };
    });

    this.photos.push(...photos);
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
