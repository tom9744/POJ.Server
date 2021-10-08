import { BufferStream } from './buffer-stream';

export type Tag = {
  [tagNumber: number]: string;
};

export interface JpegSection {
  markerType: number;
  name: string;
  payload: BufferStream;
}

export interface Marker {
  openWithOffset: (offset: number) => BufferStream;
  offset: number;
}

export interface IFDEntry {
  tagType: number;
  format: number;
  values: Array<number | number[]> | string;
}

export class ProcessedIFDEntry {
  public parsedValue: string | number | number[];

  constructor(
    public format: number,
    public values: Array<number | number[]> | string,
    public tagType: string,
  ) {
    this.simplify();
  }

  public get value() {
    return this.parsedValue;
  }

  private get isCoordinate(): boolean {
    return this.tagType === 'GPSLatitude' || this.tagType === 'GPSLongitude';
  }

  private get isTimeStamp(): boolean {
    return this.tagType === 'GPSTimeStamp';
  }

  private get isRational(): boolean {
    return this.format === 0x05 || this.format === 0x0a;
  }

  private parseCoordinate(): number {
    if (!Array.isArray(this.parsedValue)) {
      throw TypeError('Not a Coordinate Type.');
    }

    const [degree, minutes, seconds] = [...this.parsedValue];

    return degree + minutes / 60 + seconds / 3600;
  }

  private parseTimeStamp(): string {
    if (!Array.isArray(this.parsedValue)) {
      throw TypeError('Not a TimeStamp Type.');
    }

    return this.parsedValue
      .map((value) => (value < 10 ? `0${value}` : `${value}`))
      .join(':');
  }

  private simplify(): void {
    if (Array.isArray(this.values)) {
      this.parsedValue = this.values.map((value) => {
        return this.isRational ? value[0] / value[1] : (value as number);
      });

      if (this.isCoordinate) {
        this.parsedValue = this.parseCoordinate();
      } else if (this.isTimeStamp) {
        this.parsedValue = this.parseTimeStamp();
      } else {
        this.parsedValue = this.parsedValue[0];
      }
    } else {
      this.parsedValue = this.values;
    }
  }
}
