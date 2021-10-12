import { BufferStream } from './buffer-stream';
import { JPEG_MARKER_TYPES } from './exif-parser.constant';
import { JpegSection } from './exif-parser.model';

/**
 * A JPEG file consists of a number of sections sush as APP0, APP1, etc.
 * Each section can be identified with the specific byte, 0xFF.
 *
 * 0xFF(1byte) + Marker Type(1byte) + Data Size(2bytes) + Data(nbytes)
 *
 * NOTE - JPEG marker types from '0xD0' to '0xD9' does not contain any payload.
 *
 * 0xFFD0 - 0xFF07: Restart / 0xFFD8: SOI / 0xFFD9: EOI
 */
export class JpegSectionExtractor {
  private static hasNoPayload(markerType: number) {
    const isPayloadEmpty = 0xd0 <= markerType && markerType <= 0xd9;
    const isStartOfScan = markerType === 0xda; // Assume SOS Marker has no payload.

    return isPayloadEmpty || isStartOfScan;
  }

  static extractSections(stream: BufferStream) {
    stream.setBigEndian(true);

    const foundSections: JpegSection[] = [];

    while (stream.remainingLength() > 0) {
      const prefix = stream.nextUInt8();

      if (prefix !== 0xff) {
        throw new TypeError('Invalid JPEG Section');
      }

      const markerType = stream.nextUInt8();

      if (markerType === 0xda) {
        break;
      }

      const payloadLength = this.hasNoPayload(markerType)
        ? 0
        : stream.nextUInt16() - 2;
      const sectionStream = stream.branch(0, payloadLength);

      foundSections.push({
        markerType,
        name: JPEG_MARKER_TYPES[markerType],
        payload: sectionStream,
      });

      stream.skip(payloadLength);
    }

    return foundSections;
  }
}
