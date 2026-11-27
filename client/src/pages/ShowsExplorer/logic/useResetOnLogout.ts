import { useEffect, useRef } from 'react';

import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

// Calls reset when the user logs out, so the next person at a shared device does not see the previous search.
// Only the "logged in → guest" transition counts: the first session check on page load must not wipe what is typed
export const useResetOnLogout = (reset: () => void) => {
  const { isAuthenticated } = useCurrentUser();
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) reset();

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, reset]);
};
