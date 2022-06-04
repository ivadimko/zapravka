import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  GasStationSchedule,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import { UPGFuelType, UPGGasStation } from '@/stations/upg/upg.typedefs';
import { UpgFuelMapping } from '@/stations/upg/upg.constants';
import { PartialRecord } from '@/utils/PartialRecord';

export class UPGEntity {
  constructor(private station: UPGGasStation) {}

  private PrepaidFuels: PartialRecord<UPGFuelType, boolean> = {
    [UPGFuelType.A92Prepaid]: true,
    [UPGFuelType.A95Prepaid]: true,
    [UPGFuelType.DieselPrepaid]: true,
  };

  getScheduleString(): string {
    if (this.station.Active) {
      return this.station.FullName.slice(-13);
    }

    return 'closed';
  }

  mapSchedule(): GasStationSchedule | null {
    const schedule = this.getScheduleString();

    if (!schedule) {
      return null;
    }

    if (schedule === 'closed') {
      return {
        opensAt: '00:00',
        closesAt: '00:00',
      };
    }

    const [start, end] = schedule.split(' - ');

    return {
      opensAt: (start || '').trim(),
      closesAt: (end || '').trim(),
    };
  }

  mapWorkDescription() {
    if (!this.station.Active) {
      return '<strong>СТАНЦІЯ НЕ ПРАЦЮЄ</strong>';
    }

    const fuels = `
      <strong>Доступне пальне:</strong>
      <ul>
          ${this.station.FuelsAsArray.map(
            (el) => `<li>${el.Title}: ${el.Price}</li>`,
          ).join('')}
      </ul>
    `;

    return fuels;
  }

  mapName(): string {
    let name = `UPG ${this.station.FullName.slice(0, -13)}`;

    if (!this.station.Active) {
      name = `[ЗАЧИНЕНО] ${name}`;
    }
    return `${name} \n ${this.station.Address}`;
  }

  resolveMappedStatus(fuel: UPGFuelType, price: number) {
    if (!price) {
      return FuelStatus.Empty;
    }

    if (this.PrepaidFuels[fuel]) {
      return FuelStatus.AvailableFuelCards;
    }

    return FuelStatus.Available;
  }

  mapFuelStatus(): Station['status'] {
    const result: Station['status'] = {
      [FuelType.Petrol92]: {},
      [FuelType.Petrol]: {},
      [FuelType.Diesel]: {},
      [FuelType.Gas]: {},
      [FuelType.AdBlue]: {},
    };

    if (!this.station.Active) {
      return result;
    }

    this.station.FuelsAsArray.forEach((fuel) => {
      const { Title, Price } = fuel;

      const mappedFuel = UpgFuelMapping[Title];
      const mappedStatus = this.resolveMappedStatus(Title, Number(Price));

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
    });

    return result;
  }

  map(): Station {
    return {
      id: `upg_${this.station.id}`,
      provider: StationProvider.UPG,
      name: this.mapName(),
      coordinates: {
        lat: Number(this.station.Latitude),
        lng: Number(this.station.Longitude),
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: this.mapSchedule(), // "АЗС №98 00:00 - 24:00"
      scheduleString: `Графік роботи: ${this.getScheduleString()}`,
      icon: '/marker/upg.svg',
      reference: {
        title: 'upg.ua',
        link: 'https://upg.ua/merezha_azs',
      },
    };
  }
}
