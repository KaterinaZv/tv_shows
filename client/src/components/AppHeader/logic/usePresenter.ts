import { useCurrentUser } from '@/shared/hooks/useCurrentUser';

// Favorites are personal: a guest does not get the button at all
export const usePresenter = () => {
  const { isAuthenticated } = useCurrentUser();

  return { hasFavorites: isAuthenticated };
};
