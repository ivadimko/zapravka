export enum UPGFuelType {
  A100 = 'upg 100',
  A95Prepaid = '95 (передоплата)',
  A95 = '95',
  UPG95 = 'upg 95',
  A92Prepaid = '92 (передоплата)',
  A92 = '92',
  Diesel = 'upg DP',
  DieselPrepaid = 'ДП (передоплата)',
  Gas = 'Газ',
}

export interface UPGGasStation {
  id: number;
  Active: boolean;
  VersionId: number;
  Latitude: string;
  Longitude: string;
  FullName: string;
  ShortName: string;
  Address: string;
  Region: string;
  LastPriceUpdateDate: string;
  ServicesAsArray: Array<{
    id: number;
    Title: string;
  }>;
  FuelsAsArray: Array<{
    id: number;
    Title: UPGFuelType;
    Price: string;
  }>;
}
