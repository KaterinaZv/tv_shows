import type { ReactNode } from 'react';

export type BadgeVariant = 'accent' | 'rating';

export type Props = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};
