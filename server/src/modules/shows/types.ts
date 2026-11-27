export type ShowsPageParams = {
  // null for a guest: every show comes back with isFavorite = false
  userEmail: string | null;
  query: string;
  genres: string[];
  page: number;
};

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
};
