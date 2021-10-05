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
  values: Array<number | number[]> | Buffer | string;
}

export interface ProcessedIFDEntry {
  tagType: string;
  format: number;
  values: Array<number | number[]> | Buffer | string;
}
