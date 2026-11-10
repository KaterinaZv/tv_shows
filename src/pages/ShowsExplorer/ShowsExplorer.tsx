import { GenreFilter } from './GenreFilter/GenreFilter';
import { Hero } from './Hero/Hero';
import { Pagination } from './Pagination/Pagination';
import { ResultsSummary } from './ResultsSummary/ResultsSummary';
import { SearchBar } from './SearchBar/SearchBar';
import { SearchStatus } from './SearchStatus/SearchStatus';
import { ShowList } from './ShowList/ShowList';
import { ShowListSkeleton } from './ShowListSkeleton/ShowListSkeleton';
import styles from './ShowsExplorer.module.css';
import { usePresenter } from './usePresenter';

export const ShowsExplorer = () => {
  const {
    query,
    searchQuery,
    error,
    status,
    genres,
    selectedGenres,
    totalCount,
    filteredCount,
    pageShows,
    currentPage,
    totalPages,
    isInitialLoading,
    hasResults,
    isUpdating,
    hasPagination,
    isSearching,
    resultsClassName,
    handleQueryChange,
    handleGenreToggle,
    handleGenresReset,
    handlePageChange,
    handleRetry,
  } = usePresenter();

  return (
    <main className={styles.page}>
      <Hero />

      <SearchBar value={query} isLoading={isSearching} onChange={handleQueryChange} />

      <section className={styles.content} aria-live="polite">
        {status ? <SearchStatus status={status} query={searchQuery} error={error} onRetry={handleRetry} /> : null}

        {isInitialLoading ? <ShowListSkeleton /> : null}

        {hasResults ? (
          <div className={resultsClassName}>
            <GenreFilter
              genres={genres}
              selectedGenres={selectedGenres}
              onGenreToggle={handleGenreToggle}
              onReset={handleGenresReset}
            />
            <ResultsSummary
              query={searchQuery}
              total={totalCount}
              filtered={filteredCount}
              genres={selectedGenres}
              isUpdating={isUpdating}
            />
            <ShowList shows={pageShows} />
            {hasPagination ? (
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
};
