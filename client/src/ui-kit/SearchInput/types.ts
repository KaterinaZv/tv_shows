export type Props = {
  value: string;
  placeholder: string;
  ariaLabel: string;
  clearLabel: string;
  loadingLabel: string;
  isLoading: boolean;
  onChange: (value: string) => void;
};
