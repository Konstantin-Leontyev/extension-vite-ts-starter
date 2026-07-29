/**
 * Файл: `src/ui/round-button/index.tsx`
 * Предоставляет компонент RoundButton для отображения круглой кнопки с глифом.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - границу через проп `showBorder`
 *  - тон поверхности круга через проп `iconTone`
 *  - тон глифа через проп `iconFill`
 *  - отступ окна Icon через проп `iconPadding`
 *  - svg глифа через `children`. В `children` передают сырой svg без обёртки Icon
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
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Icon } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';
import { type TonePreset } from '@ui/tones';

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
 *
 * @property children — svg глифа
 * @property iconFill — тон глифа при нейтральном `iconTone`
 * @property iconPadding — отступ окна Icon вместо отступа из размерного ряда.
 *   Область клика кнопки не меняет, увеличенный отступ зрительно уменьшает глиф,
 *   например close в Modal и ProfileMenu
 */
type RoundButtonProps = {
  children: ReactNode;
  iconFill?: TonePreset;
  iconPadding?: SpacingValue;
} & RoundButtonStyleProps &
  Omit<
    ComponentPropsWithRef<'button'>,
    'children' | 'className' | 'style' | 'type' | keyof RoundButtonStyleProps
  >;

/**
 * RoundButton — отображает круглую кнопку с глифом.
 *
 * @example
 * <RoundButton aria-label="Settings">
 *   <SettingsIcon />
 * </RoundButton>
 * <RoundButton aria-label="Close" iconPadding={8}>
 *   <CloseIcon />
 * </RoundButton>
 * <RoundButton aria-label="Avatar" showBorder sizePreset="huge">
 *   <AvatarIcon />
 * </RoundButton>
 */
export function RoundButton({
  children,
  iconFill,
  iconPadding,
  iconTone,
  sizePreset,
  ...rest
}: RoundButtonProps) {
  return (
    <StyledRoundButton
      iconTone={iconTone}
      sizePreset={sizePreset}
      type="button"
      {...rest}
    >
      <Icon
        iconFill={iconFill}
        iconTone={iconTone}
        interactive
        padding={iconPadding}
        sizePreset={sizePreset}
      >
        {children}
      </Icon>
    </StyledRoundButton>
  );
}

/* eslint-disable react-refresh/only-export-components -- публичные типы, пресеты и геттер габарита */
export {
  DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  ROUND_BUTTON_SIZE_PRESET_KEYS,
  getRoundButtonMinBlockSize,
  type RoundButtonSizePreset,
};
