import { Injectable } from '@nestjs/common';

import { IfdEntryService } from './ifd-entry.service';
import { JpegSectionService } from './jpeg-section.service';
import {
  BufferStream,
  ExifParserConfigs,
  IFDEntryRational64u,
  JpegSection,
} from './models';

@Injectable()
export class ExifParserService {
  private configs: ExifParserConfigs = {
    hidePointers: true,
    imageSize: true,
    readBinaryTags: false,
    returnTags: true,
    resolveTagNames: true,
    simplifyValues: true,
  };

  constructor(
    private jpegSectionService: JpegSectionService,
    private ifdEntryService: IfdEntryService,
  ) {}

  public configure(configurations: Partial<ExifParserConfigs>): void {
    this.configs = {
      ...this.configs,
      ...configurations,
    };
  }

  private preprocessFile(file: Express.Multer.File): JpegSection {
    const { buffer } = file;
    const originalStream = new BufferStream(buffer, 0, buffer.length, true);
    const checkPoint = originalStream.createCheckpoint();
    const newStream = checkPoint.resumeWithOffset(0);
    const app1Section = this.jpegSectionService
      .extractSections(newStream)
      .find(({ markerType }: JpegSection) => markerType === 0xe1);

    if (!app1Section) {
      throw new Error('This JPEG file does not contain APP1 section.');
    }

    return app1Section;
  }

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

  public parse(file: Express.Multer.File): void {
    const app1Section = this.preprocessFile(file);
    const entries = this.ifdEntryService.extractEntries(app1Section);

    const data = Object.entries(entries).reduce((acc, [key, values]) => {
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
