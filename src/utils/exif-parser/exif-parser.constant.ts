import { Tag } from './exif-parser.model';

export const BYTES_PER_COMPONENT: { [format: number]: number } = {
  0x01: 1, // Unsigned Byte
  0x02: 1, // ASCII String
  0x03: 2, // Unsigned Short
  0x04: 4, // Unsigned Long
  0x05: 8, // Unsigned Rational
  0x06: 1, // Signed Byte
  0x07: 1, // Undefined
  0x08: 2, // Signed Short
  0x09: 4, // Signed Long
  0x0a: 8, // Signed Rational
  0x0b: 4, // Single Float
  0x0c: 8, // Double Float
};

export const JPEG_MARKER_TYPES: { [markerType: number]: string } = {
  0xc0: 'SOF0',
  0xc2: 'SOF2',
  0xc4: 'DHT',
  0xd0: 'Restart',
  0xd1: 'Restart',
  0xd2: 'Restart',
  0xd3: 'Restart',
  0xd4: 'Restart',
  0xd5: 'Restart',
  0xd6: 'Restart',
  0xd7: 'Restart',
  0xd8: 'SOI',
  0xd9: 'EOI',
  0xda: 'SOS',
  0xdb: 'DQT',
  0xdd: 'DRI',
  0xe0: 'APP0',
  0xe1: 'APP1',
  0xe2: 'APP2',
  0xfe: 'COM',
};

export const GPS_EXIF_TAGS: Tag = {
  0x0000: 'GPSVersionID',
  0x0001: 'GPSLatitudeRef',
  0x0002: 'GPSLatitude',
  0x0003: 'GPSLongitudeRef',
  0x0004: 'GPSLongitude',
  0x0005: 'GPSAltitudeRef',
  0x0006: 'GPSAltitude',
  0x0007: 'GPSTimeStamp',
  0x0008: 'GPSSatellites',
  0x0009: 'GPSStatus',
  0x000a: 'GPSMeasureMode',
  0x000b: 'GPSDOP',
  0x000c: 'GPSSpeedRef',
  0x000d: 'GPSSpeed',
  0x000e: 'GPSTrackRef',
  0x000f: 'GPSTrack',
  0x0010: 'GPSImgDirectionRef',
  0x0011: 'GPSImgDirection',
  0x0012: 'GPSMapDatum',
  0x0013: 'GPSDestLatitudeRef',
  0x0014: 'GPSDestLatitude',
  0x0015: 'GPSDestLongitudeRef',
  0x0016: 'GPSDestLongitude',
  0x0017: 'GPSDestBearingRef',
  0x0018: 'GPSDestBearing',
  0x0019: 'GPSDestDistanceRef',
  0x001a: 'GPSDestDistance',
  0x001b: 'GPSProcessingMethod',
  0x001c: 'GPSAreaInformation',
  0x001d: 'GPSDateStamp',
  0x001e: 'GPSDifferential',
  0x001f: 'GPSHPositioningError',
};

export const IFD_EXIF_TAGS: Tag = {
  0x0001: 'InteropIndex',
  0x0002: 'InteropVersion',
  0x000b: 'ProcessingSoftware',
  0x00fe: 'SubfileType',
  0x00ff: 'OldSubfileType',
  0x0100: 'ImageWidth',
  0x0101: 'ImageHeight',
  0x0102: 'BitsPerSample',
  0x0103: 'Compression',
  0x0106: 'PhotometricInterpretation',
  0x0107: 'Thresholding',
  0x0108: 'CellWidth',
  0x0109: 'CellLength',
  0x010a: 'FillOrder',
  0x010d: 'DocumentName',
  0x010e: 'ImageDescription',
  0x010f: 'Make',
  0x0110: 'Model',
  0x0111: 'StripOffsets',
  0x0112: 'Orientation',
  0x0115: 'SamplesPerPixel',
  0x0116: 'RowsPerStrip',
  0x0117: 'StripByteCounts',
  0x0118: 'MinSampleValue',
  0x0119: 'MaxSampleValue',
  0x011a: 'XResolution',
  0x011b: 'YResolution',
  0x011c: 'PlanarConfiguration',
  0x011d: 'PageName',
  0x011e: 'XPosition',
  0x011f: 'YPosition',
  0x0120: 'FreeOffsets',
  0x0121: 'FreeByteCounts',
  0x0122: 'GrayResponseUnit',
  0x0123: 'GrayResponseCurve',
  0x0124: 'T4Options',
  0x0125: 'T6Options',
  0x0128: 'ResolutionUnit',
  0x0129: 'PageNumber',
  0x012c: 'ColorResponseUnit',
  0x012d: 'TransferFunction',
  0x0131: 'Software',
  0x0132: 'ModifyDate',
  0x013b: 'Artist',
  0x013c: 'HostComputer',
  0x013d: 'Predictor',
  0x013e: 'WhitePoint',
  0x013f: 'PrimaryChromaticities',
  0x0140: 'ColorMap',
  0x0141: 'HalftoneHints',
  0x0142: 'TileWidth',
  0x0143: 'TileLength',
  0x0144: 'TileOffsets',
  0x0145: 'TileByteCounts',
  0x0146: 'BadFaxLines',
  0x0147: 'CleanFaxData',
  0x0148: 'ConsecutiveBadFaxLines',
  0x014a: 'SubIFD',
  0x014c: 'InkSet',
  0x014d: 'InkNames',
  0x014e: 'NumberofInks',
  0x0150: 'DotRange',
  0x0151: 'TargetPrinter',
  0x0152: 'ExtraSamples',
  0x0153: 'SampleFormat',
  0x0154: 'SMinSampleValue',
  0x0155: 'SMaxSampleValue',
  0x0156: 'TransferRange',
  0x0157: 'ClipPath',
  0x0158: 'XClipPathUnits',
  0x0159: 'YClipPathUnits',
  0x015a: 'Indexed',
  0x015b: 'JPEGTables',
  0x015f: 'OPIProxy',
  0x0190: 'GlobalParametersIFD',
  0x0191: 'ProfileType',
  0x0192: 'FaxProfile',
  0x0193: 'CodingMethods',
  0x0194: 'VersionYear',
  0x0195: 'ModeNumber',
  0x01b1: 'Decode',
  0x01b2: 'DefaultImageColor',
  0x01b3: 'T82Options',
  0x01b5: 'JPEGTables',
  0x0200: 'JPEGProc',
  0x0201: 'ThumbnailOffset',
  0x0202: 'ThumbnailLength',
  0x0203: 'JPEGRestartInterval',
  0x0205: 'JPEGLosslessPredictors',
  0x0206: 'JPEGPointTransforms',
  0x0207: 'JPEGQTables',
  0x0208: 'JPEGDCTables',
  0x0209: 'JPEGACTables',
  0x0211: 'YCbCrCoefficients',
  0x0212: 'YCbCrSubSampling',
  0x0213: 'YCbCrPositioning',
  0x0214: 'ReferenceBlackWhite',
  0x022f: 'StripRowCounts',
  0x02bc: 'ApplicationNotes',
  0x03e7: 'USPTOMiscellaneous',
  0x1000: 'RelatedImageFileFormat',
  0x1001: 'RelatedImageWidth',
  0x1002: 'RelatedImageHeight',
  0x4746: 'Rating',
  0x4747: 'XP_DIP_XML',
  0x4748: 'StitchInfo',
  0x4749: 'RatingPercent',
  0x800d: 'ImageID',
  0x80a3: 'WangTag1',
  0x80a4: 'WangAnnotation',
  0x80a5: 'WangTag3',
  0x80a6: 'WangTag4',
  0x80e3: 'Matteing',
  0x80e4: 'DataType',
  0x80e5: 'ImageDepth',
  0x80e6: 'TileDepth',
  0x827d: 'Model2',
  0x828d: 'CFARepeatPatternDim',
  0x828e: 'CFAPattern2',
  0x828f: 'BatteryLevel',
  0x8290: 'KodakIFD',
  0x8298: 'Copyright',
  0x829a: 'ExposureTime',
  0x829d: 'FNumber',
  0x82a5: 'MDFileTag',
  0x82a6: 'MDScalePixel',
  0x82a7: 'MDColorTable',
  0x82a8: 'MDLabName',
  0x82a9: 'MDSampleInfo',
  0x82aa: 'MDPrepDate',
  0x82ab: 'MDPrepTime',
  0x82ac: 'MDFileUnits',
  0x830e: 'PixelScale',
  0x8335: 'AdventScale',
  0x8336: 'AdventRevision',
  0x835c: 'UIC1Tag',
  0x835d: 'UIC2Tag',
  0x835e: 'UIC3Tag',
  0x835f: 'UIC4Tag',
  0x83bb: 'IPTC-NAA',
  0x847e: 'IntergraphPacketData',
  0x847f: 'IntergraphFlagRegisters',
  0x8480: 'IntergraphMatrix',
  0x8481: 'INGRReserved',
  0x8482: 'ModelTiePoint',
  0x84e0: 'Site',
  0x84e1: 'ColorSequence',
  0x84e2: 'IT8Header',
  0x84e3: 'RasterPadding',
  0x84e4: 'BitsPerRunLength',
  0x84e5: 'BitsPerExtendedRunLength',
  0x84e6: 'ColorTable',
  0x84e7: 'ImageColorIndicator',
  0x84e8: 'BackgroundColorIndicator',
  0x84e9: 'ImageColorValue',
  0x84ea: 'BackgroundColorValue',
  0x84eb: 'PixelIntensityRange',
  0x84ec: 'TransparencyIndicator',
  0x84ed: 'ColorCharacterization',
  0x84ee: 'HCUsage',
  0x84ef: 'TrapIndicator',
  0x84f0: 'CMYKEquivalent',
  0x8546: 'SEMInfo',
  0x8568: 'AFCP_IPTC',
  0x85b8: 'PixelMagicJBIGOptions',
  0x85d8: 'ModelTransform',
  0x8602: 'WB_GRGBLevels',
  0x8606: 'LeafData',
  0x8649: 'PhotoshopSettings',
  0x8769: 'ExifOffset',
  0x8773: 'ICC_Profile',
  0x877f: 'TIFF_FXExtensions',
  0x8780: 'MultiProfiles',
  0x8781: 'SharedData',
  0x8782: 'T88Options',
  0x87ac: 'ImageLayer',
  0x87af: 'GeoTiffDirectory',
  0x87b0: 'GeoTiffDoubleParams',
  0x87b1: 'GeoTiffAsciiParams',
  0x8822: 'ExposureProgram',
  0x8824: 'SpectralSensitivity',
  0x8825: 'GPSInfo',
  0x8827: 'ISO',
  0x8828: 'Opto-ElectricConvFactor',
  0x8829: 'Interlace',
  0x882a: 'TimeZoneOffset',
  0x882b: 'SelfTimerMode',
  0x8830: 'SensitivityType',
  0x8831: 'StandardOutputSensitivity',
  0x8832: 'RecommendedExposureIndex',
  0x8833: 'ISOSpeed',
  0x8834: 'ISOSpeedLatitudeyyy',
  0x8835: 'ISOSpeedLatitudezzz',
  0x885c: 'FaxRecvParams',
  0x885d: 'FaxSubAddress',
  0x885e: 'FaxRecvTime',
  0x888a: 'LeafSubIFD',
  0x9000: 'ExifVersion',
  0x9003: 'DateTimeOriginal',
  0x9004: 'CreateDate',
  0x9101: 'ComponentsConfiguration',
  0x9102: 'CompressedBitsPerPixel',
  0x9201: 'ShutterSpeedValue',
  0x9202: 'ApertureValue',
  0x9203: 'BrightnessValue',
  0x9204: 'ExposureCompensation',
  0x9205: 'MaxApertureValue',
  0x9206: 'SubjectDistance',
  0x9207: 'MeteringMode',
  0x9208: 'LightSource',
  0x9209: 'Flash',
  0x920a: 'FocalLength',
  0x920b: 'FlashEnergy',
  0x920c: 'SpatialFrequencyResponse',
  0x920d: 'Noise',
  0x920e: 'FocalPlaneXResolution',
  0x920f: 'FocalPlaneYResolution',
  0x9210: 'FocalPlaneResolutionUnit',
  0x9211: 'ImageNumber',
  0x9212: 'SecurityClassification',
  0x9213: 'ImageHistory',
  0x9214: 'SubjectArea',
  0x9215: 'ExposureIndex',
  0x9216: 'TIFF-EPStandardID',
  0x9217: 'SensingMethod',
  0x923a: 'CIP3DataFile',
  0x923b: 'CIP3Sheet',
  0x923c: 'CIP3Side',
  0x923f: 'StoNits',
  0x927c: 'MakerNote',
  0x9286: 'UserComment',
  0x9290: 'SubSecTime',
  0x9291: 'SubSecTimeOriginal',
  0x9292: 'SubSecTimeDigitized',
  0x932f: 'MSDocumentText',
  0x9330: 'MSPropertySetStorage',
  0x9331: 'MSDocumentTextPosition',
  0x935c: 'ImageSourceData',
  0x9c9b: 'XPTitle',
  0x9c9c: 'XPComment',
  0x9c9d: 'XPAuthor',
  0x9c9e: 'XPKeywords',
  0x9c9f: 'XPSubject',
  0xa000: 'FlashpixVersion',
  0xa001: 'ColorSpace',
  0xa002: 'ExifImageWidth',
  0xa003: 'ExifImageHeight',
  0xa004: 'RelatedSoundFile',
  0xa005: 'InteropOffset',
  0xa20b: 'FlashEnergy',
  0xa20c: 'SpatialFrequencyResponse',
  0xa20d: 'Noise',
  0xa20e: 'FocalPlaneXResolution',
  0xa20f: 'FocalPlaneYResolution',
  0xa210: 'FocalPlaneResolutionUnit',
  0xa211: 'ImageNumber',
  0xa212: 'SecurityClassification',
  0xa213: 'ImageHistory',
  0xa214: 'SubjectLocation',
  0xa215: 'ExposureIndex',
  0xa216: 'TIFF-EPStandardID',
  0xa217: 'SensingMethod',
  0xa300: 'FileSource',
  0xa301: 'SceneType',
  0xa302: 'CFAPattern',
  0xa401: 'CustomRendered',
  0xa402: 'ExposureMode',
  0xa403: 'WhiteBalance',
  0xa404: 'DigitalZoomRatio',
  0xa405: 'FocalLengthIn35mmFormat',
  0xa406: 'SceneCaptureType',
  0xa407: 'GainControl',
  0xa408: 'Contrast',
  0xa409: 'Saturation',
  0xa40a: 'Sharpness',
  0xa40b: 'DeviceSettingDescription',
  0xa40c: 'SubjectDistanceRange',
  0xa420: 'ImageUniqueID',
  0xa430: 'OwnerName',
  0xa431: 'SerialNumber',
  0xa432: 'LensInfo',
  0xa433: 'LensMake',
  0xa434: 'LensModel',
  0xa435: 'LensSerialNumber',
  0xa480: 'GDALMetadata',
  0xa481: 'GDALNoData',
  0xa500: 'Gamma',
  0xafc0: 'ExpandSoftware',
  0xafc1: 'ExpandLens',
  0xafc2: 'ExpandFilm',
  0xafc3: 'ExpandFilterLens',
  0xafc4: 'ExpandScanner',
  0xafc5: 'ExpandFlashLamp',
  0xbc01: 'PixelFormat',
  0xbc02: 'Transformation',
  0xbc03: 'Uncompressed',
  0xbc04: 'ImageType',
  0xbc80: 'ImageWidth',
  0xbc81: 'ImageHeight',
  0xbc82: 'WidthResolution',
  0xbc83: 'HeightResolution',
  0xbcc0: 'ImageOffset',
  0xbcc1: 'ImageByteCount',
  0xbcc2: 'AlphaOffset',
  0xbcc3: 'AlphaByteCount',
  0xbcc4: 'ImageDataDiscard',
  0xbcc5: 'AlphaDataDiscard',
  0xc427: 'OceScanjobDesc',
  0xc428: 'OceApplicationSelector',
  0xc429: 'OceIDNumber',
  0xc42a: 'OceImageLogic',
  0xc44f: 'Annotations',
  0xc4a5: 'PrintIM',
  0xc580: 'USPTOOriginalContentType',
  0xc612: 'DNGVersion',
  0xc613: 'DNGBackwardVersion',
  0xc614: 'UniqueCameraModel',
  0xc615: 'LocalizedCameraModel',
  0xc616: 'CFAPlaneColor',
  0xc617: 'CFALayout',
  0xc618: 'LinearizationTable',
  0xc619: 'BlackLevelRepeatDim',
  0xc61a: 'BlackLevel',
  0xc61b: 'BlackLevelDeltaH',
  0xc61c: 'BlackLevelDeltaV',
  0xc61d: 'WhiteLevel',
  0xc61e: 'DefaultScale',
  0xc61f: 'DefaultCropOrigin',
  0xc620: 'DefaultCropSize',
  0xc621: 'ColorMatrix1',
  0xc622: 'ColorMatrix2',
  0xc623: 'CameraCalibration1',
  0xc624: 'CameraCalibration2',
  0xc625: 'ReductionMatrix1',
  0xc626: 'ReductionMatrix2',
  0xc627: 'AnalogBalance',
  0xc628: 'AsShotNeutral',
  0xc629: 'AsShotWhiteXY',
  0xc62a: 'BaselineExposure',
  0xc62b: 'BaselineNoise',
  0xc62c: 'BaselineSharpness',
  0xc62d: 'BayerGreenSplit',
  0xc62e: 'LinearResponseLimit',
  0xc62f: 'CameraSerialNumber',
  0xc630: 'DNGLensInfo',
  0xc631: 'ChromaBlurRadius',
  0xc632: 'AntiAliasStrength',
  0xc633: 'ShadowScale',
  0xc634: 'DNGPrivateData',
  0xc635: 'MakerNoteSafety',
  0xc640: 'RawImageSegmentation',
  0xc65a: 'CalibrationIlluminant1',
  0xc65b: 'CalibrationIlluminant2',
  0xc65c: 'BestQualityScale',
  0xc65d: 'RawDataUniqueID',
  0xc660: 'AliasLayerMetadata',
  0xc68b: 'OriginalRawFileName',
  0xc68c: 'OriginalRawFileData',
  0xc68d: 'ActiveArea',
  0xc68e: 'MaskedAreas',
  0xc68f: 'AsShotICCProfile',
  0xc690: 'AsShotPreProfileMatrix',
  0xc691: 'CurrentICCProfile',
  0xc692: 'CurrentPreProfileMatrix',
  0xc6bf: 'ColorimetricReference',
  0xc6d2: 'PanasonicTitle',
  0xc6d3: 'PanasonicTitle2',
  0xc6f3: 'CameraCalibrationSig',
  0xc6f4: 'ProfileCalibrationSig',
  0xc6f5: 'ProfileIFD',
  0xc6f6: 'AsShotProfileName',
  0xc6f7: 'NoiseReductionApplied',
  0xc6f8: 'ProfileName',
  0xc6f9: 'ProfileHueSatMapDims',
  0xc6fa: 'ProfileHueSatMapData1',
  0xc6fb: 'ProfileHueSatMapData2',
  0xc6fc: 'ProfileToneCurve',
  0xc6fd: 'ProfileEmbedPolicy',
  0xc6fe: 'ProfileCopyright',
  0xc714: 'ForwardMatrix1',
  0xc715: 'ForwardMatrix2',
  0xc716: 'PreviewApplicationName',
  0xc717: 'PreviewApplicationVersion',
  0xc718: 'PreviewSettingsName',
  0xc719: 'PreviewSettingsDigest',
  0xc71a: 'PreviewColorSpace',
  0xc71b: 'PreviewDateTime',
  0xc71c: 'RawImageDigest',
  0xc71d: 'OriginalRawFileDigest',
  0xc71e: 'SubTileBlockSize',
  0xc71f: 'RowInterleaveFactor',
  0xc725: 'ProfileLookTableDims',
  0xc726: 'ProfileLookTableData',
  0xc740: 'OpcodeList1',
  0xc741: 'OpcodeList2',
  0xc74e: 'OpcodeList3',
  0xc761: 'NoiseProfile',
  0xc763: 'TimeCodes',
  0xc764: 'FrameRate',
  0xc772: 'TStop',
  0xc789: 'ReelName',
  0xc791: 'OriginalDefaultFinalSize',
  0xc792: 'OriginalBestQualitySize',
  0xc793: 'OriginalDefaultCropSize',
  0xc7a1: 'CameraLabel',
  0xc7a3: 'ProfileHueSatMapEncoding',
  0xc7a4: 'ProfileLookTableEncoding',
  0xc7a5: 'BaselineExposureOffset',
  0xc7a6: 'DefaultBlackRender',
  0xc7a7: 'NewRawImageDigest',
  0xc7a8: 'RawToPreviewGain',
  0xc7b5: 'DefaultUserCrop',
  0xea1c: 'Padding',
  0xea1d: 'OffsetSchema',
  0xfde8: 'OwnerName',
  0xfde9: 'SerialNumber',
  0xfdea: 'Lens',
  0xfe00: 'KDC_IFD',
  0xfe4c: 'RawFile',
  0xfe4d: 'Converter',
  0xfe4e: 'WhiteBalance',
  0xfe51: 'Exposure',
  0xfe52: 'Shadows',
  0xfe53: 'Brightness',
  0xfe54: 'Contrast',
  0xfe55: 'Saturation',
  0xfe56: 'Sharpness',
  0xfe57: 'Smoothness',
  0xfe58: 'MoireFilter',
};
