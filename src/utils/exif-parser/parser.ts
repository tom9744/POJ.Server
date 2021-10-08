import { BufferStream } from './buffer-stream';
import { JpegSectionExtractor } from './jpeg-section-extractor';
import { App1 } from './exif-data';

export class EXIFParser {
  public flags = {
    readBinaryTags: false,
    resolveTagNames: true,
    simplifyValues: true,
    imageSize: true,
    hidePointers: true,
    returnTags: true,
  };

  constructor(private stream: BufferStream) {}

  public parse() {
    // Original Buffer Stream
    const originalStream = this.stream.mark();
    const stream = originalStream.openWithOffset(0);

    // JPEG Sections starts with a byte 0xFF
    const sections = JpegSectionExtractor.extractSections(stream);
    // Find APP1 Section among JPEG Sections ends with 0xE1
    const sectionApp1 = sections.find((section) => section.markerType === 0xe1);

    if (!sectionApp1) {
      throw new Error('Failed to pared APP1 data from the JPEG file.');
    }

    const app1Data = new App1(sectionApp1);
    const { IFD0, IFD1, subIFD, GPS } = app1Data;

    IFD0.forEach((entry) => {
      console.log(entry.tagType, entry.value);
    });
    IFD1.forEach((entry) => {
      console.log(entry.tagType, entry.value);
    });
    subIFD.forEach((entry) => {
      console.log(entry.tagType, entry.value);
    });
    GPS.forEach((entry) => {
      console.log(entry.tagType, entry.value);
    });
  }
}
