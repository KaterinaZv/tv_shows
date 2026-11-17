import type { ClientFavorites } from './types';

// In-memory "table" of favorites: every browser (clientId) has its own collection. Lives as long as the process
const favorite: Record<string, ClientFavorites> = {};

export const favoritesStore = {
  get: (clientId: string): ClientFavorites => favorite[clientId] ?? {},
  set: (clientId: string, favorites: ClientFavorites) => {
    favorite[clientId] = favorites;
  },
};
