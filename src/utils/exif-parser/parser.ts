import { BufferStream } from './buffer-stream';
import { App1Data } from './exif';
import { JpegSectionParser } from './jpeg';

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
    const originalStream = this.stream.mark();
    const stream = originalStream.openWithOffset(0);
    const jpegSections = JpegSectionParser.parseSections(stream);
    const app1Section = jpegSections.find((section) => section.type === 0xe1);

    if (app1Section) {
      const app1Stream = app1Section.stream;
      const app1SectionOffest = app1Stream.offsetFrom(originalStream);

      const app1Data = new App1Data(app1Stream);

      console.log(app1Data);
    }
  }
}
