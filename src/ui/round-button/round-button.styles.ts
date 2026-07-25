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

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getControlBorder, minBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  type TonePreset,
} from '@ui/tones';

/**
 * RoundButtonSizePreset — представляет размерный ряд круглой кнопки.
 * Расширяет канонический `SizePreset` ключом `huge`, не добавляя его
 * в общий ряд контролов.
 */
export type RoundButtonSizePreset = 'huge' | SizePreset;

/**
 * roundButtonMinBlockSize — хранит габарит кнопки для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `huge`.
 * Ряд повторяет `iconSize` компонента Icon: окно иконки заполняет круг целиком.
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
 * @property iconTone — тон поверхности круга
 * @property showBorder — включает рамку контрола вне layout-box
 * @property sizePreset — размер кнопки
 */
export type RoundButtonStyleProps = LayoutProps & {
  iconTone?: TonePreset;
  showBorder?: boolean;
  sizePreset?: RoundButtonSizePreset;
};

/**
 * ROUND_BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации RoundButton.
 */
const ROUND_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'iconTone',
  'showBorder',
  'sizePreset',
]);

/**
 * DEFAULT_ROUND_BUTTON_SHOW_BORDER — задаёт показ границы по умолчанию.
 * Рамка выключена: в продукте граница нужна точечно, например аватар в ProfileMenu,
 * а безрамные действия шапки и Card — норма без явного `showBorder={false}`.
 */
export const DEFAULT_ROUND_BUTTON_SHOW_BORDER = false;

/**
 * getRoundButtonStyles — возвращает CSS-правила для корня `StyledRoundButton`:
 * габарит, рамку через `getControlBorder` и канал состояний для внутреннего Icon.
 * Рамка вне layout-box: рамочный и безрамочный режимы дают один content-box
 * и один размер `Icon` — окно заполняет круг целиком.
 *
 * Как работает:
 * 1. Считает габарит по `sizePreset` и кладёт рамку через `getControlBorder` —
 *    layout-рамку у `button` снял reset
 * 2. Считает значение канала: для цветного `iconTone` — сдвиг тона к `shade`
 *    через `resolveColorMix`, для нейтрального — вуаль `theme.colors.veil`
 * 3. На `:not(:disabled):hover` и `:focus-visible` выставляет
 *    `--icon-state-background` — заливку рисует внутренний Icon
 *
 * @param props пропсы стилизации круглой кнопки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRoundButtonStyles(
  props: RoundButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    iconTone = DEFAULT_TONE,
    showBorder = DEFAULT_ROUND_BUTTON_SHOW_BORDER,
    sizePreset = DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  } = props;
  const size = getSpacingValue(getRoundButtonMinBlockSize(sizePreset));
  const colorKey = getToneColorKey(iconTone);
  const stateBackground = colorKey
    ? resolveColorMix(theme.colors[colorKey], theme.colors.shade)
    : theme.colors.veil;

  const styles = [
    `inline-size: ${size};`,
    `block-size: ${size};`,
    getControlBorder(theme, showBorder),
    `&:not(:disabled):hover,`,
    `&:focus-visible {`,
    `--icon-state-background: ${stateBackground};`,
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledRoundButton — задаёт корневой узел компонента RoundButton.
 * Базируется на `<button>` и поддерживает все пропсы из `RoundButtonStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `place-items: center` — центрирует иконку в круге
 *  - `overflow: hidden` — обрезает квадратное окно Icon по границе круга
 *  - `border-radius: 50%` — окружность для квадратного габарита
 *
 * Генерация стилей:
 *  - `getRoundButtonStyles` — габарит, режим с границей и канал состояний
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
