// TVmaze DTO: only the fields the app uses
export type TvmazeShow = {
  id: number;
  url: string;
  name: string;
  language: string | null;
  genres: string[];
  status: string;
  premiered: string | null;
  ended: string | null;
  rating: { average: number | null };
  network: { name: string } | null;
  webChannel: { name: string } | null;
  image: { medium: string; original: string } | null;
  summary: string | null;
};

export type TvmazeSearchResult = {
  score: number;
  show: TvmazeShow;
};

export type ShowsPageParams = {
  query: string;
  genres: string[];
  page: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
};
