export type Show = {
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

export type ShowSearchResult = {
  score: number;
  show: Show;
};
