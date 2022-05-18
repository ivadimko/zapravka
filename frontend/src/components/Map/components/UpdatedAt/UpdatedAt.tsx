import { FC, useEffect, useState } from 'react';
import styles from './UpdatedAt.module.scss';

interface Props {
  updatedAt: string
}
export const UpdatedAt: FC<Props> = (props) => {
  const { updatedAt } = props;
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(true);
  }, []);

  return shouldRender
    ? (
      <p className={styles.updatedAt}>{`Дані оновлено: ${updatedAt}`}</p>
    )
    : null;
};
