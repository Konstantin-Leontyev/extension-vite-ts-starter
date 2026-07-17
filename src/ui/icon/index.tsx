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
 *
 * Потребители:
 *  - контролы с иконочными узлами, например Listbox, Stepper и DateInput —
 *    кладут Icon внутрь своего узла-места: колонка триггера, кнопка-половинка
 *  - вызывающий код RoundButton, например Header, ThemeToggle и Card —
 *    передаёт в кнопку svg, обёрнутый в Icon
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import { StyledIcon, type IconStyleProps } from './icon.styles';

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
 * <Icon blockSize="100%" inlineSize="100%" padding={4}>
 *   <ContrastIcon />
 * </Icon>
 */
export function Icon(props: IconProps) {
  return createElement(StyledIcon, props);
}
