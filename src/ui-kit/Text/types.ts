import type { ReactNode } from 'react';

export type TextVariant = 'body' | 'muted' | 'caption';

export type Props = {
  children: ReactNode;
  as?: 'p' | 'span';
  variant?: TextVariant;
  className?: string;
};
