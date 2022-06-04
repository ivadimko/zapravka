import { InfoWindow, Marker } from '@react-google-maps/api';
import { FC, useMemo, useState } from 'react';
import cn from 'classnames';
import {
  StationStatus,
} from '@/controllers/station/station.typedefs';
import { DirectionLink } from '@/components/FuelMap/components/DirectionLink';
import {
  GasStationDescriptionType,
  StationFragment,
} from '@/controllers/graphql/generated';
import {
  makeExternalUtm,
} from '@/controllers/analytics/analytics.utils/makeExternalUtm';
import styles from './StationMarker.module.scss';

interface Props {
  station: StationFragment
  opened: boolean
  open: () => void
  close: () => void
  updatedAt: string
}
export const StationMarker: FC<Props> = (props) => {
  const {
    station, opened, open, close, updatedAt,
  } = props;

  const [
    markerInstance,
    setMarkerInstance,
  ] = useState<google.maps.MVCObject | null>(null);

  const stationStatus = useMemo(() => {
    if (!station.schedule) {
      return StationStatus.Unknown;
    }

    const currentDate = new Date();

    const [startH, startM] = station.schedule.opensAt.split(':');
    const [endH, endM] = station.schedule.closesAt.split(':');

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
      return StationStatus.Opened;
    }

    return StationStatus.Closed;
  }, [station.schedule]);

  return (
    <>
      <Marker
        onLoad={(marker) => {
          setMarkerInstance(marker);
        }}
        key={station.id}
        position={station.coordinates}
        options={{
          opacity: stationStatus === StationStatus.Closed ? 0.5 : 1,
        }}
        onClick={open}
        icon={station.icon}
      />

      {opened && markerInstance && (
        // @ts-ignore
        <InfoWindow
          onCloseClick={close}
          anchor={markerInstance}
        >
          <div>
            <p className={styles.title}>{station.name}</p>
            {station.scheduleString && (
              <p>{station.scheduleString}</p>
            )}

            <DirectionLink coordinates={station.coordinates} />

            <p
              className={cn(
                styles.description,
                {
                  [styles.preLine]: station.descriptionType
                    === GasStationDescriptionType.Raw,
                },
              )}
              dangerouslySetInnerHTML={{
                __html: station.workDescription,
              }}
            />

            <div className={styles.footer}>
              <p className={styles.footerItem}>
                За даними
                {' '}
                <a
                  className={styles.link}
                  href={makeExternalUtm(station.reference.link)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {station.reference.title}
                </a>
              </p>
              <p className={styles.footerItem}>
                {`Оновлено: ${updatedAt}`}
              </p>
            </div>

          </div>
        </InfoWindow>
      )}
    </>
  );
};
