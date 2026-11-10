export type SearchStatusType = 'idle' | 'empty' | 'error' | 'offline';

export type Props = {
  status: SearchStatusType;
  query: string;
  error: Error | null;
  onRetry: () => void;
};
