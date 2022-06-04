import { FuelStatus } from '@/fuels/fuels.typedefs';

export enum OkkoFuelType {
  A92 = 'А-92',
  A95 = 'А-95',
  Pulls95 = 'PULLS 95',
  Diesel = 'ДП',
  PullsDiesel = 'PULLS Diesel',
  Gas = 'ГАЗ',
}

interface OkkoEntity {
  attributes: {
    code: string;
    name: string;
  };
  widgets: string[];
}

export interface OkkoGasStationRaw {
  attributes: {
    Cod_AZK: number;
    Oblast: string[];
    Naselenyy_punkt: string;
    Typ_naselenogo_punktu: string;
    Adresa: string;
    Typ_obektu: OkkoEntity;
    fuel_type: Array<OkkoEntity>;
    restaurants: Array<OkkoEntity>;
    car_services: Array<OkkoEntity>;
    car_washes: Array<OkkoEntity>;
    other_services: Array<OkkoEntity>;
    coordinates: {
      lat: number;
      lng: number;
    };
    rozdilnyy_zbir: string[];
    post_machines: Array<OkkoEntity>;
    notification: string;
    type_azk: number;
  };
  widgets: string[];
}

export interface OkkoGasStation extends OkkoGasStationRaw {
  schedule: string;
  status: Record<OkkoFuelType, Array<FuelStatus>>;
}
