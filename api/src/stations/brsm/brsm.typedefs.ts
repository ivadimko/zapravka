import { FuelStatus, FuelStatusWithPrice } from '@/fuels/fuels.typedefs';

export enum BRSMFuelType {
  A92Euro = '92 EURO',
  A95Euro = '95 EURO PLUS',
  A95Premium = '95 PREMIUM+',
  DPEuroPlus = 'DP EURO PLUS',
  LPGPlus = 'LPG PLUS',
}

export interface BRSMFuelItem {
  fuelMobId: number;
  price: number;
  name: string;
  latName: BRSMFuelType;
}

export interface BRSMGasStationRaw {
  id: number;
  region: string;
  city: string;
  address: string;
  building: string;
  phone: string;
  lat: string;
  lng: string;
  editDate: string;
  active: 1 | 0;
  extId: number;
  fuels: number[];
  fuelsItems: BRSMFuelItem[];
  services: number[];
}

export interface BRSMGasStation extends BRSMGasStationRaw {
  status: Record<BRSMFuelType, FuelStatusWithPrice>;
}
