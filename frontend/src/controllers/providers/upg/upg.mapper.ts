import {
  GasStation,
  GasStationDescriptionType, GasStationSchedule,
} from '@/controllers/station/station.typedefs';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import {
  UPGFuelType,
  UPGGasStation,
} from '@/controllers/providers/upg/upg.typedefs';
import { UpgFuelMapping } from '@/controllers/providers/upg/upg.constants';
import {
  makeExternalUtm,
} from '@/controllers/analytics/analytics.utils/makeExternalUtm';

const PrepaidFuels = {
  [UPGFuelType.A92Prepaid]: true,
  [UPGFuelType.A95Prepaid]: true,
  [UPGFuelType.DieselPrepaid]: true,
};

const resolveMappedStatus = (fuel: UPGFuelType, price: number) => {
  if (!price) {
    return FuelStatus.Empty;
  }

  if (PrepaidFuels[fuel]) {
    return FuelStatus.AvailableFuelCards;
  }

  return FuelStatus.Available;
};

const mapFuelStatus = (
  fuels: UPGGasStation['FuelsAsArray'],
  isActive: boolean,
): GasStation['status'] => {
  const result: GasStation['status'] = {
    [FuelType.Petrol92]: {},
    [FuelType.Petrol]: {},
    [FuelType.Diesel]: {},
    [FuelType.Gas]: {},
    [FuelType.AdBlue]: {},
  };

  if (!isActive) {
    return result;
  }

  fuels.forEach((fuel) => {
    const { Title, Price } = fuel;

    const mappedFuel = UpgFuelMapping[Title];
    const mappedStatus = resolveMappedStatus(Title, Number(Price));

    if (!result[mappedFuel]) {
      result[mappedFuel] = {};
    }

    result[mappedFuel][mappedStatus] = true;
  });

  return result;
};

const mapWorkDescription = (station: UPGGasStation): string => {
  if (!station.Active) {
    return '<strong>СТАНЦІЯ НЕ ПРАЦЮЄ</strong>';
  }

  const fuels = `
    <strong>Доступне пальне:</strong>
    <ul>
        ${station.FuelsAsArray.map((el) => `<li>${el.Title}: ${el.Price}</li>`).join('')}
    </ul>
  `;

  return fuels;
};

const mapName = (
  station: UPGGasStation,
): string => {
  let name = `UPG ${station.FullName.slice(0, -13)}`;

  if (!station.Active) {
    name = `[ЗАЧИНЕНО] ${name}`;
  }
  return `${name} \n ${station.Address}`;
};

const getScheduleString = (station: UPGGasStation): string => {
  if (station.Active) {
    return station.FullName.slice(-13);
  }

  return 'closed';
};

const mapSchedule = (schedule?: string): GasStationSchedule | null => {
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
};

export const upgMapper = (station: UPGGasStation): GasStation => ({
  id: `upg_${station.id}`,
  name: mapName(station),
  coordinates: {
    lat: Number(station.Latitude),
    lng: Number(station.Longitude),
  },
  workDescription: mapWorkDescription(station),
  descriptionType: GasStationDescriptionType.HTML,
  status: mapFuelStatus(station.FuelsAsArray, station.Active),
  schedule: mapSchedule(getScheduleString(station)), // "АЗС №98 00:00 - 24:00"
  scheduleString: `Графік роботи: ${getScheduleString(station)}`,
  icon: '/marker/upg.svg',
  reference: {
    title: 'upg.ua',
    link: makeExternalUtm('https://upg.ua/merezha_azs'),
  },
});
