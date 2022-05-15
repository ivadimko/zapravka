import { FC, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import descriptions from '@/data/wog/descriptions.json';
import { FuelMap } from '@/components/FuelMap';
import styles from './Map.module.scss';

const statusOptions = [
  { value: 'empty', label: 'Пальне відсутнє' },
  { value: 'only_critical_vehicles', label: 'Тільки спецтранспорт' },
  { value: 'available_cash', label: 'Можна купити' },
  { value: 'available_fuel_cards', label: 'Тільки по талонах' },
];

const fuelOptions = [
  { value: 'petrol_92', label: 'Бензин А92' },
  { value: 'petrol', label: 'Бензин А95+' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'gas', label: 'Газ' },
];

interface Props {
  data: Record<string, any>[]
  updatedAt: string
}

export const Map: FC<Props> = (props) => {
  const { data, updatedAt } = props;

  const [
    fuel,
    setFuel,
  ] = useState<SingleValue<{ label: string, value: string }>>(
    fuelOptions[1],
  );

  const [
    status,
    setStatus,
  ] = useState<SingleValue<{ label: string, value: string }>>(
    statusOptions[2],
  );

  const stationsToRender = useMemo(() => {
    if (!fuel || !status) {
      return data;
    }

    return data.filter((station) => (
      Object.entries(station.data.status).some(([fuelName, fuelStatus]) => {
        // @ts-ignore
        const mappedFuel = descriptions.fuelsMap[fuelName];

        return mappedFuel === fuel.value && (
          // @ts-ignore
          descriptions.statuses[fuelStatus] === status.value
        );
      })
    ));
  }, [data, fuel, status]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <Select
          id="fuel-select"
          instanceId="fuel-select"
          options={fuelOptions}
          defaultValue={fuel}
          onChange={(value) => {
            setFuel(value);
          }}
        />

        <Select
          id="fuel-status-select"
          instanceId="fuel-status-select"
          options={statusOptions}
          defaultValue={status}
          className={styles.statusSelect}
          onChange={(value) => {
            setStatus(value);
          }}
        />
      </div>

      <FuelMap
        stations={
          stationsToRender.map((station) => ({
            content: station.data.workDescription,
            coordinates: station.data.coordinates,
            name: station.data.name,
            schedule: Object.values(station.data.schedule[0] ?? []).join(': '),
          }))
        }
      />

      <p className={styles.updatedAt}>{`Updated at: ${updatedAt}`}</p>
    </div>
  );
};
