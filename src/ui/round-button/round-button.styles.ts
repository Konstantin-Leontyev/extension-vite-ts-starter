/**
 * Файл: `src/ui/round-button/round-button.styles.ts`
 * Определяет внешний вид компонента RoundButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RoundButtonStyleProps` и `RoundButtonSizePreset`
 * 2. Хранить локальный ряд размеров в `roundButtonPresets`
 * 3. Предоставить функции `getRoundButtonStyles` и `getRoundButtonMinBlockSize`,
 *    дефолты `DEFAULT_ROUND_BUTTON_SIZE_PRESET` и `DEFAULT_ROUND_BUTTON_SHOW_BORDER`,
 *    перечень `ROUND_BUTTON_SIZE_PRESET_KEYS`
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
 * RoundButtonStyleProps — представляет пропсы стилизации RoundButton и layout-пропсы.
 *
 * @property showBorder — включает границу
 * @property sizePreset — размер кнопки
 */
export type RoundButtonStyleProps = LayoutProps & {
  showBorder?: boolean;
  sizePreset?: RoundButtonSizePreset;
};

/**
 * roundButtonPresets — хранит габарит кнопки для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `huge`.
 * Отступ под иконку кнопка не задаёт: вызывающий код передаёт в `children` svg,
 * уже обёрнутый в `Icon`, — окно иконки держит обёртка.
 */
const roundButtonPresets = {
  ...minBlockSize,
  huge: 80,
} as const satisfies Record<RoundButtonSizePreset, SpacingValue>;

/**
 * ROUND_BUTTON_SIZE_PRESET_KEYS — формирует перечень размеров круглой кнопки
 * из ключей `roundButtonPresets`. Используется в панелях настроек витрины
 * дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const ROUND_BUTTON_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(roundButtonPresets) as RoundButtonSizePreset[]
);

/**
 * getRoundButtonMinBlockSize — возвращает ключ шкалы габарита RoundButton
 * по `sizePreset`. Используется генератором стилей и вызывающим кодом
 * для согласования высоты соседних узлов с рядом кнопок.
 *
 * @param sizePreset — размер круглой кнопки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getRoundButtonMinBlockSize(
  sizePreset: RoundButtonSizePreset
): SpacingValue {
  return roundButtonPresets[sizePreset];
}

/**
 * DEFAULT_ROUND_BUTTON_SIZE_PRESET — задаёт размер по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_ROUND_BUTTON_SIZE_PRESET: RoundButtonSizePreset = 'medium';

/**
 * DEFAULT_ROUND_BUTTON_SHOW_BORDER — задаёт показ границы по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_ROUND_BUTTON_SHOW_BORDER = true;

/**
 * ROUND_BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации RoundButton.
 */
const ROUND_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'showBorder',
  'sizePreset',
]);

/**
 * getRoundButtonStyles — возвращает CSS-правила для корня `StyledRoundButton`:
 * габарит, оформление в режиме с границей или без неё
 * и подсветку `:not(:disabled):hover` и `:focus-visible` — отдельная проверка
 * disabled в focus-правиле не нужна, потому что disabled-кнопка не фокусируется.
 *
 * @param props — пропсы стилизации круглой кнопки и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getRoundButtonStyles(
  props: RoundButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    showBorder = DEFAULT_ROUND_BUTTON_SHOW_BORDER,
    sizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  } = props;
  const dimension = getSpacingValue(getRoundButtonMinBlockSize(sizePreset));

  const styles: string[] = [`inline-size: ${dimension};`, `block-size: ${dimension};`];

  if (showBorder) {
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
 *  - `getRoundButtonStyles` — габарит, режим с границей и подсветка
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
