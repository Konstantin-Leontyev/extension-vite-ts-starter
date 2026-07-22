/**
 * Файл: `src/ui/round-button/round-button.styles.ts`
 * Определяет внешний вид компонента RoundButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RoundButtonStyleProps` и `RoundButtonSizePreset`
 * 2. Хранить локальный ряд размеров в `roundButtonMinBlockSize`
 * 3. Предоставить функцию `getRoundButtonMinBlockSize`,
 *    дефолты `DEFAULT_ROUND_BUTTON_SIZE_PRESET` и `DEFAULT_ROUND_BUTTON_SHOW_BORDER`,
 *    перечень `ROUND_BUTTON_SIZE_PRESET_KEYS`
 * 4. Предоставить styled-узел `StyledRoundButton`
 *
 * Потребители:
 *  - `src/ui/round-button/index.tsx` — собирает компонент RoundButton и реэкспортирует
 *    публичное API
 */

import styled from 'styled-components';

import { resolveIconSurface } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHOW_BORDER,
  getControlBorder,
  minBlockSize,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

/**
 * RoundButtonSizePreset — представляет размерный ряд круглой кнопки.
 * Расширяет канонический `SizePreset` ключом `huge`, не добавляя его
 * в общий ряд контролов.
 */
export type RoundButtonSizePreset = 'huge' | SizePreset;

/**
 * roundButtonMinBlockSize — хранит габарит кнопки для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `huge`.
 * Отступ под иконку кнопка не задаёт: вызывающий код передаёт в `children` svg,
 * уже обёрнутый в `Icon`, — окно иконки держит обёртка.
 */
const roundButtonMinBlockSize = {
  ...minBlockSize,
  huge: 80,
} as const satisfies Record<RoundButtonSizePreset, SpacingValue>;

/**
 * ROUND_BUTTON_SIZE_PRESET_KEYS — формирует перечень размеров круглой кнопки
 * из ключей `roundButtonMinBlockSize`. Используется в панелях настроек витрины
 * дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const ROUND_BUTTON_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(roundButtonMinBlockSize) as RoundButtonSizePreset[]
);

/**
 * DEFAULT_ROUND_BUTTON_SIZE_PRESET — задаёт размер по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_ROUND_BUTTON_SIZE_PRESET: RoundButtonSizePreset = 'medium';

/**
 * getRoundButtonMinBlockSize — возвращает ключ шкалы габарита RoundButton
 * по `sizePreset`. Используется генератором стилей и вызывающим кодом
 * для согласования высоты соседних узлов с рядом кнопок.
 *
 * @param sizePreset размер круглой кнопки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getRoundButtonMinBlockSize(
  sizePreset: RoundButtonSizePreset
): SpacingValue {
  return roundButtonMinBlockSize[sizePreset];
}

/**
 * RoundButtonStyleProps — представляет пропсы стилизации RoundButton и layout-пропсы.
 *
 * @property iconFill — тон глифа иконки
 * @property iconTone — тон поверхности круга
 * @property showBorder — включает рамку контрола вне layout-box
 * @property sizePreset — размер кнопки
 */
export type RoundButtonStyleProps = LayoutProps & {
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  showBorder?: boolean;
  sizePreset?: RoundButtonSizePreset;
};

/**
 * ROUND_BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации RoundButton.
 */
const ROUND_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'iconFill',
  'iconTone',
  'showBorder',
  'sizePreset',
]);

/**
 * DEFAULT_ROUND_BUTTON_SHOW_BORDER — задаёт показ границы по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_ROUND_BUTTON_SHOW_BORDER = DEFAULT_SHOW_BORDER;

/**
 * getRoundButtonStyles — возвращает CSS-правила для корня `StyledRoundButton`:
 * габарит, рамку через `getControlBorder`, тон круга/`iconFill` через
 * `resolveIconSurface` и подсветку `:not(:disabled):hover` и `:focus-visible`.
 * Рамка вне layout-box: рамочный и безрамочный режимы дают один content-box
 * и один размер `Icon` на `100%`.
 *
 * Как работает:
 * 1. Считает габарит и поверхность через `resolveIconSurface`
 * 2. Кладёт рамку через `getControlBorder` — layout-рамку у `button` снял reset
 * 3. При цветном `iconTone` красит круг заливкой секции и подсвечивает hover/focus
 *    её же `hoverBackground`
 * 4. При нейтральном `iconTone` при отличном `iconFill` красит только глиф,
 *    а hover/focus — вуалью `theme.colors.veil`
 *
 * @param props пропсы стилизации круглой кнопки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRoundButtonStyles(
  props: RoundButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    iconFill,
    iconTone = DEFAULT_TONE,
    showBorder = DEFAULT_ROUND_BUTTON_SHOW_BORDER,
    sizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  } = props;
  const dimension = getSpacingValue(getRoundButtonMinBlockSize(sizePreset));
  const iconSurface = resolveIconSurface(theme, iconTone, iconFill);
  const hasIconTone = iconTone !== DEFAULT_TONE;
  const hasIconFill =
    iconFill != null && iconFill !== DEFAULT_TONE && iconFill !== iconTone;

  const styles = [
    `inline-size: ${dimension};`,
    `block-size: ${dimension};`,
    getControlBorder(theme, showBorder),
  ];

  if (hasIconTone) {
    styles.push(
      `background-color: ${iconSurface.backgroundColor};`,
      `color: ${iconSurface.color};`,
      `&:not(:disabled):hover,`,
      `&:focus-visible {`,
      `background: ${iconSurface.hoverBackground};`,
      '}'
    );
  } else {
    if (hasIconFill) {
      styles.push(`color: ${iconSurface.color};`);
    }

    styles.push(
      `&:not(:disabled):hover,`,
      `&:focus-visible {`,
      `background-color: ${theme.colors.veil};`,
      '}'
    );
  }

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
