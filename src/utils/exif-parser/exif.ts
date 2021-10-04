import { BufferStream, Marker } from './buffer-stream';

interface IFDEntry {
  tagType: number;
  format: number;
  values: Array<number | number[]> | Buffer | string;
}

const BYTES_PER_COMPONENT = {
  0x01: 1, // Unsigned Byte
  0x02: 1, // ASCII String
  0x03: 2, // Unsigned Short
  0x04: 4, // Unsigned Long
  0x05: 8, // Unsigned Rational
  0x06: 1, // Signed Byte
  0x07: 1, // Undefined
  0x08: 2, // Signed Short
  0x09: 4, // Signed Long
  0x0a: 8, // Signed Rational
  0x0b: 4, // Single Float
  0x0c: 8, // Double Float
};

/**
 * APP1 데이터는 0xFFE1 마커로 시작 지점을 파악할 수 있으며, 다음의 데이터를 포함한다.
 * IFD0(Main Image), SubIFD, IFD1(Thumbnail Image), GPS
 *
 * IFD0, IFD1에는 조리개, 노출 등 세부적인 카메라 정보가 포함되지 않는다.
 * IFD0에 항상 SubIFD의 Offset(= 시작 위치)를 알리는 Special Tag(0x8769)가 포함된다.
 */
export class App1Data {
  bufferStream: BufferStream;
  tiffMarker: Marker;

  size: number;
  exif: number;
  tiff: number;
  ifd0: IFDEntry[];
  subIfd: IFDEntry[];
  ifd1: IFDEntry[];
  gps: IFDEntry[];

  constructor(bufferStreamApp1: BufferStream) {
    this.bufferStream = bufferStreamApp1;
    this.tiffMarker = this.readHeaders();

    this.parseApp1Data();
  }

  private readHeaders() {
    // EXIF Header
    const exifHeader = this.bufferStream.nextStringByLength(6);

    if (exifHeader !== 'Exif\0\0') {
      throw new TypeError('Not a EXIF Format Header');
    }

    // TIFF Headers
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

    return tiffMarker;
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
   * IFD 엔트리는 개당 12bytes를 차지한다. 데이터를 담는 공간은 4bytes에 불과하며,
   * 4bytes를 초과하는 데이터는 별도의 데이터 영역에 저장한다.
   *
   * tagType(2bytes), format(2bytes), number of components(4bytes), value/offset(4bytes)
   *
   * @param partialIFDBufferStream
   * @returns
   */
  private readIFDEntry(partialIFDBufferStream: BufferStream): IFDEntry {
    // Each entry takes only 12bytes.
    const tagType = partialIFDBufferStream.nextUInt16();
    const format = partialIFDBufferStream.nextUInt16();
    const bytesPerComponent = BYTES_PER_COMPONENT[format];
    const numberOfComponents = partialIFDBufferStream.nextUInt32();
    const payloadSize = bytesPerComponent * numberOfComponents;

    if (payloadSize > 4) {
      const payloadOffset = partialIFDBufferStream.nextUInt32();
      partialIFDBufferStream = this.tiffMarker.openWithOffset(payloadOffset); // 데이터 영역의 오프셋으로 이동한다.
    }

    let values: Array<number | number[]> | Buffer | string;

    // ASCII String
    if (format === 2) {
      values = partialIFDBufferStream.nextStringByLength(numberOfComponents);

      const lastNullIndex = values.indexOf('\0');

      if (lastNullIndex !== -1) {
        values = values.substr(0, lastNullIndex);
      }
    }
    // Undefined
    else if (format === 7) {
      values = partialIFDBufferStream.nextBufferByLength(numberOfComponents);
    }
    // Default
    else if (format !== 0) {
      values = [];

      for (let comp = 0; comp < numberOfComponents; ++comp) {
        const value = this.readValue(format, partialIFDBufferStream);

        values.push(value);
      }
    }

    if (payloadSize < 4) {
      partialIFDBufferStream.skip(4 - payloadSize);
    }

    return { tagType, format, values };
  }

  private readIFDFormatData(partialIFDBufferStream: BufferStream): IFDEntry[] {
    if (partialIFDBufferStream.remainingLength() < 2) {
      return;
    }

    const numberOfEntries = partialIFDBufferStream.nextUInt16();
    const IFDFormatData = new Array(numberOfEntries).fill(null).map(() => {
      const IFDEntry = this.readIFDEntry(partialIFDBufferStream);

      return IFDEntry;
    });

    return IFDFormatData;
  }

  public parseApp1Data(): void {
    const IFD0Offset = this.bufferStream.nextUInt32();
    const bufferStreamIFD0 = this.tiffMarker.openWithOffset(IFD0Offset);
    const IFD0 = this.readIFDFormatData(bufferStreamIFD0);

    this.ifd0 = IFD0;

    const IFD1Offset = this.bufferStream.nextUInt32();

    console.log(this.bufferStream);
    console.log(this.bufferStream);

    if (IFD1Offset !== 0) {
      const bufferStreamIFD1 = this.tiffMarker.openWithOffset(IFD1Offset);
      console.log(bufferStreamIFD1);
      const result = this.readIFDFormatData(bufferStreamIFD1);

      console.log(result);
    }

    const subIFD = IFD0.find((entry) => entry.tagType === 0x8769);
    const gpsIFD = IFD0.find((entry) => entry.tagType === 0x8825);

    if (gpsIFD) {
      const gpsOffset = gpsIFD.values[0];
      const gpsStream = this.tiffMarker.openWithOffset(gpsOffset as number);

      this.gps = this.readIFDFormatData(gpsStream);
    }

    if (subIFD) {
      const subOffset = subIFD.values[0];
      const subStream = this.tiffMarker.openWithOffset(subOffset as number);

      this.subIfd = this.readIFDFormatData(subStream);
    }
  }
}
