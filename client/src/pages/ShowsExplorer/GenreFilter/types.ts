export type Props = {
  genres: string[];
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  onReset: () => void;
};
