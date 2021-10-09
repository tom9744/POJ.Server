import { BufferStream } from './buffer-stream';
import { JpegSectionExtractor } from './jpeg-section-extractor';
import { App1 } from './exif-data';
import { IFDEntry, IFDEntryRational64u } from './exif-parser.model';

export interface Gps {
  GPSLatitudeRef?: string;
  GPSLatitude?: number;
  GPSLongitudeRef?: string;
  GPSLongitude?: number;
  GPSAltitudeRef?: number;
  GPSAltitude?: number;
  GPSTimeStamp?: string;
  GPSSpeedRef?: string;
  GPSSpeed?: number;
  GPSImgDirectionRef?: string;
  GPSImgDirection?: number;
  GPSDestBearingRef?: string;
  GPSDestBearing?: number;
  GPSDateStamp?: string;
  GPSHPositioningError?: number;
}

export class EXIFParser {
  public flags = {
    readBinaryTags: false,
    resolveTagNames: true,
    simplifyValues: true,
    imageSize: true,
    hidePointers: true,
    returnTags: true,
  };

  private translateValue(tagName: string, values: number[]) {
    switch (tagName) {
      case 'GPSLatitude':
      case 'GPSLongitude':
        const [degree, minutes, seconds] = [...values];
        return degree + minutes / 60 + seconds / 3600;
      case 'GPSTimeStamp':
        return values
          .map((value) => (value < 10 ? `0${value}` : `${value}`))
          .join(':');
      default:
        return values[0];
    }
  }

  public parse(targetstream: BufferStream) {
    const originalStream = targetstream.mark(); // Original Buffer Stream
    const stream = originalStream.openWithOffset(0);
    const sections = JpegSectionExtractor.extractSections(stream); // JPEG Sections starts with a byte 0xFF
    const sectionApp1 = sections.find(({ markerType }) => markerType === 0xe1); // Find APP1 Section among JPEG Sections ends with 0xE1

    if (!sectionApp1) {
      throw new Error('Failed to pared APP1 data from the JPEG file.');
    }

    const app1 = new App1(sectionApp1);

    const data = Object.entries(app1.tags).reduce((acc, [key, values]) => {
      const result = values.reduce((acc, entry) => {
        let value;

        if (entry instanceof IFDEntryRational64u) {
          value = this.translateValue(entry.tagName, entry.simplifedValues);
        } else if (Array.isArray(entry.values)) {
          value = entry.values[0];
        } else {
          value = entry.values;
        }

        acc[entry.tagName] = value;

        return acc;
      }, {});

      acc[key] = result;

      return acc;
    }, {});

    console.log(data);
  }
}
