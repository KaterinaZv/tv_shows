import type { ReactNode } from 'react';

export type Props = {
  children: ReactNode;
  href: string;
  isExternal?: boolean;
  className?: string;
};
