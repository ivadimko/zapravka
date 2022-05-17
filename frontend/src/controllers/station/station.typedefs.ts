import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import { PartialRecord } from '@/utils/PartialRecord';

export enum StationStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Unknown = 'UNKNOWN',
}

export interface GasStationSchedule {
  opensAt: string // 08:00
  closesAt: string // 23:50
}

export enum GasStationDescriptionType {
  Raw = 'RAW',
  HTML = 'HTML',
}

export interface GasStation {
  id: string
  name: string
  coordinates: {
    lng: number
    lat: number
  }
  workDescription: string
  descriptionType: GasStationDescriptionType
  status: Record<FuelType, PartialRecord<FuelStatus, boolean>>
  schedule: GasStationSchedule | null
  scheduleString: string
  icon: string
  reference: {
    title: string
    link: string
  }
}
