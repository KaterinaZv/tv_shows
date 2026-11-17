import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import styles from './Drawer.module.css';
import { usePresenter } from './logic/usePresenter';
import type { Props } from './types';

export const Drawer = (props: Props) => {
  const { dialogRef, isOpen, title, closeLabel, children, handleCancel, handleBackdropClick, handleClose } =
    usePresenter(props);

  return (
    <dialog ref={dialogRef} className={styles.drawer} onCancel={handleCancel} onClick={handleBackdropClick}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <Heading level={2}>{title}</Heading>
          <Button variant="ghost" ariaLabel={closeLabel} onClick={handleClose}>
            ✕
          </Button>
        </div>
        {isOpen ? <div className={styles.content}>{children}</div> : null}
      </div>
    </dialog>
  );
};
