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

    station.services.forEach((serviceItem) => {
      if (serviceItem.type === 'fuel' && serviceItem.price > 0) {
        status[serviceItem.name] = FuelStatus.Available;
      }
    });

    return {
      status,
    };
  }

  mapName(): string {
    return `SOCAR ${this.station.number} \n ${this.station.address}`;
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

  mapSchedule() {
    if (!this.station.working_hours) {
      return null;
    }

    return {
      opensAt: this.station.working_hours.from,
      closesAt: this.station.working_hours.to,
    };
  }

  mapWorkDescription() {
    const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${this.station.services
          .filter((service) => service.type === 'fuel')
          .map((fuel) => {
            const price = fuel.price ?? '--';
            const limit = fuel.limit ? ` (ліміт - ${fuel.limit}л)` : '';

            return `<li>${fuel.name}: ${price}${limit}</li>`;
          })
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
      tel: '0800508585',
      coordinates: {
        lat: this.station.coordinates.lat,
        lng: this.station.coordinates.lng,
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: this.mapSchedule(),
      scheduleString: '',
      icon: '/marker/socar.svg',
      reference: {
        title: 'socar.ua',
        link: 'https://socar.ua/map',
      },
    };
  }
}
