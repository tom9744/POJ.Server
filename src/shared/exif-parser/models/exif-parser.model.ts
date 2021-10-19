export interface ExifParserConfigs {
  hidePointers: boolean;
  imageSize: boolean;
  readBinaryTags: boolean;
  resolveTagNames: boolean;
  returnTags: boolean;
  simplifyValues: boolean;
}

export class IFDEntry {
  private _tagName: string;

  constructor(
    public tagType: number,
    public format: number,
    public values: Array<number> | string,
  ) {}

  get tagName(): string {
    return this._tagName;
  }

  set tagName(value: string) {
    this._tagName = value;
  }
}

export class IFDEntryRational64u {
  private _tagName: string;
  public simplifedValues: Array<number>;

  constructor(
    public tagType: number,
    public format: 0x05 | 0x0a,
    public values: Array<[number, number]>,
  ) {
    this.simplifedValues = values.map(
      ([numerator, denominator]) => numerator / denominator,
    );
  }

  get tagName(): string {
    return this._tagName;
  }

  set tagName(value: string) {
    this._tagName = value;
  }
}

export type App1Section = Array<IFDEntry | IFDEntryRational64u>;

export interface App1Entry {
  ifd0: App1Section;
  ifd1: App1Section;
  subIfd: App1Section;
  gps: App1Section;
}

export type App1SectionData = {
  [key: string]: string | number;
};

export interface App1Data {
  ifd0: App1SectionData;
  ifd1: App1SectionData;
  subIfd: App1SectionData;
  gps: App1SectionData;
}
