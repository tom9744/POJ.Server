import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneysRepository } from 'src/journeys/journeys.repository';
import { JourneysService } from 'src/journeys/journeys.service';
import { SharedModule } from 'src/shared/shared.module';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { PhotosService } from './photos.service';
import { S3 } from 'aws-sdk';
import { AWS_S3_CONFIG } from 'src/library/aws-s3.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotosRepository, JourneysRepository]),
    SharedModule,
  ],
  controllers: [PhotosController],
  providers: [
    PhotosService,
    JourneysService,
    {
      provide: S3,
      useFactory: () =>
        new S3({
          credentials: {
            accessKeyId: AWS_S3_CONFIG.ACCESS_KEY_ID,
            secretAccessKey: AWS_S3_CONFIG.SECRET_ACCESS_KEY,
          },
          region: AWS_S3_CONFIG.REGION,
        }),
    },
  ],
})
export class PhotosModule {}
