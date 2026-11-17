import type { Show } from '@tv-shows/shared/shows';
import type { TFunction } from 'i18next';

const getYear = (date: string | null) => date?.slice(0, 4) ?? null;

export const formatYears = ({ premiered, ended, status }: Show, t: TFunction) => {
  const startYear = getYear(premiered);
  const endYear = getYear(ended);

  if (!startYear) return t('show.unknownDate');
  if (status === 'Running') return `${startYear} — ${t('show.present')}`;
  if (endYear && endYear !== startYear) return `${startYear} — ${endYear}`;

  return startYear;
};
