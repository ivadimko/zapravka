import {
  EXTERNAL_LINK_REFERRAL_UTM,
} from '@/controllers/analytics/analytics.constants';

export const makeExternalUtm = (link?: string | null) => {
  const location = link ?? '';

  const sign = location.includes('?') ? '&' : '?';

  return `${link}${sign}${EXTERNAL_LINK_REFERRAL_UTM}`;
};
