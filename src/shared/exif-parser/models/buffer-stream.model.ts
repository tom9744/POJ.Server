export interface Checkpoint {
  resumeWithOffset(offset: number): IBufferStream;
  checkedOffset: number;
}

export interface IBufferStream {
  buffer: Buffer;
  offset: number;
  length: number;
  endPosition: number;
  isBigEndian: boolean;

  // Configuration
  setBigEndian(isBigEndian: boolean): void;

  // Main Features
  readInt8(): number;
  readUInt8(): number;
  readInt16(): number;
  readUInt16(): number;
  readInt32(): number;
  readUInt32(): number;
  readFloat(): number;
  readDouble(): number;
  readBuffer(length: number): Buffer;
  readString(length: number): string;

  // Utilities
  copy(offset: number, copyLength: number): IBufferStream;
  createCheckpoint(): Checkpoint;
  offsetFromCheckpoint(checkpoint: Checkpoint): number;
  skip(length: number): void;
  remainingLength(): number;
}

export class BufferStream implements IBufferStream {
  public endPosition: number;

  constructor(
    public buffer: Buffer,
    public offset: number,
    public length: number,
    public isBigEndian: boolean,
  ) {
    this.endPosition = this.offset + length;
  }

  private moveOffsetBy(byte: number): void {
    this.offset += byte;
  }

  public setBigEndian(isBigEndian: boolean): void {
    this.isBigEndian = isBigEndian;
  }

  public readInt8(): number {
    const value = this.buffer.readInt8(this.offset);
    this.moveOffsetBy(1);
    return value;
  }

  public readUInt8(): number {
    const value = this.buffer.readUInt8(this.offset);
    this.moveOffsetBy(1);
    return value;
  }

  public readInt16(): number {
    const value = this.isBigEndian
      ? this.buffer.readInt16BE(this.offset)
      : this.buffer.readInt16LE(this.offset);
    this.moveOffsetBy(2);
    return value;
  }

  public readUInt16(): number {
    const value = this.isBigEndian
      ? this.buffer.readUInt16BE(this.offset)
      : this.buffer.readUInt16LE(this.offset);
    this.moveOffsetBy(2);
    return value;
  }

  public readInt32(): number {
    const value = this.isBigEndian
      ? this.buffer.readInt32BE(this.offset)
      : this.buffer.readInt32LE(this.offset);
    this.moveOffsetBy(4);
    return value;
  }

  public readUInt32(): number {
    const value = this.isBigEndian
      ? this.buffer.readUInt32BE(this.offset)
      : this.buffer.readUInt32LE(this.offset);
    this.moveOffsetBy(4);
    return value;
  }

  public readFloat(): number {
    const value = this.isBigEndian
      ? this.buffer.readFloatBE(this.offset)
      : this.buffer.readFloatLE(this.offset);
    this.moveOffsetBy(4);
    return value;
  }

  public readDouble(): number {
    const value = this.isBigEndian
      ? this.buffer.readDoubleBE(this.offset)
      : this.buffer.readDoubleLE(this.offset);
    this.moveOffsetBy(8);
    return value;
  }

  public readBuffer(length: number): Buffer {
    const buffer = this.buffer.slice(this.offset, this.offset + length);
    this.moveOffsetBy(length);
    return buffer;
  }

  public readString(length: number): string {
    const string = this.buffer.toString(
      'utf-8',
      this.offset,
      this.offset + length,
    );
    this.moveOffsetBy(length);
    return string;
  }

  public copy(offset: number, copyLength: number): IBufferStream {
    const newOffset = this.offset + offset;

    return new BufferStream(
      this.buffer,
      newOffset,
      copyLength,
      this.isBigEndian,
    );
  }

  public createCheckpoint(): Checkpoint {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const snapshot = this;

    return {
      resumeWithOffset: function (offset: number): IBufferStream {
        const newOffset = this.checkedOffset + (offset || 0);
        const newLength = snapshot.endPosition - offset;

        return new BufferStream(
          snapshot.buffer,
          newOffset,
          newLength,
          snapshot.isBigEndian,
        );
      },
      checkedOffset: this.offset,
    };
  }

  public offsetFromCheckpoint(checkpoint: Checkpoint): number {
    return this.offset - checkpoint.checkedOffset;
  }

  public skip(length: number): void {
    this.moveOffsetBy(length);
  }

  public remainingLength(): number {
    return this.endPosition - this.offset;
  }
}
