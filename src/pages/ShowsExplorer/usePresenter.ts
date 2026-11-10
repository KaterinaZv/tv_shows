import { PAGE_SIZE } from '@/shared/constants/pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import { useSearchQuery } from '@/shared/hooks/useSearchQuery';

import { EMPTY_RESULTS, SEARCH_DEBOUNCE_MS } from './constants';
import styles from './ShowsExplorer.module.css';
import { useGenreFilter } from './useGenreFilter';
import { useSearchShows } from './useSearchShows';
import { getSearchStatus } from './utils';

export const usePresenter = () => {
  const { query, searchQuery, isTyping, setQuery } = useSearchQuery(SEARCH_DEBOUNCE_MS);
  const { data, error, isPending, isFetching, isError, isPlaceholderData, fetchStatus, refetch } =
    useSearchShows(searchQuery);

  const shows = (data ?? EMPTY_RESULTS).map((result) => result.show);
  // Genres belong to a specific query: a new query starts with all genres
  const { genres, selectedGenres, filteredShows, toggleGenre, resetGenres } = useGenreFilter({
    shows,
    resetKey: searchQuery,
  });
  const { pageItems, currentPage, totalPages, hasPagination, setPage } = usePagination({
    items: filteredShows,
    pageSize: PAGE_SIZE,
    resetKey: JSON.stringify([searchQuery, selectedGenres]),
  });

  const isIdle = searchQuery.length === 0;
  // React Query pauses requests while the browser is offline and resumes them automatically
  const isOffline = !isIdle && fetchStatus === 'paused';
  // Empty previous results are not shown as "nothing found" while the new query is loading
  const isInitialLoading = !isIdle && !isOffline && (isPending || (isPlaceholderData && shows.length === 0));
  const hasResults = !isIdle && !isOffline && !isInitialLoading && shows.length > 0;
  const isErrorState = !isIdle && isError && !hasResults;
  const isEmpty = !isIdle && !isOffline && !isInitialLoading && !isErrorState && shows.length === 0;
  const status = getSearchStatus({ isIdle, isOffline, isError: isErrorState, isEmpty });

  return {
    query,
    searchQuery,
    error,
    status,
    genres,
    selectedGenres,
    totalCount: shows.length,
    filteredCount: filteredShows.length,
    pageShows: pageItems,
    currentPage,
    totalPages,
    isInitialLoading,
    hasResults,
    isUpdating: isPlaceholderData,
    hasPagination,
    isSearching: isTyping || isFetching,
    resultsClassName: isPlaceholderData ? `${styles.results} ${styles.stale}` : styles.results,
    handleQueryChange: setQuery,
    handleGenreToggle: toggleGenre,
    handleGenresReset: resetGenres,
    handlePageChange: setPage,
    handleRetry: () => void refetch(),
  };
};
