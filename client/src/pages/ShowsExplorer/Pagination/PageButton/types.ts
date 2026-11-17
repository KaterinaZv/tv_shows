export type Props = {
  number: number;
  ariaLabel: string;
  isCurrent: boolean;
  onSelect: (page: number) => void;
};
