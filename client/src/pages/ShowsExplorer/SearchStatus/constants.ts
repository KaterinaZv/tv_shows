import type { SearchStatusType } from './types';

export const STATUS_ICONS: Record<SearchStatusType, string> = {
  idle: '🍿',
  empty: '🔍',
  error: '⚠️',
  offline: '📡',
};
