import { Station } from '@/stations/models/station.model';

import {
  GasStationDescriptionType,
  GasStationSchedule,
  StationProvider,
} from '@/stations/stations.typedefs';
import { Node, parse } from 'node-html-parser';
import { FuelStatus, FuelType } from '@/fuels/fuels.typedefs';
import {
  OkkoFuelType,
  OkkoGasStation,
  OkkoGasStationRaw,
} from '@/stations/okko/okko.typedefs';
import { OkkoFuelMapping } from '@/stations/okko/okko.constants';

export class OkkoEntity {
  private station: OkkoGasStation;

  constructor(station: OkkoGasStationRaw) {
    const { schedule, status } = this.getStationParams(
      station.attributes.notification,
    );

    this.station = {
      ...station,
      schedule,
      status,
    };
  }

  private contentStrings = {
    SCHEDULE: 'Графік роботи:',
    AVAILABLE_CASH: 'За готівку і банківські картки доступно',
    AVAILABLE_FUEL_CARDS: 'З паливною карткою і талонами доступно',
  };

  parseFuel = (options: {
    node: Node;
    status: OkkoGasStation['status'];
    type: FuelStatus;
  }) => {
    const { node, status, type } = options;

    node.childNodes.forEach((child) => {
      const [fuel] = (child?.textContent || '').split(':') as [
        OkkoFuelType,
        string,
      ];

      if (!status[fuel]) {
        status[fuel] = [];
      }

      status[fuel].push(type);
    });
  };

  parseSchedule = (content: string) =>
    (content.split(this.contentStrings.SCHEDULE).pop() || '').trim();

  getStationParams(content: string) {
    let schedule = '';
    const status: OkkoGasStation['status'] = {
      [OkkoFuelType.A92]: [],
      [OkkoFuelType.A95]: [],
      [OkkoFuelType.Pulls95]: [],
      [OkkoFuelType.Diesel]: [],
      [OkkoFuelType.PullsDiesel]: [],
      [OkkoFuelType.Gas]: [],
    };

    const root = parse(content.replaceAll('\n', ''));

    root.childNodes.forEach((node) => {
      const content = node.textContent;

      if (content.includes(this.contentStrings.SCHEDULE)) {
        schedule = this.parseSchedule(content);
      } else if (content.includes(this.contentStrings.AVAILABLE_CASH)) {
        this.parseFuel({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          node: node.nextElementSibling,
          status,
          type: FuelStatus.Available,
        });
      } else if (content.includes(this.contentStrings.AVAILABLE_FUEL_CARDS)) {
        this.parseFuel({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          node: node.nextElementSibling,
          status,
          type: FuelStatus.AvailableFuelCards,
        });
      }
    });

    return {
      schedule,
      status,
    };
  }

  mapName(): string {
    const { Cod_AZK, Typ_naselenogo_punktu, Naselenyy_punkt, Adresa } =
      this.station.attributes;

    return `OKKO ${Cod_AZK} \n ${Typ_naselenogo_punktu} ${Naselenyy_punkt}, ${Adresa}`;
  }

  mapSchedule(): GasStationSchedule {
    if (!this.station.schedule) {
      return null;
    }

    if (this.station.schedule.toLowerCase().includes('цілодобово')) {
      return {
        opensAt: '00:00',
        closesAt: '23:59',
      };
    }

    const [start, end] = this.station.schedule.split(' до ');

    return {
      opensAt: (start || '').replace('з', '').trim(),
      closesAt: (end || '').replace('.', '').trim(),
    };
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
      const [fuel, availabilities] = entry;

      const mappedFuel = OkkoFuelMapping[fuel as OkkoFuelType];

      if (!result[mappedFuel]) {
        result[mappedFuel] = {};
      }

      availabilities.forEach((status) => {
        result[mappedFuel][status] = true;
      });
    });

    return result;
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
      workDescription: this.station.attributes.notification,
      descriptionType: GasStationDescriptionType.HTML,
      status: this.mapFuelStatus(),
      schedule: this.mapSchedule(),
      scheduleString: '',
      icon: '/marker/okko.png',
      reference: {
        title: 'okko.ua',
        link: 'https://www.okko.ua/fuel-map',
      },
    };
  }
}
