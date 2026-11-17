import { useTranslation } from 'react-i18next';

import { showToast } from '@/tasks/showToast';

import styles from '../ShowCard.module.css';
import type { Props } from '../types';
import { formatYears } from '../utils';
import { useToggleFavorite } from './useToggleFavorite';

export const usePresenter = ({ show }: Props) => {
  const { t } = useTranslation();
  const { mutate, isPending } = useToggleFavorite();
  // Optimistic: while the request is in flight the star already shows the new state
  const isFavorite = isPending ? !show.isFavorite : show.isFavorite;
  const rating = show.rating ? `★ ${show.rating.toFixed(1)}` : null;

  return {
    title: show.name,
    posterUrl: show.imageUrl,
    posterAlt: t('show.posterAlt', { title: show.name }),
    posterPlaceholder: show.name.slice(0, 1).toUpperCase(),
    rating,
    // Leaves room for the rating badge in the top right corner of a horizontal card
    bodyClassName: rating ? `${styles.body} ${styles.bodyWithRating}` : styles.body,
    meta: [formatYears(show, t), show.channel, show.language].filter(Boolean).join(' · '),
    genres: show.genres,
    summary: show.summary || t('show.noSummary'),
    tvmazeUrl: show.url,
    linkLabel: t('show.openOnTvmaze'),
    isFavorite,
    favoriteIcon: isFavorite ? '★' : '☆',
    favoriteLabel: t(isFavorite ? 'favorites.remove' : 'favorites.add', { title: show.name }),
    favoriteClassName: isFavorite ? `${styles.favorite} ${styles.favoriteActive}` : styles.favorite,
    isFavoritePending: isPending,
    handleFavoriteClick: () =>
      mutate(
        { show },
        {
          onSuccess: (result) =>
            showToast(t(result.isFavorite ? 'favorites.added' : 'favorites.removed', { title: show.name })),
          onError: () => showToast(t('favorites.error'), 'error'),
        },
      ),
  };
};
