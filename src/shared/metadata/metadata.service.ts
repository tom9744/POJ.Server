import { Injectable } from '@nestjs/common';

import { App1Data, App1SectionData } from '../exif-parser/models';
import { Coordinate } from './models/metadata.model';

/**
 * [NOTE] Currently only available for reading a coordinate data from GPS entries!
 */
@Injectable()
export class MetadataService {
  private readLatitude(sectionData: App1SectionData): number {
    const latitudeRef = sectionData['GPSLatitudeRef'] as string;
    const latitude = sectionData['GPSLatitude'] as number;

    return latitudeRef === 'N' ? latitude : -latitude;
  }

  private readLongitude(sectionData: App1SectionData): number {
    const longitudeRef = sectionData['GPSLongitudeRef'] as string;
    const longitude = sectionData['GPSLongitude'] as number;

    return longitudeRef === 'E' ? longitude : -longitude;
  }

  public readCoordinates(exifData: App1Data): Coordinate {
    if (
      !exifData.gps ||
      !exifData.gps.hasOwnProperty('GPSLatitudeRef') ||
      !exifData.gps.hasOwnProperty('GPSLatitude') ||
      !exifData.gps.hasOwnProperty('GPSLongitudeRef') ||
      !exifData.gps.hasOwnProperty('GPSLongitude')
    ) {
      return;
    }

    const latitude = this.readLatitude(exifData.gps);
    const longitude = this.readLongitude(exifData.gps);

    return { latitude, longitude };
  }

  public readCameraInfo(exifData: App1Data): { maker: string; model: string } {
    if (
      !exifData.ifd0 ||
      !exifData.ifd0.hasOwnProperty('Make') ||
      !exifData.ifd0.hasOwnProperty('Model')
    ) {
      return;
    }

    const maker = exifData.ifd0['Make'] as string;
    const model = exifData.ifd0['Model'] as string;

    return { maker, model };
  }

  public readModifyDate(exifData: App1Data): string {
    if (!exifData.ifd0 || !exifData.ifd0.hasOwnProperty('ModifyDate')) {
      return;
    }

    const modifyDate = exifData.ifd0['ModifyDate'] as string;

    return modifyDate;
  }
}
