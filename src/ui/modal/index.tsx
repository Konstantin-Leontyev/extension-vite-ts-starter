import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';

import { CloseIcon } from '@icons/close';
import { Card } from '@ui/card';

import { StyledModalDialog } from './modal.styles';

/** Card-пропы панели прокидываются россыпью; своё у модалки — open/onClose. */
type CardForwardProps = Omit<
  ComponentProps<typeof Card>,
  | 'children'
  | 'icon'
  | 'iconAriaControls'
  | 'iconAriaExpanded'
  | 'iconAriaLabel'
  | 'onIconClick'
>;

type ModalProps = CardForwardProps & {
  children: ReactNode;
  closeAriaLabel?: string;
  onClose: () => void;
  open: boolean;
};

export function Modal({
  children,
  closeAriaLabel = 'Close',
  onClose,
  open,
  ...cardProps
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.setAttribute('closedby', 'any');

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }

      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <StyledModalDialog ref={dialogRef} onClose={onClose}>
      <Card
        icon={<CloseIcon />}
        iconAriaLabel={closeAriaLabel}
        onIconClick={onClose}
        {...cardProps}
      >
        {children}
      </Card>
    </StyledModalDialog>
  );
}
