import type { ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type Props = {
  children: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  isDisabled?: boolean;
  ariaLabel?: string;
  ariaCurrent?: 'page';
  // Toggle buttons (e.g. a favorite star) expose their state to screen readers
  isPressed?: boolean;
  className?: string;
};
