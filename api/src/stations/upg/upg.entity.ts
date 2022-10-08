import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
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

      const price = Number(Price);
      const mappedFuel = UpgFuelMapping[Title];
      const mappedStatus = this.resolveMappedStatus(Title, price);

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
      result[mappedFuel].price = price;
    });

    return result;
  }

  map(): Station {
    return {
      id: `upg_${this.station.id}`,
      provider: StationProvider.UPG,
      tel: '0800500064',
      name: this.mapName(),
      coordinates: {
        lat: Number(this.station.Latitude),
        lng: Number(this.station.Longitude),
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/upg.svg',
      reference: {
        title: 'upg.ua',
        link: 'https://upg.ua/merezha_azs',
      },
    };
  }
}
