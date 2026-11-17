import { tvmaze } from '../dal/tvmaze';
import { TVMAZE_CACHE_TTL_MS } from '../shared/constants';
import { tvmazeCacheStore } from '../stores/tvmazeCacheStore';

const toCacheKey = (path: string, params: Record<string, string>) =>
  [path, ...Object.entries(params).map(([key, value]) => `${key}=${value.toLowerCase()}`)].join('|');

// Any TVmaze request: the same request within the TTL is served from the in-memory cache
export const fetchTvmaze = async <T>(path: string, params: Record<string, string> = {}): Promise<T> => {
  const key = toCacheKey(path, params);
  const cached = tvmazeCacheStore.get(key);

  if (cached && cached.expiresAt > Date.now()) {
    console.info(`[cache] hit ${key}`);

    return cached.data as T;
  }

  console.info(`[cache] miss ${key} → TVmaze`);

  const data = await tvmaze.get<T>(path, { params });

  tvmazeCacheStore.set(key, { data, expiresAt: Date.now() + TVMAZE_CACHE_TTL_MS });

  return data;
};
