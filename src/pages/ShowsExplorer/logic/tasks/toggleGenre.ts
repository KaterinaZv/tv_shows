// Adds the genre to the selection or removes it if it is already selected
export const toggleGenre = (genres: string[], genre: string) =>
  genres.includes(genre) ? genres.filter((item) => item !== genre) : [...genres, genre];
