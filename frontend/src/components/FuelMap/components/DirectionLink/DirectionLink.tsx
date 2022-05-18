import { FC } from 'react';
import {
  NavigateIcon,
} from '@/components/FuelMap/components/DirectionLink/NavigateIcon';
import styles from './DirectionLink.module.scss';

interface Props {
  coordinates: {
    lat: number
    lng: number
  }
}

export const DirectionLink: FC<Props> = (props) => {
  const { coordinates } = props;

  return (
    <a
      href={`https://www.google.com/maps/dir//${coordinates.lat},${coordinates.lng}/`}
      target="_blank"
      rel="noreferrer"
      className={styles.directionLink}
    >
      <NavigateIcon />

      <span className={styles.span}>
        Прокласти маршрут
      </span>

    </a>
  );
};
