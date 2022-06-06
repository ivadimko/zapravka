import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import {
  SocarFuelType,
  SocarGasStation,
  SocarGasStationRaw,
} from '@/stations/socar/socar.typedefs';
import { SocarFuelMapping } from '@/stations/socar/socar.constants';

export class SocarEntity {
  private station: SocarGasStation;

  constructor(station: SocarGasStationRaw) {
    const { status } = this.getStationParams(station);

    this.station = {
      ...station,
      status,
    };
  }

  getStationParams(station: SocarGasStationRaw) {
    const status = {} as Record<SocarFuelType, FuelStatus>;

    const { fuelPrices } = station.attributes;

    fuelPrices.forEach((row) => {
      const priceStartIndex = row.indexOf(' (');

      const fuel = row.substring(0, priceStartIndex);

      status[fuel as SocarFuelType] = FuelStatus.Available;
    });

    return {
      status,
    };
  }

  mapName(): string {
    return `${this.station.attributes.title} \n ${this.station.attributes.address}`;
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

      const mappedFuel = SocarFuelMapping[fuel as SocarFuelType];
      const mappedStatus = status;

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
    });

    return result;
  }

  mapWorkDescription() {
    const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${this.station.attributes.fuelPrices
          .map((el) => `<li>${el}</li>`)
          .join('')}
    </ul>
  `;

    return fuels;
  }

  map(): Station {
    return {
      id: `socar_${this.station.id}`,
      provider: StationProvider.Socar,
      name: this.mapName(),
      tel: '+380800508585',
      coordinates: {
        lat: this.station.attributes.marker.lat,
        lng: this.station.attributes.marker.lng,
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/socar.svg',
      reference: {
        title: 'socar.ua',
        link: 'https://socar.ua/map',
      },
    };
  }
}
