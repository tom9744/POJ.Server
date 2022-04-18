import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';
import { AWS_S3_CONFIG } from 'src/library/aws-s3.config';
import { v4 as uuid } from 'uuid';

type ImagePath = {
  originalPath: string;
  thumbnailPath: string;
};

enum ImageType {
  Original = 'Original',
  Thumbnail = 'Thumbnail',
}

@Injectable()
export class PhotoUploadService {
  constructor(private readonly awsS3: S3) {}

  private generatePath(fileName: string, imageType: ImageType): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const directoryName = imageType.toLowerCase();

    return `${year}-${month}-${date}/${directoryName}/${uuid()}-${fileName}`;
  }

  private generateThumbnailBuffer(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
      .withMetadata()
      .resize(320)
      .jpeg({ mozjpeg: true })
      .toBuffer();
  }

  private async generateParameter(
    file: Express.Multer.File,
    imageType: ImageType,
  ): Promise<PutObjectRequest> {
    console.log(file);

    const body =
      imageType === ImageType.Thumbnail
        ? await this.generateThumbnailBuffer(file.buffer)
        : file.buffer;

    return {
      Body: body,
      Bucket: AWS_S3_CONFIG.BUCKET_NAME,
      Key: this.generatePath(file.originalname, imageType),
      ContentType: 'image',
    };
  }

  private uploadToS3Bucket(param: PutObjectRequest): Promise<string> {
    return new Promise((resolve, reject) => {
      this.awsS3.upload(param, (error, data) => {
        if (error) {
          reject(error.message);
          return;
        }
        resolve(data.Location);
      });
    });
  }

  /**
   * @param file A JPEG formatted image file to be uploaed to AWS S3 Bucket
   * @returns An URL which can be used to access the uploaded image file on AWS S3 Bucket
   */
  async upload(file: Express.Multer.File): Promise<ImagePath> {
    const params = [
      await this.generateParameter(file, ImageType.Original),
      await this.generateParameter(file, ImageType.Thumbnail),
    ];

    const [originalPath, thumbnailPath] = await Promise.all(
      params.map((param) => this.uploadToS3Bucket(param)),
    );

    return { originalPath, thumbnailPath };
  }
}
