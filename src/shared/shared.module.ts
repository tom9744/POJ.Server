import { Module } from '@nestjs/common';

import { ExifParserService } from './exif-parser/exif-parser.service';
import { IfdEntryService } from './exif-parser/ifd-entry.service';
import { JpegSectionService } from './exif-parser/jpeg-section.service';
import { MetadataService } from './metadata/metadata.service';

@Module({
  providers: [
    ExifParserService,
    JpegSectionService,
    IfdEntryService,
    MetadataService,
  ],
  exports: [ExifParserService, MetadataService],
})
export class SharedModule {}
