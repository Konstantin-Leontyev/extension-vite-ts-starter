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
 * 3. Выставлять `role="toolbar"` и `aria-label` из пропа `ariaLabel` и включать
 *    roving focus у ряда действий
 *
 * Потребители:
 *  - страницы и виджеты приложения — показывают панель инструментов с рядом действий
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { type IconShapePreset } from '@ui/icon';
import { IconButtonRow, type IconButtonRowAction } from '@ui/icon-button-row';
import { DEFAULT_SHAPE_PRESET, type ShapePreset } from '@ui/presets';

import { StyledToolbar, type ToolbarStyleProps } from './toolbar.styles';

/**
 * ToolbarProps — представляет пропсы компонента Toolbar.
 *
 * @property actions — ряд действий
 * @property ariaLabel — доступное имя для скринридера
 */
type ToolbarProps = {
  actions: IconButtonRowAction[];
  ariaLabel: string;
} & ToolbarStyleProps &
  Omit<
    ComponentPropsWithRef<'div'>,
    'aria-label' | 'className' | 'role' | 'style' | keyof ToolbarStyleProps
  >;

/**
 * resolveToolbarActionShape — принимает форму панели и возвращает форму окна действия ряда.
 *
 * @param shape форма панели
 * @returns форма окна действия для `IconButtonRow`
 */
function resolveToolbarActionShape(
  shape: ShapePreset = DEFAULT_SHAPE_PRESET
): IconShapePreset {
  return shape === 'pill' ? 'round' : 'rounded';
}

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
    <StyledToolbar
      aria-label={ariaLabel}
      role="toolbar"
      shape={shape}
      sizePreset={sizePreset}
      {...rest}
    >
      <IconButtonRow
        actions={actions}
        rovingFocus
        shape={resolveToolbarActionShape(shape)}
        sizePreset={sizePreset}
      />
    </StyledToolbar>
  );
}

export { Toolbar };
