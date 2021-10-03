import { BufferStream } from './buffer-stream';
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

    console.log(jpegSections);
  }
}
