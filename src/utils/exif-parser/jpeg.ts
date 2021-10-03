import { BufferStream } from './buffer-stream';

export interface JpegSection {
  type: number;
  typeString: string;
  stream: BufferStream;
}

export class JpegSectionParser {
  /**
   * Marker Type from 0xD0 to 0xD9 does not contain data
   * [0xFFD0 ~ 0xFF07] Restart
   * [0xFFD8] SOI(Start Of Image)
   * [0xFFD9] EOI(End Of Image)
   * [0xFFDA] SOS(Start Of Scan)
   */
  private static isInvalidType(markerType: number) {
    const isPayloadEmpty = 0xd0 <= markerType && markerType <= 0xd9;
    const isStartOfScan = markerType === 0xda;

    return isPayloadEmpty || isStartOfScan;
  }

  /**
   * [JPEG Marker Format]
   * 0xFF + Marker Type (1 byte) + Data Size (2 bytes) + Data (n bytes)
   */
  static parseSections(stream: BufferStream) {
    stream.setBigEndian(true);

    const parsedSections: JpegSection[] = [];
    let markerType: number;

    while (stream.remainingLength() > 0 && markerType !== 0xda) {
      const prefix = stream.nextUInt8();

      if (prefix !== 0xff) {
        throw new TypeError('Invalid JPEG Section');
      }

      markerType = stream.nextUInt8();

      const payloadLength = this.isInvalidType(markerType)
        ? 0
        : stream.nextUInt16() - 2;
      const streamBranch = stream.branch(0, payloadLength);

      parsedSections.push({
        type: markerType,
        typeString: `0xFF${markerType.toString(16).toUpperCase()}`,
        stream: streamBranch,
      });
      stream.skip(payloadLength);
    }

    return parsedSections;
  }
}
