export interface ImageFileDirectory0 {
  ImageDescription: string;
  Make: string;
  Model: string;
  Orientation: number;
  XResolution: number;
  YResolution: number;
  ResolutionUnit: number;
  Software: string;
  ModifyDate: string;
  WhitePoint: number;
  PrimaryChromaticities: number;
  YCbCrCoefficients: number;
  YCbCrPositioning: number;
  ReferenceBlackWhite: number;
  Copyright: string;
  ExifOffset: number;
  GPSInfo: number;
}

export interface ImageFileDirectory1 {
  ImageWidth: number;
  ImageHeight: number;
  BitsPerSample: number;
  Compression: number;
  PhotometricInterpretation: number;
  StripOffsets: number;
  SamplesPerPixel: number;
  RowsPerStrip: number;
  StripByteCounts: number;
  XResolution: number;
  YResolution: number;
  PlanarConfiguration: number;
  ResolutionUnit: number;
  ThumbnailOffset: number; // JpegIFOffest
  ThumbnailLength: number; // JpegByteCount
  JPEGRestartInterval: number;
  YCbCrCoefficients: number;
  YCbCrSubSampling: number;
  YCbCrPositioning: number;
  ReferenceBlackWhite: number;
}

export interface SubImageFileDirectory {
  ExposureTime: 0.016666666666666666;
  FNumber: 2.4;
  ExposureProgram: 2;
  ISO: 100;
  ExifVersion: undefined;
  DateTimeOriginal: '2020:01:23 14:21:33';
  CreateDate: '2020:01:23 14:21:33';
  ComponentsConfiguration: undefined;
  ShutterSpeedValue: 5.907640988220577;
  ApertureValue: 2.5260688112781806;
  BrightnessValue: 4.075633315108438;
  ExposureCompensation: 0;
  MeteringMode: 5;
  Flash: 16;
  FocalLength: 6;
  SubjectArea: 2011;
  MakerNote: undefined;
  SubSecTimeOriginal: '818';
  SubSecTimeDigitized: '818';
  FlashpixVersion: undefined;
  ColorSpace: 65535;
  ExifImageWidth: 4032;
  ExifImageHeight: 3024;
  SensingMethod: 2;
  SceneType: undefined;
  ExposureMode: 0;
  WhiteBalance: 0;
  FocalLengthIn35mmFormat: 52;
  SceneCaptureType: 0;
  LensInfo: 4.25;
  LensMake: 'Apple';
  LensModel: 'iPhone XS back dual camera 6mm f/2.4';
}
