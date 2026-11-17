export type ShowsPageParams = {
  query: string;
  genres: string[];
  page: number;
};

export type GenreState = {
  resetKey: string;
  genres: string[];
};

export type SearchStatusFlags = {
  isIdle: boolean;
  isOffline: boolean;
  isError: boolean;
  isEmpty: boolean;
};
