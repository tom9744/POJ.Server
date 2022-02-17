import { Injectable } from "@nestjs/common";
import { IBufferStream } from "src/models/buffer-stream.model";

import { IJpegMarker, JpegMarker } from "./models";

const JPEG_MARKER_PREFIX_BYTE = 0xff;
const START_OF_SCAN_BYTE = 0xda;

/**
 * A JPEG file consists of a number of sections sush as APP0, APP1, etc.
 * Each section can be identified with the specific byte, 0xFF.
 *
 * 0xFF(1byte) + Marker Type(1byte) + Data Size(2bytes) + Data(nbytes)
 *
 * NOTE - JPEG marker types from '0xD0' to '0xD9' does not contain any payload.
 *
 * 0xFFD0 - 0xFF07: Restart / 0xFFD8: SOI / 0xFFD9: EOI
 *
 * Reference: https://nightohl.tistory.com/entry/EXIF-Format
 */
@Injectable()
export class JpegMarkerService {
  /**
   * @param markerTypeByte A JPEG marker type in hexadecimal format.
   */
  private hasPayload(markerTypeByte: number) {
    const isPayloadEmpty = 0xd0 <= markerTypeByte && markerTypeByte <= 0xd9;
    const isStartOfScan = markerTypeByte === 0xda; // Assume SOS Marker has no payload.

    return !isPayloadEmpty && !isStartOfScan;
  }

  extractSections(stream: IBufferStream): IJpegMarker[] {
    const sections: IJpegMarker[] = [];

    if (!stream.isBigEndian) {
      stream.setBigEndian(true);
    }

    while (stream.remainingLength() > 0) {
      const prefixByte = stream.readUInt8(); // Should be 0xFF.
      const markerTypeByte = stream.readUInt8(); // Type of a marker.

      if (prefixByte !== JPEG_MARKER_PREFIX_BYTE) {
        throw new Error("Invalid JPEG Section Marker.");
      }

      // Stop extracting when SOS marker is found.
      if (markerTypeByte === START_OF_SCAN_BYTE) {
        break;
      }

      const payloadLength = this.hasPayload(markerTypeByte)
        ? stream.readUInt16() - 2 // NOTE: Data size.
        : 0;
      const payload = stream.copy(0, payloadLength); // Make a copy of the original stream.

      sections.push(new JpegMarker(markerTypeByte, payload));

      stream.skip(payloadLength);
    }

    return sections;
  }
}
