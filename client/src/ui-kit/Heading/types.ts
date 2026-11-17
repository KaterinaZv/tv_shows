import type { ReactNode } from 'react';

export type HeadingLevel = 1 | 2 | 3;

export type Props = {
  children: ReactNode;
  level: HeadingLevel;
  className?: string;
};
