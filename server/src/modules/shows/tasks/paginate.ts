import type { Page } from '../types';

// Cuts one page out of the list; a page beyond the last one is clamped to the last page
export const paginate = <T>(items: T[], page: number, pageSize: number): Page<T> => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  return {
    items: items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    page: currentPage,
    totalPages,
  };
};
