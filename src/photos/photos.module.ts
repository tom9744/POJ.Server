import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JourneysRepository } from 'src/journeys/journeys.repository';
import { JourneysService } from 'src/journeys/journeys.service';
import { SharedModule } from 'src/shared/shared.module';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { PhotosService } from './photos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotosRepository, JourneysRepository]),
    SharedModule,
  ],
  controllers: [PhotosController],
  providers: [PhotosService, JourneysService],
})
export class PhotosModule {}
