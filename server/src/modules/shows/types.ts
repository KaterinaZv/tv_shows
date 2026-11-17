export type ShowsPageParams = {
  clientId: string;
  query: string;
  genres: string[];
  page: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
};
