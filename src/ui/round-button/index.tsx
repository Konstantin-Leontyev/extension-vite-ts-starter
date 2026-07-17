/**
 * Файл: `src/ui/round-button/index.tsx`
 * Предоставляет компонент RoundButton для отображения круглой кнопки с иконкой.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - границу через проп `showBorder`
 *  - иконку через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RoundButton
 * 2. Типизировать пропсы через `RoundButtonProps`
 * 3. Реэкспортировать публичное API стилей: `DEFAULT_ROUND_BUTTON_SHOW_BORDER`,
 *    `DEFAULT_ROUND_BUTTON_SIZE_PRESET`, `ROUND_BUTTON_SIZE_PRESET_KEYS`,
 *    `getRoundButtonMinBlockSize` и тип `RoundButtonSizePreset`
 *
 * Потребители:
 *  - компоненты приложения, например Header, Card и ThemeToggle — показывают иконочные
 *    действия
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { createElement, type ComponentPropsWithRef } from 'react';

import {
  DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  StyledRoundButton,
  getRoundButtonMinBlockSize,
  type RoundButtonSizePreset,
  type RoundButtonStyleProps,
} from './round-button.styles';

/**
 * RoundButtonProps — представляет пропсы компонента RoundButton.
 */
type RoundButtonProps = RoundButtonStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    'className' | 'style' | 'type' | keyof RoundButtonStyleProps
  >;

/**
 * RoundButton — отображает круглую кнопку с иконкой.
 *
 * @example
 * <RoundButton aria-label="Settings">
 *   <Icon blockSize="100%" inlineSize="100%" padding={4}>
 *     <SettingsIcon />
 *   </Icon>
 * </RoundButton>
 */
export function RoundButton(props: RoundButtonProps) {
  return createElement(StyledRoundButton, { type: 'button', ...props });
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт геттера габарита */
export {
  DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  getRoundButtonMinBlockSize,
  type RoundButtonSizePreset,
};
