import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  StationProvider,
} from '@/stations/stations.typedefs';
import {
  FuelStatus,
  FuelStatusWithPrice,
  FuelType,
} from '@/fuels/fuels.typedefs';
import {
  BRSMFuelType,
  BRSMGasStation,
  BRSMGasStationRaw,
} from '@/stations/brsm/brsm.typedefs';
import { BRSMFuelMapping } from '@/stations/brsm/brsm.constants';

export class BrsmEntity {
  private station: BRSMGasStation;

  constructor(station: BRSMGasStationRaw) {
    const { status } = this.getStationParams(station);

    this.station = {
      ...station,
      status,
    };
  }

  getStationParams(station: BRSMGasStationRaw) {
    const status = {} as Record<BRSMFuelType, FuelStatusWithPrice>;

    station.fuelsItems.forEach((fuelItem) => {
      status[fuelItem.latName] = {
        status: FuelStatus.Available,
        price: fuelItem.price,
      };
    });

    return {
      status,
    };
  }

  mapName(): string {
    return `BRSM ${this.station.id} \n ${this.station.city}, ${this.station.address}, ${this.station.building}`;
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
      const [fuel, { status, price }] = entry;

      const mappedFuel = BRSMFuelMapping[fuel];
      const mappedStatus = status;

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = true;
      result[mappedFuel].price = price;
    });

    return result;
  }

  mapWorkDescription() {
    const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${this.station.fuelsItems
          .map((fuel) => {
            const price = fuel.price ?? '--';

            return `<li>${fuel.name}: ${price}</li>`;
          })
          .join('')}
    </ul>
  `;

    return fuels;
  }

  map(): Station {
    return {
      id: `brsm_${this.station.id}`,
      provider: StationProvider.BRSM,
      name: this.mapName(),
      tel: this.station.phone || '0800303404',
      coordinates: {
        lat: Number(this.station.lat),
        lng: Number(this.station.lng),
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/brsm.svg',
      reference: {
        title: 'brsm-nafta.com',
        link: 'https://brsm-nafta.com/map',
      },
    };
  }
}
