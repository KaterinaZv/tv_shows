import { useState } from 'react';

import type { PaginationState } from '../types/pagination';

// Keeps the requested page; any change of resetKey returns it to the first page. Slicing happens on the backend
export const usePagination = (resetKey: string) => {
  const [state, setState] = useState<PaginationState>({ resetKey, page: 1 });

  // Reset the stored page itself (not just hide it), so returning to a previous key does not restore an old page
  if (state.resetKey !== resetKey) {
    setState({ resetKey, page: 1 });
  }

  return {
    page: state.resetKey === resetKey ? state.page : 1,
    setPage: (page: number) => setState({ resetKey, page }),
  };
};
