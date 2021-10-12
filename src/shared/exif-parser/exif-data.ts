import { BufferStream } from './buffer-stream';
import {
  BYTES_PER_COMPONENT,
  GPS_EXIF_TAGS,
  IFD_EXIF_TAGS,
} from './exif-parser.constant';
import {
  App1Data,
  IFDEntry,
  IFDEntryRational64u,
  JpegSection,
  Marker,
} from './exif-parser.model';

export class App1 {
  private bufferStream: BufferStream; // Original buffer stream.
  private tiffMarker: Marker; // TIFF Header's starting point.
  public tags: App1Data; // Payloads

  constructor(section: JpegSection) {
    const { name, payload } = section;

    if (name !== 'APP1') {
      throw new TypeError('Invalid APP1 JPEG Section!');
    }

    this.bufferStream = payload;
    this.checkHeaders();
    this.readAPP1Data();
  }

  /**
   * Read the buffer stream's header area to check if the data is in JPEG format.
   *
   * A JPEG formatted data must have an EXIF header and a TIFF header.
   *
   * The EXIF header should be a 6-character-long string, 'Exif\0\0', and
   * the TIFF header consists of three parts; byte align, tag mark, first IFD's offset.
   */
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

  /**
   * Read numeric typed data which takes from 1byte to 4bytes depending on its format.
   *
   * @param format Entry's format.
   * @param stream Entry's Butter Stream.
   * @returns A value.
   */
  private readNumericValue(format: number, stream: BufferStream): number {
    switch (format) {
      case 0x01:
        return stream.nextUInt8();
      case 0x03:
        return stream.nextUInt16();
      case 0x04:
        return stream.nextUInt32();
      case 0x06:
        return stream.nextInt8();
      case 0x08:
        return stream.nextUInt16();
      case 0x09:
        return stream.nextUInt32();
      case 0x0b:
        return stream.nextFloat();
      case 0x0c:
        return stream.nextDouble();
      default:
        throw new Error('Invalid format while decoding: ' + format);
    }
  }

  /**
   * Read rational typed data which takes 4bytes each.
   *
   * @param format Entry's format. (either 0x05 or 0x0a)
   * @param stream Entry's Butter Stream.
   * @returns A Tuple of rational value.
   */
  private readRationalValue(
    format: number,
    stream: BufferStream,
  ): [number, number] {
    switch (format) {
      case 0x05:
        return [stream.nextUInt32(), stream.nextUInt32()];
      case 0x0a:
        return [stream.nextInt32(), stream.nextInt32()];
      default:
        throw new Error('Invalid format while decoding: ' + format);
    }
  }

  /**
   * Read a single entry of IFD formatted data.
   *
   * Each IFD entry takes only 12bytes.
   *
   * Last 4bytes are where the data or data's offset is being stored.
   * If the payload size exceeds 4bytes, it is located in the payload area.
   *
   * @param targetStream Section's Buffer Stream.
   * @returns { tagType, format, values } IFD entry.
   */
  private readIFDEntry(
    targetStream: BufferStream,
  ): IFDEntry | IFDEntryRational64u {
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

    let values: Array<number | [number, number]> | string;

    // ASCII String Type
    if (format === 2) {
      const asciiString = targetStream.nextStringByLength(numberOfComponents);
      const lastNullIndex = asciiString.indexOf('\0');

      values =
        lastNullIndex !== -1
          ? asciiString.substr(0, lastNullIndex)
          : asciiString;
    }
    // Undefined Type
    else if (format === 7) {
      targetStream.nextBufferByLength(numberOfComponents);
    }
    // Other Types
    else if (format !== 0) {
      const emptyValues = new Array(numberOfComponents).fill(null);
      const readValues = emptyValues.map(() => {
        return format === 0x05 || format === 0x0a
          ? this.readRationalValue(format, targetStream)
          : this.readNumericValue(format, targetStream);
      });

      values = readValues;
    }

    if (payloadSize < 4) {
      targetStream.skip(4 - payloadSize);
    }

    return format === 0x05 || format === 0x0a
      ? new IFDEntryRational64u(
          tagType,
          format,
          values as Array<[number, number]>,
        )
      : new IFDEntry(tagType, format, values as number[] | string);
  }

  /**
   * Read IFD formatted sections such as IFD0, IFD1, SubIFD, and GPS.
   *
   * @param targetStream Section's Buffer Stream.
   * @param isGPS Set this parameter as 'true' when reading GPS Data.
   * @returns An Array of IFD formatted data's entry.
   */
  private readIFDFormat(
    targetStream: BufferStream,
    isGPS = false,
  ): Array<IFDEntry | IFDEntryRational64u> {
    if (targetStream.remainingLength() < 2) {
      return [];
    }

    const numberOfEntries = targetStream.nextUInt16();
    const emptyEntries = new Array(numberOfEntries).fill(null);
    const entries = emptyEntries.map(() => {
      const entry = this.readIFDEntry(targetStream);
      entry.tagName = isGPS
        ? GPS_EXIF_TAGS[entry.tagType]
        : IFD_EXIF_TAGS[entry.tagType];

      return entry;
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

    const tags: App1Data = { ifd0: IFD0, ifd1: [], subIfd: [], gps: [] };

    if (IFD1Offset !== 0) {
      const bufferStreamIFD1 = this.tiffMarker.openWithOffset(IFD1Offset);

      tags.ifd1 = this.readIFDFormat(bufferStreamIFD1);
    }

    // IFD0 entry with the tag type 0x8825 notifies where GPS data is located in the buffer stream.
    const gpsIFD = IFD0.find((entry) => entry.tagType === 0x8825);

    if (gpsIFD) {
      const gpsOffset = gpsIFD.values[0];
      const gpsStream = this.tiffMarker.openWithOffset(gpsOffset as number);

      tags.gps = this.readIFDFormat(gpsStream, true);
    }

    // IFD0 entry with the tag type 0x8769 notifies where SubIFD data is located in the buffer stream.
    const subIFD = IFD0.find((entry) => entry.tagType === 0x8769);

    if (subIFD) {
      const subOffset = subIFD.values[0];
      const subStream = this.tiffMarker.openWithOffset(subOffset as number);

      tags.subIfd = this.readIFDFormat(subStream);
    }

    this.tags = tags;
  }
}
