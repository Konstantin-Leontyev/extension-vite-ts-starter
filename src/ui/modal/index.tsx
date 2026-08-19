/**
 * Файл: `src/ui/modal/index.tsx`
 * Предоставляет компонент Modal для отображения модального диалога.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - заливку через проп `background`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - рамку действий через проп `showActionBorder`
 *  - тень действий через проп `showActionShadow`
 *  - заголовок через проп `title`
 *  - уровень заголовка через проп `titleLevel`
 *  - подзаголовок через проп `subtitle`
 *  - тон заголовка через проп `titleTone`
 *  - размер заголовка через проп `titleSize`
 *  - курсив заголовка через проп `titleItalic`
 *  - выравнивание заголовка через проп `titleAlign`
 *  - тон подзаголовка через проп `subtitleTone`
 *  - размер подзаголовка через проп `subtitleSize`
 *  - курсив подзаголовка через проп `subtitleItalic`
 *  - выравнивание подзаголовка через проп `subtitleAlign`
 *  - id заголовка для `aria-labelledby` через проп `titleId`
 *  - доступное имя без заголовка через проп `ariaLabel`
 *  - тело через `children`
 *  - видимость через проп `open`
 *  - закрытие через проп `onClose`
 *  - начальный фокус после открытия через проп `initialFocusRef`
 *  - доступное имя кнопки закрытия через проп `closeAriaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Modal
 * 2. Типизировать пропсы через `ModalProps` и `ModalAccessibleName`
 * 3. Связывать заголовок и диалог через `aria-labelledby`; без заголовка —
 *    `aria-label` на диалоге
 * 4. Ставить фокус при открытии на узел `initialFocusRef` после `showModal`;
 *    без пропа — на сам `<dialog>`. Панель открывают ради содержимого,
 *    Close остаётся доступной по Tab и Esc
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';

import { CloseIcon } from '@icons';
import {
  resolveBorderProps,
  type ShowActionBorderProps,
  type ShowBorderProps,
} from '@ui/border';
import { Card } from '@ui/card';
import { type SpacingValue } from '@ui/spacing';
import { type TextNodeProps } from '@ui/text';
import { type DistributiveOmit } from '@ui/type-utils';

import { StyledModalDialog } from './modal.styles';

/**
 * DEFAULT_MODAL_CLOSE_ARIA_LABEL — задаёт доступное имя кнопки закрытия по умолчанию.
 * Используется, когда вызывающий код не передал проп `closeAriaLabel`.
 */
const DEFAULT_MODAL_CLOSE_ARIA_LABEL = 'Close';

/**
 * MODAL_CLOSE_ICON_PADDING — задаёт отступ окна Icon у кнопки закрытия.
 * Уменьшает глиф close при неизменной области клика Icon.
 */
const MODAL_CLOSE_ICON_PADDING: SpacingValue = 8;

/**
 * DEFAULT_MODAL_SHOW_BORDER — задаёт показ рамки Card внутри Modal по умолчанию.
 * Рамка выключена: на затемнении страницы контур панели даёт заливка Card,
 * а не обводка `0 0 0 1px`. Светлая рамка на тёмном `overlay` читается плохо.
 */
const DEFAULT_MODAL_SHOW_BORDER = false;

/**
 * ModalAccessibleName — представляет обязательное доступное имя диалога.
 * Требует один из пропов: `title` или `ariaLabel`.
 *
 * @property ariaLabel — текстовая метка диалога без видимого заголовка
 * @property title — видимый заголовок
 */
type ModalAccessibleName =
  | (Extract<TextNodeProps<'title'>, { title: string }> & { ariaLabel?: never })
  | (Extract<TextNodeProps<'title'>, { title?: never }> & { ariaLabel: string });

/**
 * ModalProps — представляет пропсы компонента Modal.
 *
 * @property children — содержимое тела модального окна
 * @property closeAriaLabel — доступное имя кнопки закрытия
 * @property initialFocusRef — узел начального фокуса после открытия
 * @property onClose — обработчик закрытия модального окна
 * @property open — включает видимость модального окна
 */
type ModalProps = DistributiveOmit<
  ComponentProps<typeof Card>,
  | 'aria-label'
  | 'aria-labelledby'
  | 'children'
  | 'headerActions'
  | keyof ShowActionBorderProps
  | keyof ShowBorderProps
> &
  ModalAccessibleName &
  ShowActionBorderProps &
  ShowBorderProps & {
    children: ReactNode;
    closeAriaLabel?: string;
    initialFocusRef?: RefObject<HTMLElement | null>;
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
  ariaLabel,
  children,
  closeAriaLabel = DEFAULT_MODAL_CLOSE_ARIA_LABEL,
  initialFocusRef,
  onClose,
  open,
  ...cardForward
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fallbackTitleId = useId();
  const cardProps = cardForward as DistributiveOmit<
    ComponentProps<typeof Card>,
    'children' | 'headerActions'
  >;
  const titleId = cardProps.title ? (cardProps.titleId ?? fallbackTitleId) : undefined;
  const cardBorderProps = resolveBorderProps(
    cardProps.showBorder ?? DEFAULT_MODAL_SHOW_BORDER,
    cardProps.borderTone,
    cardProps.showShadow
  );

  /**
   * Синхронизирует видимость с пропом `open` через `showModal` и `close`.
   * Задаёт `closedby="any"`, чтобы закрытие работало по Escape и клику по backdrop.
   * После открытия ставит фокус на узел `initialFocusRef`, без ссылки — на сам
   * диалог. Атрибут `autofocus` на диалоге для этого непригоден: при наличии
   * внутри интерактивных узлов Chrome его игнорирует и уводит фокус на Close.
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

      const initialFocusNode = initialFocusRef?.current ?? dialog;

      initialFocusNode.focus();

      return;
    }

    if (dialog.open) {
      dialog.close();
    }
  }, [initialFocusRef, open]);

  /**
   * handleCloseClick — закрывает диалог через `close` на узле `<dialog>`.
   */
  function handleCloseClick(): void {
    dialogRef.current?.close();
  }

  const headerActions = [
    {
      ariaLabel: closeAriaLabel,
      icon: <CloseIcon />,
      iconPadding: MODAL_CLOSE_ICON_PADDING,
      onClick: handleCloseClick,
    },
  ];

  return (
    <StyledModalDialog
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      ref={dialogRef}
      // Остановкой обхода диалог не становится: `-1` открывает только
      // программный фокус, которым эффект открытия ставит начальный фокус.
      tabIndex={-1}
      onClose={onClose}
    >
      <Card
        headerActions={headerActions}
        {...cardProps}
        {...cardBorderProps}
        titleId={titleId}
      >
        {children}
      </Card>
    </StyledModalDialog>
  );
}

export { Modal, type ModalAccessibleName };
