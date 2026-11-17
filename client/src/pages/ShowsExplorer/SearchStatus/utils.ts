import type { TFunction } from 'i18next';

import { isRateLimitError, isTimeoutError } from '@/api/utils';

export const getErrorText = (error: Error | null, t: TFunction) => {
  if (isRateLimitError(error)) return t('status.rateLimitText');
  if (isTimeoutError(error)) return t('status.timeoutText');

  return t('status.errorText');
};
