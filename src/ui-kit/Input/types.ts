export type InputVariant = 'default' | 'bare';

export type Props = {
  value: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  onKeyDown?: (key: string) => void;
  placeholder?: string;
  type?: 'text' | 'search';
  variant?: InputVariant;
};
