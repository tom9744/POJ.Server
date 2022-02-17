import { App1Data, App1SectionData } from "src/shared/exif-parser/models";

type CameraInfo = { maker: string; model: string };
type Coordinate = { latitude: number; longitude: number };

export interface IMetadata {
  get cameraInfo(): CameraInfo;
  get coordinate(): Coordinate;
  get modifyDate(): string;
}

export class Metadata implements IMetadata {
  constructor(private exifData: App1Data) {}

  private readLatitude(sectionData: App1SectionData): number {
    const latitudeRef = sectionData["GPSLatitudeRef"] as string;
    const latitude = sectionData["GPSLatitude"] as number;

    return latitudeRef === "N" ? latitude : -latitude;
  }

  private readLongitude(sectionData: App1SectionData): number {
    const longitudeRef = sectionData["GPSLongitudeRef"] as string;
    const longitude = sectionData["GPSLongitude"] as number;

    return longitudeRef === "E" ? longitude : -longitude;
  }

  get coordinate(): { latitude: number; longitude: number } {
    if (
      !this.exifData.gps ||
      !this.exifData.gps.hasOwnProperty("GPSLatitudeRef") ||
      !this.exifData.gps.hasOwnProperty("GPSLatitude") ||
      !this.exifData.gps.hasOwnProperty("GPSLongitudeRef") ||
      !this.exifData.gps.hasOwnProperty("GPSLongitude")
    ) {
      return;
    }

    const latitude = this.readLatitude(this.exifData.gps);
    const longitude = this.readLongitude(this.exifData.gps);

    return { latitude, longitude };
  }

  get cameraInfo(): { maker: string; model: string } {
    if (
      !this.exifData.ifd0 ||
      !this.exifData.ifd0.hasOwnProperty("Make") ||
      !this.exifData.ifd0.hasOwnProperty("Model")
    ) {
      return;
    }

    const maker = this.exifData.ifd0["Make"] as string;
    const model = this.exifData.ifd0["Model"] as string;

    return { maker, model };
  }

  get modifyDate(): string {
    if (
      !this.exifData.ifd0 ||
      !this.exifData.ifd0.hasOwnProperty("ModifyDate")
    ) {
      return;
    }

    const modifyDate = this.exifData.ifd0["ModifyDate"] as string;

    return modifyDate;
  }
}
