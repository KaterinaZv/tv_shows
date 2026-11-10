export type PaginationParams<T> = {
  items: T[];
  pageSize: number;
  // Any change of the key returns pagination to the first page
  resetKey: string;
};

export type PaginationState = {
  resetKey: string;
  page: number;
};
