import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { JourneysService } from 'src/journeys/journeys.service';
import { AWS_S3_CONFIG } from 'src/library/aws-s3.config';
import { ExifParserService } from 'src/shared/exif-parser/exif-parser.service';
import { MetadataService } from 'src/shared/metadata/metadata.service';
import { CreatePhotosDto } from './dtos/create-photo.dto';
import { UpdatePhotoDto } from './dtos/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { Metadata, ProcessedPhoto } from './interfaces/photos.interface';
import { PhotosRepository } from './photos.repository';
import { v1 as uuid } from 'uuid';

@Injectable()
export class PhotosService {
  private readonly photos: Photo[] = [];

  constructor(
    @InjectRepository(PhotosRepository)
    private photosRepository: PhotosRepository,
    private journeysService: JourneysService,
    private exifParserService: ExifParserService,
    private metadataService: MetadataService,
    private awsS3: S3,
  ) {}

  private readMetadata(buffer: Buffer): Metadata {
    const parsedData = this.exifParserService.parse(buffer);
    const coordinate = this.metadataService.readCoordinates(parsedData);
    const modifyDate = this.metadataService.readModifyDate(parsedData);

    return { modifyDate, coordinate };
  }

  private generatePath(filename: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();

    return `${year}-${month}-${date}/${uuid()}-${filename}`;
  }

  /**
   * @param file A JPEG formatted image file to be uploaed to AWS S3 Bucket
   * @returns An URL which can be used to access the uploaded image file on AWS S3 Bucket
   */
  private uploadFileToS3(file: Express.Multer.File): Promise<string> {
    const generateParam = (): S3.PutObjectRequest => {
      return {
        Body: file.buffer,
        Bucket: AWS_S3_CONFIG.BUCKET_NAME,
        Key: this.generatePath(file.originalname),
      };
    };

    return new Promise((resolve, reject) => {
      this.awsS3.upload(generateParam(), null, (error, data) => {
        error ? reject(error.message) : resolve(data.Location);
      });
    });
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

          return {
            filename: originalname,
            path: await this.uploadFileToS3(file),
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
