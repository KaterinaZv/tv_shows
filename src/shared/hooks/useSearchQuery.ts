import { useState } from 'react';

import { useDebouncedValue } from './useDebouncedValue';

export const useSearchQuery = (debounceMs: number) => {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const debouncedQuery = useDebouncedValue(trimmedQuery, debounceMs);
  // Clearing the field resets results immediately, without waiting for debounce
  const searchQuery = trimmedQuery ? debouncedQuery : '';

  return {
    query,
    searchQuery,
    isTyping: trimmedQuery !== searchQuery,
    setQuery,
  };
};
