import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  GasStationSchedule,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import {
  MottoFuelStatus,
  MottoFuelType,
  MottoGasStation,
  MottoGasStationRaw,
} from '@/stations/motto/motto.typedefs';
import { MottoFuelMapping } from '@/stations/motto/motto.constants';

export class MottoEntity {
  private station: MottoGasStation;

  constructor(station: MottoGasStationRaw) {
    const { status } = this.getStationParams(station);

    this.station = {
      ...station,
      status,
    };
  }

  getStationParams(station: MottoGasStationRaw) {
    const status = {} as Record<MottoFuelType, FuelStatus>;

    station.Goods.forEach((fuelItem) => {
      const [fuelName, fuelStatus] = Object.entries(fuelItem)[0];

      switch (fuelStatus) {
        case MottoFuelStatus.Available: {
          status[fuelName] = FuelStatus.Available;
          break;
        }

        case MottoFuelStatus.CriticalVehicles: {
          status[fuelName] = FuelStatus.OnlyCriticalVehicles;
          break;
        }

        case MottoFuelStatus.Empty:
        default: {
          /* do nothing */
        }
      }
    });

    return {
      status,
    };
  }

  mapName(): string {
    return `MOTTO ${this.station.codeAZS} \n ${this.station.nameAZS.ua}`;
  }

  mapFuelStatus(): Station['status'] {
    const result: Station['status'] = {
      [FuelType.Petrol92]: {},
      [FuelType.Petrol]: {},
      [FuelType.Diesel]: {},
      [FuelType.Gas]: {},
      [FuelType.AdBlue]: {},
    };

    Object.entries(this.station.status).forEach((entry) => {
      const [fuel, status] = entry;

      const mappedFuel = MottoFuelMapping[fuel];
      const mappedStatus = status;

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
    });

    return result;
  }

  mapSchedule(): GasStationSchedule | null {
    const schedule = this.station.Schedule;

    if (!schedule) {
      return null;
    }

    const [start, end] = schedule.split('-');

    return {
      opensAt: start,
      closesAt: end,
    };
  }

  map(): Station {
    return {
      id: `motto_${this.station.id}`,
      provider: StationProvider.Motto,
      name: this.mapName(),
      tel: '0800330250',
      coordinates: {
        lat: this.station.latitude,
        lng: this.station.longitude,
      },
      workDescription: this.station.WorkDescription,
      descriptionType: GasStationDescriptionType.Raw,
      status: this.mapFuelStatus(),
      schedule: this.mapSchedule(),
      scheduleString: '',
      icon: '/marker/motto.svg',
      reference: {
        title: 'motto.ua',
        link: 'https://motto.ua/',
      },
    };
  }
}
