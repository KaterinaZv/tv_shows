import { useQuery } from '@tanstack/react-query';

import { CURRENT_USER_QUERY_KEY } from '@/shared/constants/queryKeys';
import { fetchCurrentUser } from '@/tasks/fetchCurrentUser';

// The current user is server data, so it lives in the React Query cache, not in a store.
// Login and logout write the new value into the cache themselves, so it never goes stale on its own
export const useCurrentUser = () => {
  const { data, isPending } = useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: ({ signal }) => fetchCurrentUser(signal),
    staleTime: Infinity,
  });

  return {
    user: data ?? null,
    isAuthenticated: Boolean(data),
    isPending,
  };
};
