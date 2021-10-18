import { IBufferStream } from './buffer-stream.model';

export interface JpegSection {
  markerType: number;
  name: string;
  payload: IBufferStream;
}
