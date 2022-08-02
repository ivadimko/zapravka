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
  AviasFuelInfo,
  AviasFuelType,
  AviasGasStation,
  AviasGasStationRaw,
} from '@/stations/avias/avias.typedefs';
import { AviasFuelMapping } from '@/stations/avias/avias.constants';
import { PartialRecord } from '@/utils/PartialRecord';

export class AviasEntity {
  private station: AviasGasStation;
  private fuels: PartialRecord<AviasFuelType, AviasFuelInfo>;

  constructor(station: AviasGasStationRaw, fuels: AviasFuelInfo[]) {
    const { fuelStatus } = this.getStationParams(station);

    this.fuels = fuels.reduce<PartialRecord<AviasFuelType, AviasFuelInfo>>(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as PartialRecord<AviasFuelType, AviasFuelInfo>,
    );
    this.station = {
      ...station,
      fuelStatus,
    };
  }

  getStationParams(station: AviasGasStationRaw) {
    const fuelStatus = {} as Record<AviasFuelType, FuelStatusWithPrice>;

    try {
      Object.entries(station.units).forEach(([fuelId, options]) => {
        if (options.status === 'ok' && options.rate) {
          fuelStatus[fuelId] = {
            status: FuelStatus.Available,
            price: options.rate,
          };
        }
      });
    } catch {
      console.log(station);
    }

    return {
      fuelStatus,
    };
  }

  mapName(): string {
    return `${this.station.brand} ${this.station.station_id} \n ${this.station.uk.address}`;
  }

  mapFuelStatus(): Station['status'] {
    const result: Station['status'] = {
      [FuelType.Petrol92]: {},
      [FuelType.Petrol]: {},
      [FuelType.Diesel]: {},
      [FuelType.Gas]: {},
      [FuelType.AdBlue]: {},
    };

    Object.entries(this.station.fuelStatus).forEach((entry) => {
      const [fuel, { status, price }] = entry;

      const mappedFuel = AviasFuelMapping[fuel];
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
    const stationFuels = [];

    Object.entries(this.station.units).forEach(([fuelId, options]) => {
      stationFuels.push({
        fuel: this.fuels[fuelId]?.name_uk ?? fuelId,
        price: options.rate || '--',
      });
    });

    const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${stationFuels.map((el) => `<li>${el.fuel}: ${el.price}</li>`).join('')}
    </ul>
  `;

    return fuels;
  }

  map(): Station {
    return {
      id: `avias_${this.station.station_id}`,
      provider: StationProvider.Avias,
      name: this.mapName(),
      tel: '0800501788',
      coordinates: {
        lat: Number(this.station.lat),
        lng: Number(this.station.lon),
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/avias.svg',
      reference: {
        title: 'avias.ua',
        link: 'https://avias.ua/karta-azs/',
      },
    };
  }
}
