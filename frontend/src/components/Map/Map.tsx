import {
  FC, useCallback, useEffect, useMemo, useState,
} from 'react';
import Select, { SingleValue } from 'react-select';
import { FuelMap } from '@/components/FuelMap';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import { UpdatedAt } from '@/components/Map/components/UpdatedAt';
import { StationFragment } from '@/controllers/graphql/generated';
import styles from './Map.module.scss';

const statusOptions = [
  { value: FuelStatus.Available, label: 'Можна купити' },
  { value: FuelStatus.AvailableFuelCards, label: 'Тільки по талонах' },
  { value: FuelStatus.OnlyCriticalVehicles, label: 'Тільки спецтранспорт' },
  { value: FuelStatus.Empty, label: 'Всі станції' },
];

const fuelOptions = [
  { value: FuelType.Petrol92, label: 'Бензин А92' },
  { value: FuelType.Petrol, label: 'Бензин А95+' },
  { value: FuelType.Diesel, label: 'Дизель' },
  { value: FuelType.Gas, label: 'Газ' },
];

interface Props {
  data: Array<StationFragment>
  updatedAt: string
}

const FUEL_TYPE_KEY = 'fuel_type';
const FUEL_STATUS_KEY = 'fuel_status';

export const Map: FC<Props> = (props) => {
  const { data, updatedAt } = props;

  const [
    fuel,
    setFuel,
  ] = useState<SingleValue<{ label: string, value: FuelType }>>(
    fuelOptions[1],
  );

  const [
    status,
    setStatus,
  ] = useState<SingleValue<{ label: string, value: FuelStatus }>>(
    statusOptions[0],
  );

  const stationsToRender = useMemo(() => {
    if (!fuel || !status || status.value === FuelStatus.Empty) {
      return data;
    }

    return data.filter(
      (station) => station.status[fuel.value]?.[status.value] === true,
    );
  }, [data, fuel, status]);

  const updateFuelType = useCallback(
    (value: SingleValue<{ label: string, value: FuelType }>) => {
      setFuel(value);

      localStorage.setItem(FUEL_TYPE_KEY, JSON.stringify(value));
    },
    [],
  );

  const updateFuelStatus = useCallback(
    (value: SingleValue<{ label: string, value: FuelStatus }>) => {
      setStatus(value);

      localStorage.setItem(FUEL_STATUS_KEY, JSON.stringify(value));
    },
    [],
  );

  useEffect(() => {
    const fuelStatus = localStorage.getItem(FUEL_STATUS_KEY);
    const fuelType = localStorage.getItem(FUEL_TYPE_KEY);

    try {
      if (fuelType) {
        setFuel(JSON.parse(fuelType));
      }

      if (fuelStatus) {
        setStatus(JSON.parse(fuelStatus));
      }
    } catch {
      // do nothing
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Select
          id="fuel-select"
          instanceId="fuel-select"
          options={fuelOptions}
          value={fuel}
          isSearchable={false}
          className={styles.select}
          onChange={(value) => {
            updateFuelType(value);
          }}
        />

        <Select
          id="fuel-status-select"
          instanceId="fuel-status-select"
          options={statusOptions}
          value={status}
          isSearchable={false}
          className={styles.select}
          onChange={(value) => {
            updateFuelStatus(value);
          }}
        />
      </div>

      <FuelMap
        stations={stationsToRender}
        updatedAt={updatedAt}
      />

      <UpdatedAt updatedAt={updatedAt} />
    </div>
  );
};
