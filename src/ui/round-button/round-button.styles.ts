/**
 * Файл: `src/ui/round-button/round-button.styles.ts`
 * Определяет внешний вид компонента RoundButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RoundButtonStyleProps` и `RoundButtonSizePreset`
 * 2. Хранить локальный ряд размеров в `roundButtonPresets`
 * 3. Предоставить функцию `getRoundButtonStyles`, дефолты `DEFAULT_ROUND_BUTTON_SIZE_PRESET`
 *    и `DEFAULT_ROUND_BUTTON_BORDERED`, перечень `ROUND_BUTTON_SIZE_PRESET_KEYS`
 * 4. Предоставить styled-узел `StyledRoundButton`
 *
 * Потребители:
 *  - `src/ui/round-button/index.tsx` — собирает компонент RoundButton и реэкспортирует
 *    публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { minBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * RoundButtonSizePreset — представляет размерный ряд круглой кнопки.
 * Расширяет канонический `SizePreset` ключом `huge`, не добавляя его
 * в общий ряд контролов.
 */
export type RoundButtonSizePreset = SizePreset | 'huge';

/**
 * RoundButtonStyleProps — представляет пропсы стилизации круглой кнопки и layout-пропсы.
 *
 * @property bordered — включает режим с границей
 * @property sizePreset — размер кнопки
 */
export type RoundButtonStyleProps = LayoutProps & {
  bordered?: boolean;
  sizePreset?: RoundButtonSizePreset;
};

/**
 * roundButtonPresets — хранит габарит кнопки и внутренний отступ под иконку
 * для каждого размера ряда.
 * Ключ — размер из `RoundButtonSizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `minBlockSize` → габарит кнопки
 *  - `iconPadding` → внутренний отступ под иконку
 * Размеры `small`, `medium` и `large` берут `minBlockSize` из `@ui/presets`.
 */
export const roundButtonPresets = Object.freeze({
  small: Object.freeze({
    minBlockSize: minBlockSize.small,
    iconPadding: 4,
  } as const),
  medium: Object.freeze({
    minBlockSize: minBlockSize.medium,
    iconPadding: 4,
  } as const),
  large: Object.freeze({
    minBlockSize: minBlockSize.large,
    iconPadding: 4,
  } as const),
  huge: Object.freeze({
    minBlockSize: 80,
    iconPadding: 8,
  } as const),
} as const satisfies Record<
  RoundButtonSizePreset,
  { minBlockSize: SpacingValue; iconPadding: SpacingValue }
>);

/**
 * ROUND_BUTTON_SIZE_PRESET_KEYS — формирует перечень размеров круглой кнопки
 * из ключей `roundButtonPresets`. Используется в панелях настроек витрины
 * дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const ROUND_BUTTON_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(roundButtonPresets) as RoundButtonSizePreset[]
);

/**
 * DEFAULT_ROUND_BUTTON_SIZE_PRESET — задаёт размер по умолчанию для пропа `sizePreset`.
 * Используется в `getRoundButtonStyles`, когда размер не передан.
 */
export const DEFAULT_ROUND_BUTTON_SIZE_PRESET: RoundButtonSizePreset = 'medium';

/**
 * DEFAULT_ROUND_BUTTON_BORDERED — задаёт режим с границей по умолчанию для пропа `bordered`.
 * Используется в `getRoundButtonStyles`, когда режим не передан.
 */
export const DEFAULT_ROUND_BUTTON_BORDERED = true;

/**
 * ROUND_BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации RoundButton.
 */
const ROUND_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'bordered',
  'sizePreset',
]);

/**
 * getRoundButtonStyles — возвращает CSS-правила для корня `StyledRoundButton`:
 * габарит, отступ под иконку, оформление в режиме с границей или без неё
 * и подсветку `:not(:disabled):hover` и `:focus-visible` — отдельная проверка
 * disabled в focus-правиле не нужна, потому что disabled-кнопка не фокусируется.
 *
 * @param props — пропсы стилизации круглой кнопки и тема
 * @returns CSS-правила габарита, режима с границей и подсветки
 */
export function getRoundButtonStyles(
  props: RoundButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    bordered = DEFAULT_ROUND_BUTTON_BORDERED,
    sizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  } = props;
  const preset = roundButtonPresets[sizePreset];
  const dimension = getSpacingValue(preset.minBlockSize);

  const styles: string[] = [
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    `padding: ${getSpacingValue(preset.iconPadding)};`,
  ];

  if (bordered) {
    styles.push(`border: 1px solid ${theme.colors.border};`);
    styles.push(`box-shadow: ${theme.shadow.surface};`);
  } else {
    styles.push(`color: ${theme.colors.muted};`);
  }

  styles.push(`
    &:not(:disabled):hover,
    &:focus-visible {
      color: ${theme.colors.muted};
      background-color: ${theme.colors.hoverSurface};
    }
  `);

  return styles.join('\n');
}

/**
 * StyledRoundButton — задаёт корневой узел компонента RoundButton.
 * Базируется на `<button>` и поддерживает все пропсы из `RoundButtonStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `place-items: center` — центрирует иконку в круге
 *  - `overflow: hidden` — обрезает содержимое по границе кнопки
 *  - `border-radius: 50%` — окружность для квадратного габарита
 *
 * Генерация стилей:
 *  - `getRoundButtonStyles` — габарит, отступ, режим с границей и подсветка
 *    наведения и фокуса
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRoundButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !ROUND_BUTTON_PROP_NAMES.has(prop),
})<RoundButtonStyleProps>`
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  ${(props) => getRoundButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
