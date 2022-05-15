import { InfoWindow, Marker } from '@react-google-maps/api';
import { FC, useMemo, useState } from 'react';
import styles from './StationMarker.module.scss';

export interface Station {
  name: string
  schedule?: {
    'day': string // 'Сьогодні'
    'interval': string // '09:00 - 17:00'
  },
  content: string
  coordinates: {
    latitude: number
    longitude: number
  }
}

interface Props {
  station: Station
  opened: boolean
  open: () => void
  close: () => void
}
export const StationMarker: FC<Props> = (props) => {
  const {
    station, opened, open, close,
  } = props;

  const [
    markerInstance,
    setMarkerInstance,
  ] = useState<google.maps.MVCObject | null>(null);

  const stationStatus = useMemo(() => {
    if (!station.schedule?.interval) {
      return 'UNKNOWN';
    }

    const currentDate = new Date();

    const [start, end] = station.schedule.interval.split(' - ');

    const [startH, startM] = start.split(':');
    const [endH, endM] = end.split(':');

    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(startH),
      Number(startM),
    );

    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      Number(endH),
      Number(endM),
    );

    if (
      currentDate.getTime() >= startDate.getTime()
      && currentDate.getTime() <= endDate.getTime()
    ) {
      return 'OPENED';
    }

    return 'CLOSED';
  }, [station.schedule?.interval]);

  return (
    <>
      <Marker
        onLoad={(marker) => {
          setMarkerInstance(marker);
        }}
        key={
        station.coordinates.latitude + station.coordinates.longitude
      }
        position={{
          lat: station.coordinates.latitude,
          lng: station.coordinates.longitude,
        }}
        options={{
          opacity: stationStatus === 'OPENED' ? 1 : 0.5,
        }}
        onClick={open}
      />

      {opened && markerInstance && (
        // @ts-ignore
        <InfoWindow
          onCloseClick={close}
          anchor={markerInstance}
        >
          <div>
            <p className={styles.title}>{station.name}</p>
            {station.schedule && (
              <p>{`${station.schedule.day}: ${station.schedule.interval}`}</p>
            )}

            <p className={styles.description}>
              {station.content}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
