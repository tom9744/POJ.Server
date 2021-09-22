export type Latitude = number;
export type Longitude = number;
export type Location = [Latitude, Longitude];

export interface Photo {
  id: string;
  file: Express.Multer.File;
  location: Location;
  takenDate: Date;
}
