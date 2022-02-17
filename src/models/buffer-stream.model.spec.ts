import { BufferStream } from "./buffer-stream.model";

describe("BufferStream", () => {
  let originBuffer: Buffer;
  let bufferSteam: BufferStream;

  beforeEach(() => {
    originBuffer = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
    bufferSteam = new BufferStream(originBuffer, 0, originBuffer.length, true); // NOTE: Big-Endian
  });

  it("correctly initializes an instance", () => {
    expect(bufferSteam.buffer).toEqual(originBuffer);
  });

  it("reads a signed 8-bit integer, and moves its offset by 1", () => {
    const value = bufferSteam.readInt8();

    expect(value).toBe(1);
    expect(bufferSteam.offset).toBe(1);
  });

  it("reads a unsigned 8-bit integer, and moves its offset by 1", () => {
    const value = bufferSteam.readUInt8();

    expect(value).toBe(1);
    expect(bufferSteam.offset).toBe(1);
  });

  it("reads a signed 16-bit integer, and moves its offset by 2", () => {
    const value = bufferSteam.readInt16(); // (Signed) 00000010 00000001 → 258

    expect(value).toBe(258);
    expect(bufferSteam.offset).toBe(2);
  });

  it("reads a unsigned 16-bit integer, and moves its offset by 2", () => {
    const value = bufferSteam.readUInt16(); // (Unsigned) 00000010 00000001 → 258

    expect(value).toBe(258);
    expect(bufferSteam.offset).toBe(2);
  });

  it("reads a signed 32-bit integer, and moves its offset by 4", () => {
    const value = bufferSteam.readInt32(); // (Signed) 00000001 00000010 00000011 00000100 → 16909060

    expect(value).toBe(16909060);
    expect(bufferSteam.offset).toBe(4);
  });

  it("reads a unsigned 32-bit integer, and moves its offset by 4", () => {
    const value = bufferSteam.readUInt32(); // (Unsigned) 00000001 00000010 00000011 00000100 → 16909060

    expect(value).toBe(16909060);
    expect(bufferSteam.offset).toBe(4);
  });

  it("reads a signed 32-bit float, and moves its offset by 4", () => {
    const value = bufferSteam.readFloat(); // (Float) 00000001 00000010 00000011 00000100 → 16909060

    expect(value).toBe(2.387939260590663e-38); // Reference: https://www.h-schmidt.net/FloatConverter/IEEE754.html
    expect(bufferSteam.offset).toBe(4);
  });

  it("reads a signed 64-bit double, and moves its offset by 8", () => {
    const value = bufferSteam.readDouble(); // (Double) 00000001 00000010 00000011 00000100 00000101 00000110 00000111 00001000 → 16909060

    expect(value).toBe(8.20788039913184e-304); // Reference: https://www.binaryconvert.com/result_double.html?hexadecimal=0102030405060708
    expect(bufferSteam.offset).toBe(8);
  });

  it("reads a raw buffer of the specified length", () => {
    const expectedBuffer = Buffer.from([1, 2]);
    const buffer = bufferSteam.readBuffer(2);

    expect(buffer).toEqual(expectedBuffer);
    expect(bufferSteam.offset).toBe(2);
  });

  it("reads a raw buffer of the specified length, and transform into an UTF-8 string", () => {
    const buffer = Buffer.from([97, 98, 99]); // NOTE: ASCII representations.
    const bufferStream = new BufferStream(buffer, 0, buffer.length, true);
    const value = bufferStream.readString(3);

    expect(value).toBe("abc");
    expect(bufferStream.offset).toBe(3);
  });

  // NOTE: Something went wrong.
  it("returns a copy of the instance", () => {
    const copiedBufferStream = bufferSteam.copy(4, 4);

    expect(copiedBufferStream.length).toBe(4);
    expect(copiedBufferStream.endPosition).toBe(8);
  });

  it("creates a checkpoint", () => {
    const checkedBufferStream = bufferSteam
      .createCheckpoint()
      .resumeWithOffset(2);

    expect(checkedBufferStream.offset).toBe(2);
    expect(checkedBufferStream.length).toBe(6);
    expect(checkedBufferStream.endPosition).toBe(8);
  });

  it("calculates a offset from the checkpoint", () => {
    const checkpoint = bufferSteam.createCheckpoint(); // Checked out when the offset is 0

    bufferSteam.skip(4); // Move offset by 4

    expect(bufferSteam.offsetFromCheckpoint(checkpoint)).toBe(4);
  });

  it("skips the specified length, and move its offset by the same amount", () => {
    bufferSteam.skip(4);

    expect(bufferSteam.offset).toBe(4);
  });

  it("returns the remaining length", () => {
    bufferSteam.skip(4);

    expect(bufferSteam.remainingLength()).toBe(4);
  });
});
