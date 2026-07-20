/**
 * Файл: `src/ui/modal/index.tsx`
 * Предоставляет компонент Modal для отображения модального диалога.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - заливку через проп `background`
 *  - заголовок через проп `title`
 *  - подзаголовок через проп `subtitle`
 *  - размер заголовка через проп `titleSizePreset`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон заголовка через проп `titleTone`
 *  - размер подзаголовка через проп `subtitleSizePreset`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - id заголовка для `aria-labelledby` через проп `titleId`
 *  - тело через `children`
 *  - видимость через проп `open`
 *  - закрытие через проп `onClose`
 *  - доступное имя кнопки закрытия через проп `closeAriaLabel`
 *  - переопределение корневого элемента Card через проп `as`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Modal
 * 2. Типизировать пропсы через `ModalProps`
 * 3. Связывать заголовок и диалог через `aria-labelledby`
 *
 * Потребители:
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { useEffect, useId, useRef, type ComponentProps, type ReactNode } from 'react';

import { CloseIcon } from '@icons/close';
import { Card } from '@ui/card';

import { StyledModalDialog } from './modal.styles';

/**
 * DEFAULT_MODAL_CLOSE_ARIA_LABEL — задаёт доступное имя кнопки закрытия по умолчанию.
 * Используется, когда вызывающий код не передал проп `closeAriaLabel`.
 */
const DEFAULT_MODAL_CLOSE_ARIA_LABEL = 'Close';

/**
 * CardForwardProps — представляет пропсы Card без `children` и `headerActions`.
 */
type CardForwardProps = Omit<ComponentProps<typeof Card>, 'children' | 'headerActions'>;

/**
 * ModalProps — представляет пропсы компонента Modal.
 *
 * @property children — содержимое тела модального окна
 * @property closeAriaLabel — доступное имя кнопки закрытия
 * @property onClose — обработчик закрытия модального окна
 * @property open — включает видимость модального окна
 */
type ModalProps = CardForwardProps & {
  children: ReactNode;
  closeAriaLabel?: string;
  onClose: () => void;
  open: boolean;
};

/**
 * Modal — отображает модальный диалог с Card и кнопкой закрытия.
 *
 * @example
 * <Modal open={isOpen} title="Confirm" onClose={() => setIsOpen(false)}>
 *   Content
 * </Modal>
 */
function Modal({
  children,
  closeAriaLabel = DEFAULT_MODAL_CLOSE_ARIA_LABEL,
  onClose,
  open,
  title,
  titleId: titleIdProp,
  ...rest
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const generatedTitleId = useId();
  const titleId = title ? (titleIdProp ?? generatedTitleId) : undefined;

  /**
   * Синхронизирует видимость с пропом `open` через `showModal` и `close`.
   * Задаёт `closedby="any"`, чтобы закрытие работало по Escape и клику по backdrop.
   */
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
    <StyledModalDialog aria-labelledby={titleId} ref={dialogRef} onClose={onClose}>
      <Card
        headerActions={[
          {
            ariaLabel: closeAriaLabel,
            icon: <CloseIcon />,
            iconPadding: 8,
            onClick: onClose,
          },
        ]}
        title={title}
        titleId={titleId}
        {...rest}
      >
        {children}
      </Card>
    </StyledModalDialog>
  );
}

export { Modal };
