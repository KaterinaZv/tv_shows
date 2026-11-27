import type { UserFavorites } from './types';

// In-memory "table" of favorites: every user (email) has its own collection. Lives as long as the process
const favorite: Record<string, UserFavorites> = {};

export const favoritesStore = {
  get: (email: string): UserFavorites => favorite[email] ?? {},
  set: (email: string, favorites: UserFavorites) => {
    favorite[email] = favorites;
  },
};
