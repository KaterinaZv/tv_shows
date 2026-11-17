import { isRateLimitError, isTimeoutError } from '@/api/utils';

import { MAX_SEARCH_RETRIES } from './constants';
import type { SearchStatusType } from './SearchStatus/types';
import type { SearchStatusFlags } from './types';

// Retrying makes no sense when the server asks to slow down or did not answer in time
export const shouldRetrySearch = (failureCount: number, error: Error) =>
  failureCount < MAX_SEARCH_RETRIES && !isRateLimitError(error) && !isTimeoutError(error);

export const getSearchStatus = ({
  isIdle,
  isOffline,
  isError,
  isEmpty,
}: SearchStatusFlags): SearchStatusType | null => {
  if (isIdle) return 'idle';
  if (isOffline) return 'offline';
  if (isError) return 'error';
  if (isEmpty) return 'empty';

  return null;
};
