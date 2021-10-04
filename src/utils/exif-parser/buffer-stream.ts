export interface Marker {
  openWithOffset: (offset: number) => BufferStream;
  offset: number;
}

export class BufferStream {
  endPosition: number;

  constructor(
    private buffer: Buffer,
    private offset: number,
    private length: number,
    private bigEndian: boolean,
  ) {
    this.offset = offset || 0;
    this.endPosition = this.offset + length;
  }

  public setBigEndian(bigEndian) {
    this.bigEndian = bigEndian;
  }

  public nextInt8(): number {
    const value = this.buffer.readInt8(this.offset);
    this.offset += 1;
    return value;
  }

  public nextUInt8(): number {
    const value = this.buffer.readUInt8(this.offset);
    this.offset += 1;
    return value;
  }

  public nextInt16(): number {
    const value = this.bigEndian
      ? this.buffer.readInt16BE(this.offset)
      : this.buffer.readInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  public nextUInt16(): number {
    const value = this.bigEndian
      ? this.buffer.readUInt16BE(this.offset)
      : this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return value;
  }

  public nextInt32(): number {
    const value = this.bigEndian
      ? this.buffer.readInt32BE(this.offset)
      : this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  public nextUInt32(): number {
    const value = this.bigEndian
      ? this.buffer.readUInt32BE(this.offset)
      : this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return value;
  }

  public nextFloat(): number {
    const value = this.bigEndian
      ? this.buffer.readFloatBE(this.offset)
      : this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return value;
  }

  public nextDouble(): number {
    const value = this.bigEndian
      ? this.buffer.readDoubleBE(this.offset)
      : this.buffer.readDoubleLE(this.offset);
    this.offset += 8;
    return value;
  }

  public nextBufferByLength(length: number): Buffer {
    const buffer = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return buffer;
  }

  public nextStringByLength(length: number): string {
    const string = this.buffer.toString(
      'utf-8',
      this.offset,
      this.offset + length,
    );
    this.offset += length;
    return string;
  }

  public remainingLength(): number {
    return this.endPosition - this.offset;
  }

  public skip(length: number) {
    this.offset += length;
  }

  public offsetFrom(marker: Marker) {
    return this.offset - marker.offset;
  }

  public mark(): Marker {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return {
      openWithOffset: function (offset: number): BufferStream {
        offset = (offset || 0) + this.offset;

        return new BufferStream(
          self.buffer,
          offset,
          self.endPosition - offset,
          self.bigEndian,
        );
      },
      offset: this.offset,
    };
  }

  public branch(offset: number, length: number): BufferStream {
    const branch = new BufferStream(
      this.buffer,
      this.offset + offset,
      length,
      this.bigEndian,
    );

    return branch;
  }
}
