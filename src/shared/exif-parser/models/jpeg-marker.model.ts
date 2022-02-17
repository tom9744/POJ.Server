import { IBufferStream } from "../../../models/buffer-stream.model";

/**
 * A list of JPGE markers.
 *
 * References: https://www.disktuna.com/list-of-jpeg-markers/, https://velog.io/@nurungg/JPEG-image-format
 */
const JPEG_MARKER_TYPES: { [markerType: number]: string } = {
  0xc0: "SOF0",
  0xc2: "SOF2",
  0xc4: "DHT",
  0xd0: "Restart",
  0xd1: "Restart",
  0xd2: "Restart",
  0xd3: "Restart",
  0xd4: "Restart",
  0xd5: "Restart",
  0xd6: "Restart",
  0xd7: "Restart",
  0xd8: "SOI",
  0xd9: "EOI",
  0xda: "SOS",
  0xdb: "DQT",
  0xdd: "DRI",
  0xe0: "APP0",
  0xe1: "APP1",
  0xe2: "APP2",
  0xfe: "COM",
};

export interface IJpegMarker {
  get name(): string;
  get payload(): IBufferStream;
  get isSOF0(): boolean;
  get isSOF2(): boolean;
  get isAPP0(): boolean;
  get isAPP1(): boolean;
  get isAPP2(): boolean;
  get isDHT(): boolean;
  get isSOI(): boolean;
  get isEOI(): boolean;
  get isSOS(): boolean;
  get isDQT(): boolean;
  get isDRI(): boolean;
  get isCOM(): boolean;
  get isRestart(): boolean;
}

export class JpegMarker implements IJpegMarker {
  constructor(
    private markerType: number,
    private markerPayload: IBufferStream,
  ) {}

  get name(): string {
    return JPEG_MARKER_TYPES[this.markerType] || "Unknown Marker";
  }
  get payload(): IBufferStream {
    return this.markerPayload;
  }
  get isSOF0(): boolean {
    return this.name === "APP0";
  }
  get isSOF2(): boolean {
    return this.name === "APP1";
  }
  get isAPP0(): boolean {
    return this.name === "APP0";
  }
  get isAPP1(): boolean {
    return this.name === "APP1";
  }
  get isAPP2(): boolean {
    return this.name === "APP2";
  }
  get isDHT(): boolean {
    return this.name === "DHT";
  }
  get isSOI(): boolean {
    return this.name === "SOI";
  }
  get isEOI(): boolean {
    return this.name === "EOI";
  }
  get isSOS(): boolean {
    return this.name === "SOS";
  }
  get isDQT(): boolean {
    return this.name === "DQT";
  }
  get isDRI(): boolean {
    return this.name === "DRI";
  }
  get isCOM(): boolean {
    return this.name === "COM";
  }
  get isRestart(): boolean {
    return this.name === "Restart";
  }
}
