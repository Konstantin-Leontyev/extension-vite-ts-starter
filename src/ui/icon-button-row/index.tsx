/**
 * Файл: `src/ui/icon-button-row/index.tsx`
 * Предоставляет компонент IconButtonRow для отображения ряда иконочных кнопок-действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - ряд действий через проп `actions`. Пустой ряд не рендерит компонент
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconButtonRow
 * 2. Типизировать пропсы через `IconButtonRowProps`
 * 3. Экспортировать тип `IconButtonRowAction`
 *
 * Потребители:
 *  - `@ui/card` — рендерит ряд действий шапки
 *  - `@ui/sidebar` — типизирует действия шапки через `IconButtonRowAction`
 *  - `@ui/toolbar` — рендерит ряд действий панели инструментов
 */

import { type ComponentPropsWithRef, type MouseEvent, type ReactNode } from 'react';

import { Icon, type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';

import {
  StyledIconButtonRow,
  type IconButtonRowStyleProps,
} from './icon-button-row.styles';

/**
 * IconButtonRowAction — представляет одно действие ряда иконочных кнопок.
 *
 * @property ariaControls — id элемента, которым управляет кнопка
 * @property ariaExpanded — раскрытое состояние управляемого элемента
 * @property ariaLabel — доступное имя кнопки. Без имени кнопка скрыта от вспомогательных технологий
 * @property disabled — включает недоступное состояние
 * @property icon — svg-глиф действия
 * @property iconPadding — отступ окна Icon
 * @property onClick — обработчик клика по действию
 */
type IconButtonRowAction = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  icon: ReactNode;
  iconPadding?: SpacingValue;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

/**
 * DEFAULT_ICON_BUTTON_ROW_SHAPE — задаёт форму окна действия по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_ICON_BUTTON_ROW_SHAPE: IconShapePreset = 'round';

/**
 * IconButtonRowProps — представляет пропсы компонента IconButtonRow.
 *
 * @property actions — ряд действий
 * @property shape — форма окна действия
 * @property sizePreset — размер окна действия
 */
type IconButtonRowProps = {
  actions: IconButtonRowAction[];
  shape?: IconShapePreset;
  sizePreset?: IconSizePreset;
} & IconButtonRowStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'className' | 'style' | keyof IconButtonRowStyleProps
  >;

/**
 * handleActionClick — останавливает всплытие клика и вызывает обработчик действия.
 *
 * @param action действие ряда
 * @param event событие клика по кнопке
 */
function handleActionClick(
  action: IconButtonRowAction,
  event: MouseEvent<HTMLButtonElement>
) {
  event.stopPropagation();
  action.onClick?.(event);
}

/**
 * IconButtonRow — отображает ряд иконочных кнопок-действий.
 *
 * @example
 * <IconButtonRow
 *   actions={[{ ariaLabel: 'Close', icon: <CloseIcon />, onClick: handleClose }]}
 *   position="absolute"
 *   insetBlockStart={16}
 *   insetInlineEnd={16}
 * />
 */
function IconButtonRow({
  actions,
  shape = DEFAULT_ICON_BUTTON_ROW_SHAPE,
  sizePreset,
  ...rest
}: IconButtonRowProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <StyledIconButtonRow {...rest}>
      {actions.map((action, index) => (
        <Icon
          aria-controls={action.ariaControls}
          aria-expanded={action.ariaExpanded}
          aria-hidden={action.ariaLabel ? undefined : true}
          aria-label={action.ariaLabel}
          as="button"
          disabled={action.disabled}
          key={index}
          padding={action.iconPadding}
          shape={shape}
          sizePreset={sizePreset}
          tabIndex={action.ariaLabel ? undefined : -1}
          onClick={(event) => handleActionClick(action, event)}
        >
          {action.icon}
        </Icon>
      ))}
    </StyledIconButtonRow>
  );
}

export { IconButtonRow, type IconButtonRowAction };
