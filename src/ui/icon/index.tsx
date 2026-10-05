/**
 * Файл: `src/ui/icon/index.tsx`
 * Предоставляет компонент Icon для отображения окна иконки
 * и иконочного действия через `as="button"`.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - рамку через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - канал hover через проп `showHover`
 *  - тон заливки окна через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - канал состояний родителя через проп `interactive` у окна
 *  - зафиксированное нажатое состояние через проп `active` у `as="button"`
 *  - переопределение корневого элемента через проп `as`
 *  - svg через `children`
 *
 * Основные задачи:
 * 1. Экспортировать полиморфный компонент Icon
 * 2. Типизировать пропсы через `IconProps`
 * 3. Реэкспортировать публичное API вида иконки: `IconPosition`,
 *    `IconShapePreset`, `IconSizePreset`, `DEFAULT_ICON_POSITION`,
 *    `ICON_POSITION_KEYS`, `ICON_SHAPE_PRESET_KEYS`, `ICON_SIZE_PRESET_KEYS`,
 *    `ICON_SETTING_PROP_NAMES`, мосты `getIconPadding` и `getIconSize`,
 *    хелперы секции на родителе: `getIconPositionStyles`,
 *    `resolveIconShape`, `resolveIconStateBackground`
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Button, Listbox и Stepper —
 *    кладут Icon внутрь своего узла-места: секция триггера, кнопка-половинка
 *  - компоненты приложения, например Header, Card, ThemeToggle и ProfileMenu —
 *    показывают иконочные действия через `as="button"`
 *  - контролы с секцией иконки, например Button, Listbox и RangeInput —
 *    подключают хелперы секции и читают позицию через `@ui/icon`
 *  - `@ui/toolbar` — читает `resolveIconShape` для формы действий
 *  - `@ui/button`, `@ui/input` и `@ui/search-field` — читают `resolveIconShape`
 *    для формы секции иконки или сброса; SearchField — для обоих
 *  - `@ui/listbox` и `@ui/range-input` —
 *    читают `resolveIconShape` для формы окна сброса и шеврона
 *  - `src/pages/showcase` — читает `getIconPadding` и демонстрирует состояния
 *    в витрине
 */

import { createElement, type ComponentPropsWithRef, type ElementType } from 'react';

import { type DistributiveOmit } from '@ui/type-utils';

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
  resolveIconShape,
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
 * IconDomProps — представляет HTML-пропсы корня Icon без стилей и `className`.
 * Вычитает ключи из каждой ветки объединения отдельно.
 */
type IconDomProps<T extends ElementType> = DistributiveOmit<
  ComponentPropsWithRef<T>,
  'className' | 'style' | keyof IconStyleProps
>;

/**
 * IconProps — представляет пропсы компонента Icon.
 * Ведущий `as="button"` открывает `active` и `disabled`, гасит `interactive`.
 * Окно гасит `active` и `disabled`.
 *
 * @template T тип корневого элемента, по умолчанию `span`
 *
 * @property as — переопределяет корневой HTML-тег, например `<span>`, `<button>`
 */
type IconProps<T extends ElementType = 'span'> = T extends 'button'
  ? { as: 'button'; interactive?: never } & IconStyleProps & IconDomProps<'button'>
  : { active?: never; as?: T; disabled?: never } & IconStyleProps & IconDomProps<T>;

/**
 * Icon — отображает окно иконки. При `as="button"` — иконочное действие.
 *
 * @example
 * <Icon size="normal">
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
 *   size={size}
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
      isButton: true,
      type: type ?? DEFAULT_ICON_TYPE,
    });
  }

  return createElement(StyledIcon, {
    ...(props as IconProps<'span'>),
    isButton: false,
  });
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
  resolveIconShape,
  resolveIconStateBackground,
  type IconPosition,
  type IconShapePreset,
  type IconSizePreset,
};
