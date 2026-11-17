import { useTranslation } from 'react-i18next';

import type { Props } from '../types';
import { formatYears } from '../utils';

export const usePresenter = ({ show }: Props) => {
  const { t } = useTranslation();

  return {
    title: show.name,
    posterUrl: show.imageUrl,
    posterAlt: t('show.posterAlt', { title: show.name }),
    posterPlaceholder: show.name.slice(0, 1).toUpperCase(),
    rating: show.rating ? `★ ${show.rating.toFixed(1)}` : null,
    meta: [formatYears(show, t), show.channel, show.language].filter(Boolean).join(' · '),
    genres: show.genres,
    summary: show.summary || t('show.noSummary'),
    tvmazeUrl: show.url,
    linkLabel: t('show.openOnTvmaze'),
  };
};
