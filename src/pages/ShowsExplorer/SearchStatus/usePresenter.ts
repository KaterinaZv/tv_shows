import { useTranslation } from 'react-i18next';

import { STATUS_ICONS } from './constants';
import type { Props } from './types';
import { getErrorText } from './utils';

export const usePresenter = ({ status, query, error, onRetry }: Props) => {
  const { t } = useTranslation();

  const content = {
    idle: { title: t('status.idleTitle'), text: t('status.idleText') },
    empty: { title: t('status.emptyTitle'), text: t('status.emptyText', { query }) },
    error: {
      title: t('status.errorTitle'),
      text: getErrorText(error, t),
    },
    offline: { title: t('status.offlineTitle'), text: t('status.offlineText') },
  }[status];

  return {
    icon: STATUS_ICONS[status],
    title: content.title,
    text: content.text,
    hasRetry: status === 'error',
    retryLabel: t('common.retry'),
    handleRetry: onRetry,
  };
};
