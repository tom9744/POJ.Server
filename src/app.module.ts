import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './library/typeorm.config';
import { JourneysModule } from './journeys/journeys.module';
import { PhotosModule } from './photos/photos.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    JourneysModule,
    PhotosModule,
    TypeOrmModule.forRoot(typeORMConfig),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
