import { Injectable } from "@nestjs/common";

import { BufferStream } from "src/models/buffer-stream.model";
import { IfdEntryService } from "./ifd-entry.service";
import { JpegMarkerService } from "./jpeg-marker.service";
import {
  App1Data,
  App1Section,
  App1SectionData,
  ExifParserConfigs,
  IFDEntryRational64u,
  IJpegMarker,
} from "./models";

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
    private jpegMarkerService: JpegMarkerService,
    private ifdEntryService: IfdEntryService,
  ) {}

  public configure(configurations: Partial<ExifParserConfigs>): void {
    this.configs = {
      ...this.configs,
      ...configurations,
    };
  }

  private preprocessFile(buffer: Buffer): IJpegMarker {
    const originalStream = new BufferStream(buffer, 0, buffer.length, true);
    const checkPoint = originalStream.createCheckpoint();
    const newStream = checkPoint.resumeWithOffset(0);
    const app1Section = this.jpegMarkerService
      .extractSections(newStream)
      .find((JpegMarker: IJpegMarker) => JpegMarker.isAPP1);

    if (!app1Section) {
      throw new Error("This JPEG file does not contain APP1 section.");
    }

    return app1Section;
  }

  private translateValue(tagName: string, values: number[]) {
    switch (tagName) {
      case "GPSLatitude":
      case "GPSLongitude":
        const [degree, minutes, seconds] = [...values];
        return degree + minutes / 60 + seconds / 3600;
      case "GPSTimeStamp":
        return values
          .map((value) => (value < 10 ? `0${value}` : `${value}`))
          .join(":");
      default:
        return values[0];
    }
  }

  public parse(buffer: Buffer): App1Data {
    const section = this.preprocessFile(buffer);
    const entries = this.ifdEntryService.extractEntries(section);

    const result = Object.entries(entries).reduce(
      (acc, [sectionName, sectionPayload]: [string, App1Section]) => {
        const entriesByCategory = sectionPayload.reduce((acc, entry) => {
          let value: string | number;

          // If the value is a rational value, translate it into string or number.
          if (entry instanceof IFDEntryRational64u) {
            value = this.translateValue(entry.tagName, entry.simplifedValues);
          }
          // If the value is an array, get its first element.
          else if (Array.isArray(entry.values)) {
            value = entry.values[0];
          }
          // Otherwise, the value is just a string.
          else {
            value = entry.values;
          }

          acc[entry.tagName] = value;

          return acc;
        }, {} as App1SectionData);

        acc[sectionName] = entriesByCategory;

        return acc;
      },
      {} as App1Data,
    );

    return result;
  }
}
