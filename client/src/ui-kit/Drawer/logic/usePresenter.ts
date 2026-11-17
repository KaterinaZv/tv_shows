import type { MouseEvent, SyntheticEvent } from 'react';
import { useEffect, useRef } from 'react';

import type { Props } from '../types';

// Native <dialog> gives focus trapping, Escape to close and an inert page behind it for free
export const usePresenter = ({ isOpen, title, closeLabel, onClose, children }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return {
    dialogRef,
    // Content of a closed drawer is not rendered: no hidden cards, no image requests
    isOpen,
    title,
    closeLabel,
    children,
    handleCancel: (event: SyntheticEvent<HTMLDialogElement>) => {
      // Escape: let React state close the dialog instead of the browser
      event.preventDefault();
      onClose();
    },
    handleBackdropClick: (event: MouseEvent<HTMLDialogElement>) => {
      // A click on the dialog element itself (not its content) is a click on the backdrop
      if (event.target === event.currentTarget) onClose();
    },
    handleClose: onClose,
  };
};
