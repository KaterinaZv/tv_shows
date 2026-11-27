import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@tv-shows/shared/auth';

import { CURRENT_USER_QUERY_KEY, FAVORITES_QUERY_KEY, SHOWS_QUERY_KEY } from '@/shared/constants/queryKeys';

import { login } from './tasks/login';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      // The response has the user: put it into the cache instead of refetching /me
      queryClient.setQueryData<User | null>(CURRENT_USER_QUERY_KEY, user);
      // The response has no favorites: personal data of the previous visitor is dropped and loaded anew
      queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SHOWS_QUERY_KEY });
    },
  });
};
