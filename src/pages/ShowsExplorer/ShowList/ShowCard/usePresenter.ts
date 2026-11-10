import { useTranslation } from 'react-i18next';

import type { Props } from './types';
import { formatYears, stripHtml } from './utils';

export const usePresenter = ({ show }: Props) => {
  const { t } = useTranslation();
  const summary = stripHtml(show.summary);
  const channel = show.network?.name ?? show.webChannel?.name;

  return {
    title: show.name,
    posterUrl: show.image?.medium ?? null,
    posterAlt: t('show.posterAlt', { title: show.name }),
    posterPlaceholder: show.name.slice(0, 1).toUpperCase(),
    rating: show.rating.average ? `★ ${show.rating.average.toFixed(1)}` : null,
    meta: [formatYears(show, t), channel, show.language].filter(Boolean).join(' · '),
    genres: show.genres,
    summary: summary || t('show.noSummary'),
    tvmazeUrl: show.url,
    linkLabel: t('show.openOnTvmaze'),
  };
};
