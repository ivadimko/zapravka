import { FuelStatus } from '@/fuels/fuels.typedefs';

export enum MottoFuelType {
  M100 = '1644b5d5-8d4c-11de-849b-00e081b1bf9b',
  A98 = '9da05453-f626-11da-98ba-00e0812c63f2',
  M95 = 'c784499e-8e15-11de-849b-00e081b1bf9b',
  A95EKO = '10ba969b-5c4e-11e5-8693-005056b97444',
  A95 = '1f57ca06-dc2a-11da-8dd9-00e0812c63f2',
  A92 = '8b7b69ca-f45c-11da-98ba-00e0812c63f2',
  DieselPlus = 'a774566d-08ab-11e3-995c-00e081b1bf9b',
  Diesel = '9da05458-f626-11da-98ba-00e0812c63f2',
  Gas = '6bab0185-05e3-11db-acaa-00e0812c63f2',
}

export enum MottoFuelStatus {
  Available = '1',
  CriticalVehicles = '2',
  Empty = '3',
}

export interface MottoFuelItem {
  fuelMobId: number;
  price: number;
  name: string;
  latName: MottoFuelType;
}

export interface MottoGasStationRaw {
  codeAZS: string;
  id: string;
  brand_id: string;
  brand_color: string;
  nameAZS: {
    ua: string;
    ru: string;
    en: string;
  };
  longitude: number;
  latitude: number;
  Schedule: string; // "08:00-20:00",
  WorkDescription: string;
  Services: Array<any>;
  Goods: Array<Record<MottoFuelType, MottoFuelStatus>>;
  Prices: Array<{ GUID: MottoFuelType; price: number }>;
}

export interface MottoGasStation extends MottoGasStationRaw {
  status: Record<MottoFuelType, FuelStatus>;
}
