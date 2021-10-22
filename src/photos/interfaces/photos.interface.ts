export interface Metadata {
  maker: string;
  model: string;
  modifyDate: string;
  coordinate: { latitude: number; longitude: number };
}

export interface ProcessedPhoto {
  filename: string;
  path: string;
  metadata: Metadata;
}
