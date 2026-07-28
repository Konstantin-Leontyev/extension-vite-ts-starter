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
 * 3. Реэкспортировать публичное API оси иконки: `IconPosition`,
 *    `DEFAULT_ICON_POSITION`, `ICON_POSITION_KEYS`, `ICON_SETTING_PROP_NAMES`,
 *    мост `getIconPadding` и хелперы секции на родителе:
 *    `getIconSectionTrackStyles`, `getIconSectionSeamStyles`,
 *    `resolveIconStateBackground`
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Button, Listbox и Stepper —
 *    кладут Icon внутрь своего узла-места: секция триггера, кнопка-половинка
 *  - `@ui/round-button` — рендерит Icon сам и передаёт свой размерный ряд с `huge`
 *  - контролы с секцией иконки, например Button, Listbox, Combobox и RangeInput —
 *    подключают хелперы секции и читают позицию через `@ui/icon`
 *  - витрина — читает `getIconPadding` для отступа окна Icon:
 *     - `src/pages/showcase/index.tsx`
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/round-button-settings/index.tsx`
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  StyledIcon,
  getIconPadding,
  getIconSectionSeamStyles,
  getIconSectionTrackStyles,
  resolveIconStateBackground,
  type IconPosition,
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
 * <Icon sizePreset="normal">
 *   <CalendarIcon />
 * </Icon>
 * <Icon iconTone="primary" interactive sizePreset={sizePreset}>
 *   <ChevronDownIcon />
 * </Icon>
 */
export function Icon(props: IconProps) {
  return createElement(StyledIcon, props);
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста и хелперов секции */
export {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  getIconPadding,
  getIconSectionSeamStyles,
  getIconSectionTrackStyles,
  resolveIconStateBackground,
  type IconPosition,
};
