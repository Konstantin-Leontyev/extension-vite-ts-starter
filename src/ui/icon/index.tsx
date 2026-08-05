/**
 * Файл: `src/ui/icon/index.tsx`
 * Предоставляет полиморфный компонент Icon для отображения окна иконки
 * и standalone-действия через `as="button"`.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - канал hover через проп `showHover`
 *  - тон заливки окна через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - канал состояний родителя через проп `interactive`
 *  - переопределение корневого элемента через проп `as`
 *  - svg через `children`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Icon
 * 2. Типизировать пропсы через `IconProps`
 * 3. Реэкспортировать публичное API оси иконки: `IconPosition`,
 *    `IconShapePreset`, `IconSizePreset`, `DEFAULT_ICON_POSITION`,
 *    `ICON_POSITION_KEYS`, `ICON_SHAPE_PRESET_KEYS`, `ICON_SIZE_PRESET_KEYS`,
 *    `ICON_SETTING_PROP_NAMES`, мосты `getIconPadding` и `getIconSize`,
 *    хелперы секции на родителе: `getIconPositionStyles`,
 *    `resolveIconStateBackground`
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Button, Listbox и Stepper —
 *    кладут Icon внутрь своего узла-места: секция триггера, кнопка-половинка
 *  - компоненты приложения, например Header, Card, ThemeToggle и ProfileMenu —
 *    показывают иконочные действия через `as="button"`
 *  - контролы с секцией иконки, например Button, Listbox, Combobox и RangeInput —
 *    подключают хелперы секции и читают позицию через `@ui/icon`
 *  - `src/pages/showcase` — читает `getIconPadding` и демонстрирует состояния
 *    в витрине
 */

import { createElement, type ComponentPropsWithRef, type ElementType } from 'react';

import {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  ICON_SHAPE_PRESET_KEYS,
  ICON_SIZE_PRESET_KEYS,
  StyledIcon,
  getIconPadding,
  getIconPositionStyles,
  getIconSize,
  resolveIconStateBackground,
  type IconPosition,
  type IconShapePreset,
  type IconSizePreset,
  type IconStyleProps,
} from './icon.styles';

/**
 * DEFAULT_ICON_TYPE — задаёт тип кнопки по умолчанию.
 * Используется, когда вызывающий код не передал проп `type`.
 */
const DEFAULT_ICON_TYPE = 'button';

/**
 * IconProps — представляет пропсы компонента Icon.
 *
 * @template T тип корневого элемента, по умолчанию `span`
 *
 * @property as — переопределяет корневой HTML-тег, например `<button>`
 */
type IconProps<T extends ElementType = 'span'> = {
  as?: T;
} & IconStyleProps &
  Omit<ComponentPropsWithRef<T>, 'className' | 'style' | keyof IconStyleProps>;

/**
 * Icon — отображает окно иконки. При `as="button"` — иконочное действие.
 *
 * @example
 * <Icon sizePreset="normal">
 *   <CalendarIcon />
 * </Icon>
 * <Icon as="button" aria-label="Settings" shape="round">
 *   <SettingsIcon />
 * </Icon>
 * <Icon
 *   data-slot="icon"
 *   iconTone="primary"
 *   interactive
 *   showBorder
 *   showHover={false}
 *   showShadow={false}
 *   sizePreset={sizePreset}
 * >
 *   <ChevronDownIcon />
 * </Icon>
 */
export function Icon<T extends ElementType = 'span'>(props: IconProps<T>) {
  if (props.as === 'button') {
    const { type, ...rest } = props as IconProps<'button'> & { type?: string };

    return createElement(StyledIcon, {
      ...rest,
      as: 'button',
      type: type ?? DEFAULT_ICON_TYPE,
    });
  }

  return createElement(StyledIcon, props);
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт публичных типов, пресетов, мостов и хелперов секции */
export {
  DEFAULT_ICON_POSITION,
  ICON_POSITION_KEYS,
  ICON_SETTING_PROP_NAMES,
  ICON_SHAPE_PRESET_KEYS,
  ICON_SIZE_PRESET_KEYS,
  getIconPadding,
  getIconPositionStyles,
  getIconSize,
  resolveIconStateBackground,
  type IconPosition,
  type IconShapePreset,
  type IconSizePreset,
};
