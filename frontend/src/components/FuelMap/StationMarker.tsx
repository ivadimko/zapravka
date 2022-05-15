import { InfoWindow, Marker } from '@react-google-maps/api';
import { FC, useState } from 'react';
import styles from './StationMarker.module.scss';

export interface Station {
  name: string
  schedule: string
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
            <p>{station.schedule}</p>
            <p className={styles.description}>
              {station.content}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
