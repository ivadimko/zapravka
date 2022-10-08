import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  StationProvider,
} from '@/stations/stations.typedefs';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import { OkkoFuelType, OkkoGasStation } from '@/stations/okko/okko.typedefs';
import { OkkoFuelMapping, OkkoFuelNames } from '@/stations/okko/okko.constants';

export class OkkoEntity {
  constructor(private station: OkkoGasStation) {}

  mapName(): string {
    const { Cod_AZK, Typ_naselenogo_punktu, Naselenyy_punkt, Adresa } =
      this.station.attributes;

    return `OKKO ${Cod_AZK} \n ${Typ_naselenogo_punktu} ${Naselenyy_punkt}, ${Adresa}`;
  }

  mapFuelStatus(): Station['status'] {
    const result: Station['status'] = {
      [FuelType.Petrol92]: {},
      [FuelType.Petrol]: {},
      [FuelType.Diesel]: {},
      [FuelType.Gas]: {},
      [FuelType.AdBlue]: {},
    };

    Object.entries(this.station.attributes).forEach((entry) => {
      if (!Object.values(OkkoFuelType).includes(entry[0] as OkkoFuelType)) {
        return;
      }

      const [fuel, isAvailable] = entry;

      const mappedFuel = OkkoFuelMapping[fuel as OkkoFuelType];
      const mappedStatus = FuelStatus.Available;

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      result[mappedFuel][mappedStatus] = Boolean(isAvailable);
    });

    return result;
  }

  mapWorkDescription() {
    const stationFuels = [];

    Object.keys(this.station.attributes).forEach((name) => {
      if (
        Object.values(OkkoFuelType).includes(name as OkkoFuelType) &&
        this.station.attributes[name]
      ) {
        stationFuels.push({
          fuel: OkkoFuelNames[name],
        });
      }
    });

    const fuels = `
    <p>
        <strong>${this.station.attributes.notification}</strong>
    </p>
    <strong>Доступне пальне:</strong>
    <ul>
        ${stationFuels.map((el) => `<li>${el.fuel}</li>`).join('')}
    </ul>
  `;

    return fuels;
  }

  map(): Station {
    return {
      id: `okko_${this.station.attributes.Cod_AZK}`,
      provider: StationProvider.Okko,
      name: this.mapName(),
      tel: '0800501101',
      coordinates: {
        lat: this.station.attributes.coordinates.lat,
        lng: this.station.attributes.coordinates.lng,
      },
      workDescription: this.mapWorkDescription(),
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: null,
      scheduleString: '',
      icon: '/marker/okko.svg',
      reference: {
        title: 'okko.ua',
        link: 'https://www.okko.ua/fuel-map',
      },
    };
  }
}
