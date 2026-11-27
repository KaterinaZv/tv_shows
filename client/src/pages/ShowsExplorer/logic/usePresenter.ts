import { usePagination } from '@/shared/hooks/usePagination';
import { useSearchQuery } from '@/shared/hooks/useSearchQuery';

import { EMPTY_SHOWS, NO_GENRES, SEARCH_DEBOUNCE_MS } from '../constants';
import styles from '../ShowsExplorer.module.css';
import { getSearchStatus } from '../utils';
import { useGenreFilter } from './useGenreFilter';
import { useResetOnLogout } from './useResetOnLogout';
import { useShowsPage } from './useShowsPage';

export const usePresenter = () => {
  const { query, searchQuery, isTyping, setQuery } = useSearchQuery(SEARCH_DEBOUNCE_MS);
  // Genres belong to a specific query, the page — to a specific query and genre selection
  const { selectedGenres, toggleGenre, resetGenres } = useGenreFilter(searchQuery);
  const { page, setPage } = usePagination(JSON.stringify([searchQuery, selectedGenres]));

  // Clearing the query is enough: genres and the page are reset by it
  useResetOnLogout(() => setQuery(''));
  const { data, error, isPending, isFetching, isError, isPlaceholderData, fetchStatus, refetch } = useShowsPage({
    query: searchQuery,
    genres: selectedGenres,
    page,
  });

  const total = data?.total ?? 0;
  const isIdle = searchQuery.length === 0;
  // React Query pauses requests while the browser is offline and resumes them automatically
  const isOffline = !isIdle && fetchStatus === 'paused';
  // Empty previous results are not shown as "nothing found" while the new query is loading
  const isInitialLoading = !isIdle && !isOffline && (isPending || (isPlaceholderData && total === 0));
  const hasResults = !isIdle && !isOffline && !isInitialLoading && total > 0;
  const isErrorState = !isIdle && isError && !hasResults;
  const isEmpty = !isIdle && !isOffline && !isInitialLoading && !isErrorState && total === 0;
  const totalPages = data?.totalPages ?? 1;

  return {
    query,
    searchQuery,
    error,
    status: getSearchStatus({ isIdle, isOffline, isError: isErrorState, isEmpty }),
    genres: data?.genres ?? NO_GENRES,
    selectedGenres,
    totalCount: total,
    filteredCount: data?.filteredTotal ?? 0,
    pageShows: data?.items ?? EMPTY_SHOWS,
    currentPage: data?.page ?? page,
    totalPages,
    isInitialLoading,
    hasResults,
    isUpdating: isPlaceholderData,
    hasPagination: totalPages > 1,
    isSearching: isTyping || isFetching,
    resultsClassName: isPlaceholderData ? `${styles.results} ${styles.stale}` : styles.results,
    handleQueryChange: setQuery,
    handleGenreToggle: toggleGenre,
    handleGenresReset: resetGenres,
    handlePageChange: setPage,
    handleRetry: () => void refetch(),
  };
};
