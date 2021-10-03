import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'config/typeorm.config';
import { JourneysModule } from './journeys/journeys.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [JourneysModule, PhotosModule, TypeOrmModule.forRoot(typeORMConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
