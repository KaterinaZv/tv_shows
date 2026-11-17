import type { ReactNode } from 'react';

export type Props = {
  isOpen: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};
