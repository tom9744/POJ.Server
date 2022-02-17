import { IBufferStream } from "../../../models/buffer-stream.model";

export interface JpegSection {
  markerType: number;
  name: string;
  payload: IBufferStream;
}
