import { IMetadata } from "src/models/metadata.model";

export interface ProcessedPhoto {
  filename: string;
  path: string;
  metadata: IMetadata;
}
