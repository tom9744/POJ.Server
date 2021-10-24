import { Journey } from 'src/journeys/entities/journey.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { ProcessedPhoto } from './interfaces/photos.interface';

@EntityRepository(Photo)
export class PhotosRepository extends Repository<Photo> {
  // The date string format from EXIF file is in 'YYYY:MM:DD HH:MM:SS' which is not applicable for new Date()
  // So, we should parse this string into Date object manually.
  private parseDateTime(dateString: string): Date {
    const [date, time] = dateString.split(' ');

    return new Date(`${date.replace(':', '-')}T${time}`);
  }

  async createPhotos(
    processedPhotos: ProcessedPhoto[],
    journey: Journey,
  ): Promise<Photo[]> {
    const photoEntities: Photo[] = processedPhotos.map((ProcessedPhoto) => {
      const { filename, path, metadata } = ProcessedPhoto;
      const { modifyDate, coordinate } = metadata;

      // When the metadata is empty, set it to default value so that the user can modify later.
      const photoEntity = this.create({
        filename,
        path,
        modifyDate: modifyDate ? this.parseDateTime(modifyDate) : new Date(),
        latitude: coordinate?.latitude ? coordinate?.latitude : 0,
        longitude: coordinate?.longitude ? coordinate?.longitude : 0,
        journey,
      });

      return photoEntity;
    });

    await this.save(photoEntities);

    return photoEntities;
  }
}
