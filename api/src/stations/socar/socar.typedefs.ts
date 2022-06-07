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

interface SocarServiceItem {
  id: number;
  logo: string;
  type: 'fuel' | 'service';
  name: string;
  description: string;
  price: number | null;
  limit: number | null;
  label: null;
}

interface SocarWorkingHours {
  from: string;
  to: string;
}

interface SocarCoordinates {
  lng: number;
  lat: number;
}

export interface SocarGasStationRaw {
  id: number;
  region: string;
  city: string;
  street: string;
  services: Array<SocarServiceItem>;
  working_hours: SocarWorkingHours | null;
  number: string;
  address: string;
  coordinates: SocarCoordinates;
  type: string;
  phone: string;
  image: string;
  supervisor_name: string | null;
  supervisor_phone: string | null;
  supervisor_email: string;
  rating: number;
  review_count: number;
  notification: string | null;
  is_sync_fuel: boolean;
  count_dispenser: number;
  split_dispenser: Array<any>;
  buta_enabled: boolean;
  has_kitchen: boolean;
  min_cook_time: number;
}

export interface SocarGasStation extends SocarGasStationRaw {
  status: Record<SocarFuelType, FuelStatus>;
}
