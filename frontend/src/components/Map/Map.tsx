import { FC, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import cn from 'classnames';
import { FuelMap } from '@/components/FuelMap';
import { GasStation } from '@/controllers/station/station.typedefs';
import { FuelStatus, FuelType } from '@/controllers/fuel/fuel.typedefs';
import { UpdatedAt } from '@/components/Map/components/UpdatedAt';
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
  data: Array<GasStation>
  updatedAt: string
}

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

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Select
          id="fuel-select"
          instanceId="fuel-select"
          options={fuelOptions}
          defaultValue={fuel}
          className={styles.select}
          onChange={(value) => {
            setFuel(value);
          }}
        />

        <Select
          id="fuel-status-select"
          instanceId="fuel-status-select"
          options={statusOptions}
          defaultValue={status}
          className={cn(styles.select, styles.statusSelect)}
          onChange={(value) => {
            setStatus(value);
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
