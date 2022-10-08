import { FuelStatus } from '@/fuels/fuels.typedefs';

export enum OkkoFuelType {
  A92 = 'a92_evro_tip_oplati',
  A95 = 'a95_evro_tip_oplati',
  Pulls95 = 'pulls95_tip_oplati',
  Diesel = 'dp_evro_tip_oplati',
  PullsDiesel = 'pullsdiesel_tip_oplati',
  Gas = 'gas_tip_oplati',
}

interface OkkoEntity {
  attributes: {
    code: string;
    name: string;
  };
  widgets: string[];
}

export interface OkkoGasStation {
  attributes: {
    [OkkoFuelType.A92]: boolean | null;
    [OkkoFuelType.A95]: boolean | null;
    [OkkoFuelType.Pulls95]: boolean | null;
    [OkkoFuelType.Diesel]: boolean | null;
    [OkkoFuelType.PullsDiesel]: boolean | null;
    [OkkoFuelType.Gas]: boolean | null;
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
