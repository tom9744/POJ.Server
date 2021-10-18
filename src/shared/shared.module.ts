import { Module } from '@nestjs/common';

import { ExifParserService } from './exif-parser/exif-parser.service';
import { IfdEntryService } from './exif-parser/ifd-entry.service';
import { JpegSectionService } from './exif-parser/jpeg-section.service';

@Module({
  providers: [ExifParserService, JpegSectionService, IfdEntryService],
  exports: [ExifParserService],
})
export class SharedModule {}
