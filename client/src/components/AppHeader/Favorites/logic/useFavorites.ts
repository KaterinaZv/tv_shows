import { useQuery } from '@tanstack/react-query';

import { FAVORITES_QUERY_KEY } from '@/shared/constants/queryKeys';

import { fetchFavorites } from './tasks/fetchFavorites';

export const useFavorites = () =>
  useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: ({ signal }) => fetchFavorites(signal),
  });
