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
  onClick: () => void
}

export const DirectionLink: FC<Props> = (props) => {
  const { coordinates, onClick } = props;

  return (
    <a
      href={`https://www.google.com/maps/dir//${coordinates.lat},${coordinates.lng}/`}
      target="_blank"
      rel="noreferrer"
      className={styles.directionLink}
      onClick={onClick}
    >
      <NavigateIcon />

      <span className={styles.span}>
        Прокласти маршрут
      </span>

    </a>
  );
};
