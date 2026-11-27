import type { ReactNode } from 'react';

export type TextVariant = 'body' | 'muted' | 'caption';

export type Props = {
  children: ReactNode;
  as?: 'p' | 'span';
  variant?: TextVariant;
  className?: string;
  // 'alert' makes screen readers announce the text as soon as it appears (e.g. a form error)
  role?: 'alert';
};
