import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';

export enum StationStatus {
  Opened = 'OPENED',
  Closed = 'CLOSED',
  Unknown = 'UNKNOWN',
}

export interface GasStationSchedule {
  opensAt: string // 08:00
  closesAt: string // 23:50
}

export interface GasStation {
  id: string
  name: string
  coordinates: {
    lng: number
    lat: number
  }
  workDescription: string
  status: Record<FuelType, FuelStatus>
  schedule: GasStationSchedule | null
  scheduleString: string
  icon: string
  reference: {
    title: string
    link: string
  }
}
