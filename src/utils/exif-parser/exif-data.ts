import { BufferStream } from './buffer-stream';
import {
  BYTES_PER_COMPONENT,
  GPS_EXIF_TAGS,
  IFD_EXIF_TAGS,
} from './exif-parser.constant';
import { IFDEntry, JpegSection, Marker } from './exif-parser.model';

/**
 * APP1 데이터는 0xFFE1 마커로 시작 지점을 파악할 수 있으며, 다음의 데이터를 포함한다.
 * IFD0(Main Image), SubIFD, IFD1(Thumbnail Image), GPS
 *
 * IFD0, IFD1에는 조리개, 노출 등 세부적인 카메라 정보가 포함되지 않는다.
 * IFD0에 항상 SubIFD의 Offset(= 시작 위치)를 알리는 Special Tag(0x8769)가 포함된다.
 */
export class App1 {
  private bufferStream: BufferStream;

  // TIFF Header Info
  private tiffMarker: Marker;
  private byteAlign: 0x4949 | 0x4d4d;
  private tagMark: 0x002a | 0x2a00;

  // Payloads
  private ifd0: IFDEntry[] = [];
  private subIfd: IFDEntry[] = [];
  private ifd1: IFDEntry[] = [];
  private gps: IFDEntry[] = [];

  // Getters
  get IFD0() {
    return this.ifd0.map((entry) => ({
      ...entry,
      tagType: IFD_EXIF_TAGS[entry.tagType],
    }));
  }

  get IFD1() {
    return this.ifd1.map((entry) => ({
      ...entry,
      tagType: IFD_EXIF_TAGS[entry.tagType],
    }));
  }

  get subIFD() {
    return this.subIfd.map((entry) => ({
      ...entry,
      tagType: IFD_EXIF_TAGS[entry.tagType],
    }));
  }

  get GPS() {
    return this.gps.map((entry) => ({
      ...entry,
      tagType: GPS_EXIF_TAGS[entry.tagType],
    }));
  }

  constructor(section: JpegSection) {
    const { name, payload } = section;

    if (name !== 'APP1') {
      throw new TypeError('Not a APP1 Section');
    }

    this.bufferStream = payload;

    this.checkHeaders();

    this.readAPP1Data();
  }

  private checkHeaders(): void {
    // EXIF Header
    const exifHeader = this.bufferStream.nextStringByLength(6);

    if (exifHeader !== 'Exif\0\0') {
      throw new TypeError('Not a EXIF Format Header');
    }

    // TIFF Headers (= Byte Align + Tag Mark + First IFD Offset)
    const tiffMarker = this.bufferStream.mark();

    // Byte Align - 0x4949(Little Endian), 0x4D4D(Big Endian)
    const byteAlign = this.bufferStream.nextUInt16();
    if (byteAlign !== 0x4949 && byteAlign !== 0x4d4d) {
      throw new TypeError('Invalid Byte Align Header');
    } else {
      this.bufferStream.setBigEndian(byteAlign === 0x4d4d);
    }

    // Tag Mark is always either 0x002A or 0x2A00 according to the endian.
    const tagMark = this.bufferStream.nextUInt16();
    if (tagMark !== 0x002a && tagMark !== 0x2a00) {
      throw new TypeError('Invalid Tag Mark Header');
    }

    // Remember TIFF Header's position.
    this.tiffMarker = tiffMarker;
  }

  private readValue(format: number, stream: BufferStream): number | number[] {
    switch (format) {
      case 0x01:
        return stream.nextUInt8();
      case 0x03:
        return stream.nextUInt16();
      case 0x04:
        return stream.nextUInt32();
      case 0x05:
        return [stream.nextUInt32(), stream.nextUInt32()];
      case 0x06:
        return stream.nextInt8();
      case 0x08:
        return stream.nextUInt16();
      case 0x09:
        return stream.nextUInt32();
      case 0x0a:
        return [stream.nextInt32(), stream.nextInt32()];
      case 0x0b:
        return stream.nextFloat();
      case 0x0c:
        return stream.nextDouble();
      default:
        throw new Error('Invalid format while decoding: ' + format);
    }
  }

  /**
   * Each IFD entry takes only 12bytes.
   *
   * Last 4bytes are where the data or data's offset is being stored.
   * If the payload size exceeds 4bytes, it is located in the payload area.
   *
   * @param targetStream
   * @returns { tagType, format, values }
   */
  private readIFDEntry(targetStream: BufferStream): IFDEntry {
    const tagType = targetStream.nextUInt16();
    const format = targetStream.nextUInt16();
    const numberOfComponents = targetStream.nextUInt32();

    const bytesPerComponent = BYTES_PER_COMPONENT[format];
    const payloadSize = bytesPerComponent * numberOfComponents;

    // When the payload size is bigger then 4bytes, look up the payload area.
    if (payloadSize > 4) {
      const payloadOffset = targetStream.nextUInt32();
      targetStream = this.tiffMarker.openWithOffset(payloadOffset);
    }

    let values: Array<number | number[]> | Buffer | string;

    // ASCII String Type
    if (format === 2) {
      values = targetStream.nextStringByLength(numberOfComponents);

      const lastNullIndex = values.indexOf('\0');

      if (lastNullIndex !== -1) {
        values = values.substr(0, lastNullIndex);
      }
    }
    // Undefined Type
    else if (format === 7) {
      values = targetStream.nextBufferByLength(numberOfComponents);
    }
    // Otherwise
    else if (format !== 0) {
      values = [];

      for (let comp = 0; comp < numberOfComponents; ++comp) {
        const value = this.readValue(format, targetStream);

        values.push(value);
      }
    }

    if (payloadSize < 4) {
      targetStream.skip(4 - payloadSize);
    }

    return { tagType, format, values };
  }

  private readIFDFormat(targetStream: BufferStream, isGPS = false): IFDEntry[] {
    if (targetStream.remainingLength() < 2) {
      return [];
    }

    const numberOfEntries = targetStream.nextUInt16();
    const emptyEntries = new Array(numberOfEntries).fill(null);
    const entries = emptyEntries.map(() => {
      return this.readIFDEntry(targetStream);
    });

    return entries;
  }

  /**
   * Read IFD0 (Main Image) Data.
   *
   * IFD0 stream contains the followings.
   *
   * 1. The number of IFD0 entries. (2byte)
   * 2. Entry list (each entry takes 12bytes)
   * 3. IFD1's offset (4bytes)
   * 4. Payload Area (nbytes)
   *
   * Each IFD0 entry consist of the 4 elements.
   *
   * 1. Tag Type (2bytes)
   * 2. Format (2bytes)
   * 3. The number of components (4bytes)
   * 4. Data or Data's offset when its size exceeds 4bytes. (4bytes)
   *
   */
  private readAPP1Data(): void {
    const IFD0Offset = this.bufferStream.nextUInt32();
    const IFD0Stream = this.tiffMarker.openWithOffset(IFD0Offset);
    const IFD0 = this.readIFDFormat(IFD0Stream);
    const IFD1Offset = IFD0Stream.nextUInt32();

    if (IFD1Offset !== 0) {
      const bufferStreamIFD1 = this.tiffMarker.openWithOffset(IFD1Offset);

      this.ifd1 = this.readIFDFormat(bufferStreamIFD1);
    }

    // GPS
    const gpsIFD = IFD0.find((entry) => entry.tagType === 0x8825);

    if (gpsIFD) {
      const gpsOffset = gpsIFD.values[0];
      const gpsStream = this.tiffMarker.openWithOffset(gpsOffset as number);

      this.gps = this.readIFDFormat(gpsStream);
    }

    // EXIF SubIFD
    const subIFD = IFD0.find((entry) => entry.tagType === 0x8769);

    if (subIFD) {
      const subOffset = subIFD.values[0];
      const subStream = this.tiffMarker.openWithOffset(subOffset as number);

      this.subIfd = this.readIFDFormat(subStream);
    }

    this.ifd0 = IFD0;
  }
}
