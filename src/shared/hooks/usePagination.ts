import { useState } from 'react';

import type { PaginationParams, PaginationState } from '../types/pagination';

export const usePagination = <T>({ items, pageSize, resetKey }: PaginationParams<T>) => {
  const [state, setState] = useState<PaginationState>({ resetKey, page: 1 });
  const requestedPage = state.resetKey === resetKey ? state.page : 1;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);

  return {
    pageItems: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    currentPage,
    totalPages,
    hasPagination: totalPages > 1,
    setPage: (page: number) => setState({ resetKey, page }),
  };
};
