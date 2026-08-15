/**
 * Файл: `src/pages/showcase/icon-row-group/icon-row-group.ts`
 * Содержит тип действия ряда и сборщик действия для превью витрины дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Основные задачи:
 * 1. Типизировать действие витрины через `IconRowGroupAction`
 * 2. Собрать действие ряда из состояния витрины через `resolveIconButtonRowAction`
 *
 * Потребители:
 *  - `src/pages/showcase/icon-row-group/index.tsx` — типизирует пропсы и реэкспортирует
 *    `IconRowGroupAction`
 *  - `src/pages/showcase/index.tsx` — собирает действия превью Card и Toolbar
 *    через `resolveIconButtonRowAction`
 */

import { type IconButtonRowAction } from '@ui/icon-button-row';
import { type SpacingValue } from '@ui/spacing';

import { getIcon, type IconKey } from '../showcase-icon-options';

/**
 * IconRowGroupAction — представляет одно действие ряда в состоянии витрины.
 *
 * @property disabled — включает недоступное состояние
 * @property iconKey — ключ глифа из витринного набора
 * @property iconPadding — отступ окна Icon
 */
export type IconRowGroupAction = {
  disabled: boolean;
  iconKey: IconKey;
  iconPadding: SpacingValue;
};

/**
 * resolveIconButtonRowAction — преобразует действие витрины в действие ряда.
 *
 * @param action действие в состоянии витрины
 * @returns действие для превью Card и Toolbar
 */
export function resolveIconButtonRowAction(
  action: IconRowGroupAction
): IconButtonRowAction {
  return {
    ariaLabel: action.iconKey,
    disabled: action.disabled,
    icon: getIcon(action.iconKey),
    iconPadding: action.iconPadding,
    onClick: () => undefined,
  };
}
