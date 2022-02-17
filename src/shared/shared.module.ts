import { Module } from "@nestjs/common";

import { ExifParserService } from "./exif-parser/exif-parser.service";
import { IfdEntryService } from "./exif-parser/ifd-entry.service";
import { JpegMarkerService } from "./exif-parser/jpeg-marker.service";

@Module({
  providers: [ExifParserService, JpegMarkerService, IfdEntryService],
  exports: [ExifParserService],
})
export class SharedModule {}
