/**
 * Файл: `src/ui/toolbar/index.tsx`
 * Предоставляет компонент Toolbar для отображения панели инструментов с рядом
 * иконочных действий.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - заливку через проп `background`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - ряд действий через проп `actions`
 *  - доступное имя для скринридера через проп `ariaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Toolbar
 * 2. Типизировать пропсы через `ToolbarProps`
 * 3. Выставлять `role="toolbar"` и `aria-label` из пропа `ariaLabel`
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают панель инструментов с рядом действий
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { type IconShapePreset, type IconSizePreset } from '@ui/icon';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';

import { StyledToolbar, type ToolbarStyleProps } from './toolbar.styles';

/**
 * ToolbarProps — представляет пропсы компонента Toolbar.
 *
 * @property actions — ряд действий
 * @property ariaLabel — доступное имя для скринридера
 * @property shape — форма окна действия
 * @property sizePreset — размер окна действия
 */
type ToolbarProps = {
  actions: IconButtonRowAction[];
  ariaLabel: string;
  shape?: IconShapePreset;
  sizePreset?: IconSizePreset;
} & ToolbarStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'aria-label' | 'className' | 'role' | 'style' | keyof ToolbarStyleProps
  >;

/**
 * Toolbar — отображает панель инструментов с рядом иконочных действий.
 *
 * @example
 * <Toolbar
 *   actions={[{ ariaLabel: 'Search', icon: <SearchIcon />, onClick: handleSearch }]}
 *   ariaLabel="Toolbar"
 * />
 */
function Toolbar({ actions, ariaLabel, shape, sizePreset, ...rest }: ToolbarProps) {
  return (
    <StyledToolbar aria-label={ariaLabel} role="toolbar" {...rest}>
      <IconButtonRow actions={actions} shape={shape} sizePreset={sizePreset} />
    </StyledToolbar>
  );
}

export { Toolbar };
