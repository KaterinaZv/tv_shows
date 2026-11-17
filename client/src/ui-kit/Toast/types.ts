export type ToastVariant = 'success' | 'error';

export type Props = {
  id: number;
  message: string;
  variant: ToastVariant;
  closeLabel: string;
  onClose: (id: number) => void;
};
