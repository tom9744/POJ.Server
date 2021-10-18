import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [SharedModule],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
