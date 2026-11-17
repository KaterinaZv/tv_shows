import type { ShowData } from '@tv-shows/shared/shows';

import type { TvmazeShow } from '../shared/types/tvmaze';
import { stripHtml } from '../shared/utils';

// TVmaze DTO → the app's show data
export const mapTvmazeShow = (show: TvmazeShow): ShowData => ({
  id: show.id,
  url: show.url,
  name: show.name,
  language: show.language,
  genres: show.genres,
  status: show.status,
  premiered: show.premiered,
  ended: show.ended,
  rating: show.rating.average,
  channel: show.network?.name ?? show.webChannel?.name ?? null,
  imageUrl: show.image?.medium ?? null,
  summary: stripHtml(show.summary),
});
