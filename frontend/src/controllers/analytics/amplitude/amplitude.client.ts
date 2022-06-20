import amplitude, { Callback } from 'amplitude-js';
import { amplitudeEvents } from '@/controllers/analytics/amplitude/amplitude.events';

const initInstance = () => {
  amplitude.getInstance().init(
    process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string,
    '',
    {
      includeFbclid: true,
      includeGclid: true,
      includeReferrer: true,
      includeUtm: true,
    },
  );
};

const logEvent = (
  type: string,
  data: { [key: string]: any } = {},
  callback?: Callback,
) => {
  try {
    amplitude.getInstance().logEvent(type, data, callback);
  } catch (error) {
    // empty
  }
};

export const amplitudeClient = {
  events: amplitudeEvents,
  initInstance,
  logEvent,
};
