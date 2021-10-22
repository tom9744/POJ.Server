import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { ExifParserService } from 'src/shared/exif-parser/exif-parser.service';
import { MetadataService } from 'src/shared/metadata/metadata.service';
import { Repository } from 'typeorm';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { Metadata, ProcessedPhoto } from './interfaces/photos.interface';

@Injectable()
export class PhotosService {
  private readonly photos: Photo[] = [];

  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    private exifParserService: ExifParserService,
    private metadataService: MetadataService,
  ) {}

  private readMetadata(file: Express.Multer.File): Metadata {
    const buffer = readFileSync(file.path);
    const parsedData = this.exifParserService.parse(buffer);
    const cameraInfo = this.metadataService.readCameraInfo(parsedData);
    const coordinate = this.metadataService.readCoordinates(parsedData);
    const modifyDate = this.metadataService.readModifyDate(parsedData);

    return { ...cameraInfo, ...modifyDate, coordinate };
  }

  // The date string format from EXIF file is in 'YYYY:MM:DD HH:MM:SS' which is not applicable for new Date()
  // So, we should parse this string into Date object manually.
  private parseDateTime(dateString: string): Date {
    const [date, time] = dateString.split(' ');

    return new Date(`${date.replace(':', '-')} ${time}`);
  }

  async create(files: Express.Multer.File[]): Promise<Photo[]> {
    const photoEntites: Photo[] = files
      .map((file) => {
        const { filename, path } = file;
        const metadata = this.readMetadata(file);

        return { filename, path, metadata } as ProcessedPhoto;
      })
      .map(({ filename, path, metadata }) => {
        const { modifyDate, coordinate } = metadata;
        const photoEntity = this.photosRepository.create({
          filename,
          path,
          modifyDate: this.parseDateTime(modifyDate),
          ...coordinate,
        });

        return photoEntity;
      });

    await this.photosRepository.save(photoEntites);

    return photoEntites;
  }

  findAll(): Photo[] {
    return this.photos;
  }

  async findOneById(id: number): Promise<Photo> {
    const foundPhoto = await this.photosRepository.findOne(id);

    if (!foundPhoto) {
      throw new NotFoundException();
    }

    return foundPhoto;
  }

  update(id: number, updatePhotoDto: UpdatePhotoDto): void {
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

  delete(id: number): void {
    this.photos.filter((photo) => photo.id !== id); // Delete Instance
  }
}
