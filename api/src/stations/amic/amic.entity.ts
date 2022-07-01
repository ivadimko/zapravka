import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import { AmicGasStation } from '@/stations/amic/amic.typedefs';
import { AmicFuelMapping, AmicFuelNames } from '@/stations/amic/amic.constants';

export class AmicEntity {
  constructor(private readonly station: AmicGasStation) {}

  mapName(): string {
    return `${this.station.name} \n ${this.station.address}`;
  }

  mapFuelStatus(): Station['status'] {
    const result: Station['status'] = {
      [FuelType.Petrol92]: {},
      [FuelType.Petrol]: {},
      [FuelType.Diesel]: {},
      [FuelType.Gas]: {},
      [FuelType.AdBlue]: {},
    };

    Object.keys(this.station.status).forEach((fuel) => {
      const mappedFuel = AmicFuelMapping[fuel];
      const mappedStatus = FuelStatus.Available;

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
    });

    return result;
  }

  mapWorkDescription() {
    const stationFuels = [];

    Object.keys(this.station.status).forEach((name) => {
      stationFuels.push({
        fuel: AmicFuelNames[name],
      });
    });

    const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${stationFuels.map((el) => `<li>${el.fuel}</li>`).join('')}
    </ul>
  `;

    return fuels;
  }

  map(): Station {
    return {
      id: `amic_${this.station.id}`,
      provider: StationProvider.Amic,
      name: this.mapName(),
      tel: '0800501110',
      coordinates: {
        lat: Number(this.station.lat),
        lng: Number(this.station.lng),
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/amic.svg',
      reference: {
        title: 'amicenergy.com.ua',
        link: 'https://amicenergy.com.ua/ua/prodykciya/',
      },
    };
  }
}
