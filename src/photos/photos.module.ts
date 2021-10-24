import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { PhotosController } from './photos.controller';
import { PhotosRepository } from './photos.repository';
import { PhotosService } from './photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotosRepository]), SharedModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
