import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JourneysService } from 'src/journeys/journeys.service';
import { ExifParserService } from 'src/shared/exif-parser/exif-parser.service';
import { MetadataService } from 'src/shared/metadata/metadata.service';
import { CreatePhotosDto } from './dtos/create-photo.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { Metadata, ProcessedPhoto } from './interfaces/photos.interface';
import { PhotosRepository } from './photos.repository';
import { PhotoUploadService } from './services/photo-upload.service';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(PhotosRepository)
    private photosRepository: PhotosRepository,
    private journeysService: JourneysService,
    private exifParserService: ExifParserService,
    private metadataService: MetadataService,
    private uploadService: PhotoUploadService,
  ) {}

  private readMetadata(buffer: Buffer): Metadata {
    const parsedData = this.exifParserService.parse(buffer);
    const coordinate = this.metadataService.readCoordinates(parsedData);
    const modifyDate = this.metadataService.readModifyDate(parsedData);

    return { modifyDate, coordinate };
  }

  async create(
    files: Express.Multer.File[],
    { journeyTitle }: CreatePhotosDto,
  ): Promise<Photo[]> {
    // Finds the journey instance related to the uploaded photos.
    const journey = await this.journeysService.findOneByTitle(journeyTitle);

    try {
      const processedPhotos = await Promise.all(
        files.map(async (file) => {
          const { originalname, buffer } = file;
          const metadata = this.readMetadata(buffer);
          const imagePath = await this.uploadService.upload(file);

          return {
            filename: originalname,
            originalPath: imagePath.originalPath,
            thumbnailPath: imagePath.thumbnailPath,
            metadata,
          } as ProcessedPhoto;
        }),
      );

      return this.photosRepository.createPhotos(processedPhotos, journey);
    } catch (error) {
      throw new BadRequestException('Invalid files has been passed.');
    }
  }

  async findAll(): Promise<Photo[]> {
    const foundPhotos = await this.photosRepository.find();

    if (!foundPhotos) {
      throw new NotFoundException();
    }

    return foundPhotos;
  }

  async findOneById(id: number): Promise<Photo> {
    const foundPhoto = await this.photosRepository.findOne(id);

    if (!foundPhoto) {
      throw new NotFoundException(`Can't find a photo with ID ${id}`);
    }

    return foundPhoto;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto): Promise<void> {
    const targetPhoto = await this.findOneById(id);

    await this.photosRepository.save({
      ...targetPhoto,
      ...updatePhotoDto,
    });
  }

  async delete(id: number): Promise<void> {
    const deletionResult = await this.photosRepository.delete(id);

    if (deletionResult.affected < 1) {
      throw new NotFoundException(`Can't find a photo with ID ${id}`);
    }
  }
}
