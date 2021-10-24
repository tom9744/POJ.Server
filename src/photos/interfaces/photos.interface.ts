export interface Metadata {
  modifyDate: string;
  coordinate: { latitude: number; longitude: number };
}

export interface ProcessedPhoto {
  filename: string;
  path: string;
  metadata: Metadata;
}
