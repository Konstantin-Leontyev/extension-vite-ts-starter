/**
 * Файл: `src/ui/icon/index.tsx`
 * Предоставляет компонент Icon для отображения окна иконки.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - svg через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Icon
 * 2. Типизировать пропсы через `IconProps`
 * 3. Реэкспортировать публичное API стилей: `StyledIcon`
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Listbox, Stepper и DateInput —
 *    расширяют `StyledIcon` спецификой узла
 *  - вызывающий код RoundButton, например Header, ThemeToggle и Card —
 *    передаёт в кнопку svg, обёрнутый в Icon
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import { StyledIcon, type IconStyleProps } from './icon.styles';

/**
 * IconProps — представляет пропсы компонента Icon.
 */
type IconProps = IconStyleProps &
  Omit<ComponentPropsWithRef<'span'>, keyof IconStyleProps | 'className' | 'style'>;

/**
 * Icon — отображает окно иконки.
 *
 * @example
 * <Icon sizePreset="medium">
 *   <CalendarIcon />
 * </Icon>
 * <Icon blockSize="100%" inlineSize="100%" padding={4}>
 *   <ContrastIcon />
 * </Icon>
 */
export function Icon(props: IconProps) {
  return createElement(StyledIcon, props);
}

export { StyledIcon };
