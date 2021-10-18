import { Injectable } from '@nestjs/common';

import { IBufferStream, JpegSection } from './models';

export const JPEG_MARKER_TYPES: { [markerType: number]: string } = {
  0xc0: 'SOF0',
  0xc2: 'SOF2',
  0xc4: 'DHT',
  0xd0: 'Restart',
  0xd1: 'Restart',
  0xd2: 'Restart',
  0xd3: 'Restart',
  0xd4: 'Restart',
  0xd5: 'Restart',
  0xd6: 'Restart',
  0xd7: 'Restart',
  0xd8: 'SOI',
  0xd9: 'EOI',
  0xda: 'SOS',
  0xdb: 'DQT',
  0xdd: 'DRI',
  0xe0: 'APP0',
  0xe1: 'APP1',
  0xe2: 'APP2',
  0xfe: 'COM',
};

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
@Injectable()
export class JpegSectionService {
  private hasPayload(markerType: number) {
    const isPayloadEmpty = 0xd0 <= markerType && markerType <= 0xd9;
    const isStartOfScan = markerType === 0xda; // Assume SOS Marker has no payload.

    return !isPayloadEmpty && !isStartOfScan;
  }

  extractSections(stream: IBufferStream): JpegSection[] {
    const sections: JpegSection[] = [];

    if (!stream.isBigEndian) {
      stream.setBigEndian(true);
    }

    while (stream.remainingLength() > 0) {
      const prefix = stream.readUInt8(); // Should be 0xFF.
      const markerType = stream.readUInt8(); // Type of a marker.

      if (prefix !== 0xff) {
        throw new Error('Invalid JPEG Section Marker.');
      }

      // Stop extracting when SOS marker is found.
      if (markerType === 0xda) {
        break;
      }

      const payloadLength = this.hasPayload(markerType)
        ? stream.readUInt16() - 2
        : 0;
      const payload = stream.copy(0, payloadLength); // Make a copy of the original stream.

      sections.push({
        markerType,
        name: JPEG_MARKER_TYPES[markerType],
        payload,
      });

      stream.skip(payloadLength);
    }

    return sections;
  }
}
