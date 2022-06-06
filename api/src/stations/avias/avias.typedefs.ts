import { FuelStatus } from '@/fuels/fuels.typedefs';
import { PartialRecord } from '@/utils/PartialRecord';

export interface AviasFuelInfo {
  id: number;
  name_uk: string;
  name_ru: string;
  name_en: string;
  color: string;
  order: number;
  showInStorePage: boolean;
}

export enum AviasFuelType {
  DieselEnergy = 11,
  DieselEuro = 12,
  GAS = 30,
  A92Energy = 92,
  A95 = 95,
  A95Energy = 96,
  A98 = 98,
}

interface AviasFuelStatus {
  rate: number | null;
  status: 'ok' | 'error';
}

export interface AviasGasStationRaw {
  station_id: string;
  brand: string;
  lat: number;
  lon: number;
  status: string;
  services: number[];
  unixtime: number;
  units: PartialRecord<AviasFuelType, AviasFuelStatus>;
  region: string;
  uk: {
    address: string;
  };
  ru: {
    address: string;
  };
  en: {
    address: string;
  };
}

export interface AviasGasStation extends AviasGasStationRaw {
  fuelStatus: Record<AviasFuelType, FuelStatus>;
}
