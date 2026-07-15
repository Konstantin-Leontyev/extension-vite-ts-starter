/**
 * Файл: `src/ui/round-button/index.tsx`
 * Предоставляет компонент RoundButton для отображения круглой кнопки с иконкой.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - границу через проп `showBorder`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RoundButton
 * 2. Типизировать пропсы через `RoundButtonProps`
 * 3. Реэкспортировать публичное API стилей: `DEFAULT_ROUND_BUTTON_SHOW_BORDER`,
 *    `DEFAULT_ROUND_BUTTON_SIZE_PRESET`, `ROUND_BUTTON_SIZE_PRESET_KEYS`, `roundButtonPresets`
 *    и тип `RoundButtonSizePreset`
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
  roundButtonPresets,
  type RoundButtonSizePreset,
  type RoundButtonStyleProps,
} from './round-button.styles';

/**
 * RoundButtonProps — представляет пропсы компонента RoundButton.
 */
type RoundButtonProps = RoundButtonStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    keyof RoundButtonStyleProps | 'className' | 'style' | 'type'
  >;

/**
 * RoundButton — отображает круглую кнопку с иконкой.
 *
 * @example
 * <RoundButton aria-label="Settings">
 *   <SettingsIcon />
 * </RoundButton>
 * <RoundButton aria-label="Close" showBorder={false} sizePreset="small">
 *   <CloseIcon />
 * </RoundButton>
 */
export function RoundButton(props: RoundButtonProps) {
  return createElement(StyledRoundButton, { type: 'button', ...props });
}

/* eslint-disable react-refresh/only-export-components -- публичные типы и пресеты */
export {
  DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  roundButtonPresets,
  type RoundButtonSizePreset,
};
