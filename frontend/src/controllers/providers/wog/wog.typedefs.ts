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
  Empty = 'Пальне відсутнє.',
  OnlyCriticalVehicles = 'тільки спецтранспорт.',
  Available = 'Готівка, банк.картки 20л. Гаманець ПРАЙД до 100л. Талони до 40л. Паливна картка (ліміт картки).',
  AvailableFuelCards = 'Гаманець ПРАЙД до 100л. Талони до 40л. Паливна картка (ліміт картки).',
}

export interface WogService {
  icon: string,
  name: string,
  id: number
}

export interface WogFuel {
  cla: string
  brand: string
  name: string
  id: number
}

export interface WogSchedule {
  day: string // Сьогодні
  interval: string // 00:10 - 23:50
}

export interface WogGasStationShort {
  link: string
  city: string
  coordinates: {
    longitude: number
    latitude: number
  }
  name: string
  id: number
}

export interface WogGasStation extends WogGasStationShort {
  workDescription: string
  fuels: Array<WogFuel>
  services: Array<WogService>
  schedule: Array<WogSchedule>
  status: Record<WogFuelType, WogFuelStatus>
}
