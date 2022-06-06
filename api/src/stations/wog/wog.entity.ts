import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  GasStationSchedule,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import {
  WogFuelStatus,
  WogFuelType,
  WogGasStation,
  WogGasStationRaw,
} from '@/stations/wog/wog.typedefs';
import { WogFuelMapping } from '@/stations/wog/wog.constants';

export class WogEntity {
  private station: WogGasStation;

  constructor(station: WogGasStationRaw) {
    const { status } = this.getStationParams(station);

    this.station = {
      ...station,
      status,
    };
  }

  parseFuel = (wogStatus: string) => {
    const normalizedStatus = wogStatus.toLowerCase();

    if (normalizedStatus.startsWith(WogFuelStatus.Available)) {
      return FuelStatus.Available;
    }

    if (normalizedStatus.startsWith(WogFuelStatus.AvailableFuelCards)) {
      return FuelStatus.AvailableFuelCards;
    }

    if (normalizedStatus.startsWith(WogFuelStatus.OnlyCriticalVehicles)) {
      return FuelStatus.OnlyCriticalVehicles;
    }

    return FuelStatus.Empty;
  };

  getStationParams(station: WogGasStationRaw) {
    const description = station.workDescription;

    const status = {} as Record<WogFuelType, string>;

    const rows = description.split('\n');

    rows.forEach((row: string) => {
      const [fuel, fuelStatus] = row.split(' - ');

      if (fuel && fuelStatus) {
        status[fuel as WogFuelType] = fuelStatus;
      }
    });

    return {
      status,
    };
  }

  mapName(): string {
    return `WOG ${this.station.id} \n ${this.station.name}`;
  }

  mapSchedule(): GasStationSchedule | null {
    const schedule = this.station.schedule[0];

    if (!schedule) {
      return null;
    }

    const [start, end] = schedule.interval.split(' - ');

    return {
      opensAt: start,
      closesAt: end,
    };
  }

  mapScheduleString(): string {
    const schedule = this.station.schedule[0];

    if (!schedule) {
      return '';
    }

    return `${schedule.day}: ${schedule.interval}`;
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

      const mappedFuel = WogFuelMapping[fuel as WogFuelType];
      const mappedStatus = this.parseFuel(status);

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
    });

    return result;
  }

  map(): Station {
    return {
      id: `wog_${this.station.id}`,
      provider: StationProvider.Wog,
      name: this.mapName(),
      tel: '+380800500064',
      coordinates: {
        lat: this.station.coordinates.latitude,
        lng: this.station.coordinates.longitude,
      },
      workDescription: this.station.workDescription,
      descriptionType: GasStationDescriptionType.Raw,
      status: this.mapFuelStatus(),
      schedule: this.mapSchedule(),
      scheduleString: this.mapScheduleString(),
      icon: '/marker/wog.svg',
      reference: {
        title: 'wog.ua',
        link: 'https://wog.ua/ua/map/',
      },
    };
  }
}
