export interface Metadata {
  maker: string;
  model: string;
  modifyDate: string;
  coordinate: { latitude: number; longitude: number };
}

export interface Photo {
  id: string;
  file: Express.Multer.File;
  metadata: Metadata;
}
