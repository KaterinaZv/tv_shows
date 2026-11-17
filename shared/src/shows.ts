// Show data from TVmaze, flattened to what the client needs
export type ShowData = {
  id: number;
  url: string;
  name: string;
  language: string | null;
  genres: string[];
  status: string;
  premiered: string | null;
  ended: string | null;
  rating: number | null;
  channel: string | null;
  imageUrl: string | null;
  // Plain text without HTML tags
  summary: string | null;
};

// Show as the API returns it: data plus the state for the current client
export type Show = ShowData & {
  isFavorite: boolean;
};

// GET /api/shows?q=murder&genres=Comedy,Drama&page=2
export type ShowsPageQuery = {
  q: string;
  // Comma-separated genres, OR logic; empty means no filter
  genres?: string;
  page?: number;
};

export type ShowsPageResponse = {
  items: Show[];
  // All genres of the search result, regardless of the selected filter
  genres: string[];
  // Shows found by the query before the genre filter
  total: number;
  // Shows left after the genre filter
  filteredTotal: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiErrorResponse = {
  message: string;
};
