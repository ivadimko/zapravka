export enum WogFuelType {
  A92 = 'А92',
  A95 = 'А95',
  Mustang95 = 'М95',
  A98 = 'А-98',
  Mustang100 = 'М100',
  Diesel = 'ДП',
  MustangDiesel = 'МДП',
  MustangDieselPlus = 'МДП+',
  Gas = 'ГАЗ',
}

export enum WogFuelStatus {
  Empty = 'пальне відсутнє',
  OnlyCriticalVehicles = 'тільки спецтранспорт',
  Available = 'готівка',
  AvailableFuelCards = 'талони',
}

export interface WogStationService {
  icon: string;
  name: string;
  id: number;
}

export interface WogFuel {
  cla: string;
  brand: string;
  name: string;
  id: number;
}

export interface WogSchedule {
  day: string; // Сьогодні
  interval: string; // 00:10 - 23:50
}

export interface WogGasStationShort {
  link: string;
  city: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  name: string;
  id: number;
}

export interface WogGasStationRaw extends WogGasStationShort {
  workDescription: string;
  fuels: Array<WogFuel>;
  services: Array<WogStationService>;
  schedule: Array<WogSchedule>;
}

export interface WogGasStation extends WogGasStationRaw {
  status: Record<WogFuelType, string>;
}
