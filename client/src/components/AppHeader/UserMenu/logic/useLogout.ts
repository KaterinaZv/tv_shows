import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '@tv-shows/shared/auth';

import { CURRENT_USER_QUERY_KEY, FAVORITES_QUERY_KEY, SHOWS_QUERY_KEY } from '@/shared/constants/queryKeys';

import { logout } from './tasks/logout';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    // The token is gone either way (see the task): the user is a guest now, even if the request failed
    onSettled: () => {
      queryClient.setQueryData<User | null>(CURRENT_USER_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: SHOWS_QUERY_KEY });
    },
  });
};
