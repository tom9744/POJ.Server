import { BufferStream } from './buffer-stream';

type TagParseIterator = (
  ifdSection: ImageFileDirectorySection,
  tagType: number,
  value: any,
  format: number,
) => void;

export enum ImageFileDirectorySection {
  IFD_0,
  IFD_1,
  SUB_IFD,
  GPS_IFD,
  INTEROP_IFD,
}

export const parseTags = function (
  stream: BufferStream,
  iterator: TagParseIterator,
) {
  return;
};
