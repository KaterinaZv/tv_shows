export type InputVariant = 'default' | 'bare';

export type Props = {
  value: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  onKeyDown?: (key: string) => void;
  placeholder?: string;
  type?: 'text' | 'search' | 'email';
  // Browser autofill hint, e.g. 'email'; off by default
  autoComplete?: string;
  variant?: InputVariant;
};
