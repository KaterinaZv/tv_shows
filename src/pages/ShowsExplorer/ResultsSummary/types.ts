export type Props = {
  query: string;
  total: number;
  filtered: number;
  genres: string[];
  // Previous results are shown while the new query is loading
  isUpdating: boolean;
};
