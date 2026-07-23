/**
 * Файл: `src/ui/icon/index.tsx`
 * Предоставляет компонент Icon для отображения окна иконки.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - тон заливки окна через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - канал состояний родителя через проп `interactive`
 *  - svg через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Icon
 * 2. Типизировать пропсы через `IconProps`
 * 3. Реэкспортировать публичное API оси иконки: `IconPosition`, `IconSizePreset`,
 *    `DEFAULT_ICON_POSITION`, `ICON_POSITION_KEYS` и `ICON_SETTING_PROP_NAMES`
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Button, Listbox и Stepper —
 *    кладут Icon внутрь своего узла-места: секция триггера, кнопка-половинка
 *  - RoundButton — рендерит Icon сам и дриллит свой размерный ряд с `huge`
 *  - контролы с секцией иконки, например Button и RangeInput — читают позицию
 *    и дефолт через `@ui/icon`
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  StyledIcon,
  type IconPosition,
  type IconSizePreset,
  type IconStyleProps,
} from './icon.styles';

/**
 * IconProps — представляет пропсы компонента Icon.
 */
type IconProps = IconStyleProps &
  Omit<ComponentPropsWithRef<'span'>, 'className' | 'style' | keyof IconStyleProps>;

/**
 * Icon — отображает окно иконки.
 *
 * @example
 * <Icon sizePreset="medium">
 *   <CalendarIcon />
 * </Icon>
 * <Icon iconTone="primary" interactive sizePreset={sizePreset}>
 *   <ChevronDownIcon />
 * </Icon>
 */
export function Icon(props: IconProps) {
  return createElement(StyledIcon, props);
}

export {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  type IconPosition,
  type IconSizePreset,
};
