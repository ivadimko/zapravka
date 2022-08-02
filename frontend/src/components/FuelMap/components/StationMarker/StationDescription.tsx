import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';
import {
  StationProvider,
  useStationQuery,
} from '@/controllers/graphql/generated';

interface Props extends DetailedHTMLProps<
HTMLAttributes<HTMLParagraphElement>,
HTMLParagraphElement
> {
  id: string;
  provider: StationProvider;
}

export const StationDescription: FC<Props> = (props) => {
  const { id, provider, ...rest } = props;

  const { data, loading } = useStationQuery({
    variables: {
      provider,
      id,
    },
  });

  return (
    <p
      {...rest}
      dangerouslySetInnerHTML={{
        __html: loading
          ? 'Завантаження...'
          : data?.station?.workDescription ?? 'Немає даних :\'(',
      }}
    />
  );
};
