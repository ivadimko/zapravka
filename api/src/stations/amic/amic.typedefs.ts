import { PartialRecord } from '@/utils/PartialRecord';

export enum AmicFuelType {
  A92 = 'A92',
  A95 = 'A95',
  Diesel = 'D',
  Gas = 'Gas',
  AdBlue = 'AdB',
}

export interface AmicGasStation {
  id: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  status: PartialRecord<AmicFuelType, boolean>;
}
