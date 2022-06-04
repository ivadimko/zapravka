import { FuelStatus } from '@/fuels/fuels.typedefs';

export enum SocarFuelType {
  A92 = 'A 92',
  A95 = 'A 95',
  Nano95 = 'NANO 95',
  Nano98 = 'NANO 98',
  NanoDiesel = 'NANO ДП',
  NanoDieselExtra = 'Diesel Nano Extro',
  LPG = 'LPG',
  AdBlue = 'AdBlue',
}

export interface SocarGasStationRaw {
  id: string;
  type: string;
  attributes: {
    title: string;
    address: string;
    tel: string;
    city_slug: string;
    street_slug: string;
    marker: {
      lat: number;
      lng: number;
    };
    fuelPrices: string[];
    services: string[];
  };
}

export interface SocarGasStation extends SocarGasStationRaw {
  status: Record<SocarFuelType, FuelStatus>;
}
