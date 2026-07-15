/**
 * Файл: `src/ui/progress-bar/progress-bar.styles.ts`
 * Определяет внешний вид компонента ProgressBar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ProgressBarStyleProps`
 * 2. Хранить высоту полосы в `progressBarBlockSize`
 * 3. Предоставить функции `clampProgressValue`, `getProgressBarTextSize`,
 *    `getProgressBarStyles` и `getProgressBarFillStyles`
 * 4. Предоставить styled-узлы `StyledProgressBarRoot`, `StyledProgressBar`
 *    и `StyledProgressBarFill`
 *
 * Потребители:
 *  - `src/ui/progress-bar/index.tsx` — собирает компонент ProgressBar
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * progressBarBlockSize — хранит высоту полосы прогресса для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Ряд компактнее контролов.
 */
const progressBarBlockSize = {
  small: 4,
  medium: 8,
  large: 12,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * ProgressBarStyleProps — представляет пропсы стилизации ProgressBar и layout-пропсы.
 *
 * @property value — доля заполнения от 0 до 1
 * @property sizePreset — размер полосы
 * @property tone — семантический тон заливки
 */
export type ProgressBarStyleProps = LayoutProps & {
  value: number;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * PROGRESS_BAR_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации ProgressBar.
 */
const PROGRESS_BAR_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'value',
  'sizePreset',
  'tone',
]);

/**
 * getProgressBarTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset — размер полосы
 * @returns метка размера текста из `TextSizePreset` для подписи с процентом
 */
export function getProgressBarTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * clampProgressValue — ограничивает значение диапазоном от 0 до 1.
 *
 * @param value — число для ограничения
 * @returns число в диапазоне от 0 до 1
 */
export function clampProgressValue(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}

/**
 * getProgressBarStyles — возвращает CSS-правила для узла `StyledProgressBar`:
 * высоту, скругление и цвет дорожки.
 *
 * @param props — пропсы стилизации полосы прогресса и тема
 * @returns CSS-правила
 */
export function getProgressBarStyles(
  props: ProgressBarStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const blockSize = getSpacingValue(progressBarBlockSize[sizePreset]);

  return `
    block-size: ${blockSize};
    border-radius: ${blockSize};
    background-color: ${theme.colors.border};
  `;
}

/**
 * getProgressBarFillStyles — возвращает CSS-правила для узла `StyledProgressBarFill`:
 * ширину по значению и цвет по тону.
 *
 * @param props — пропсы стилизации полосы прогресса и тема
 * @returns CSS-правила
 */
export function getProgressBarFillStyles(
  props: ProgressBarStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const tone = props.tone ?? DEFAULT_TONE;
  const progressColor = getToneColor(theme, tone, theme.colors.primary);
  const value = clampProgressValue(props.value);

  return `
    inline-size: ${value * 100}%;
    background-color: ${progressColor};
  `;
}

/**
 * StyledProgressBarRoot — задаёт корневой узел компонента ProgressBar.
 * Базируется на `<div>` и поддерживает все пропсы из `ProgressBarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: подпись идёт
 *    в потоке и не резервирует место, когда она не отображается
 *  - `align-items: center` — подпись по центру относительно полосы
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledProgressBarRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  display: flex;
  gap: ${getSpacingValue(12)};
  align-items: center;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledProgressBar — задаёт полосу прогресса компонента ProgressBar.
 * Базируется на `<div>` и поддерживает все пропсы из `ProgressBarStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `flex-grow: 1` — полоса занимает всё доступное место
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `overflow: hidden` — обрезает заливку по границе полосы
 *
 * Генерация стилей:
 *  - `getProgressBarStyles` — высота, скругление и цвет дорожки
 */
export const StyledProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  display: grid;
  flex-grow: 1;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getProgressBarStyles(props)}
`;

/**
 * StyledProgressBarFill — задаёт заливку полосы компонента ProgressBar.
 * Базируется на `<div>` и поддерживает все пропсы из `ProgressBarStyleProps`.
 *
 * Встроенные стили:
 *  - `block-size: 100%` — заливка на всю высоту полосы
 *  - `border-radius: inherit` — наследует скругление от полосы
 *  - `transition: inline-size 120ms ease-out` — плавное изменение ширины
 *
 * Генерация стилей:
 *  - `getProgressBarFillStyles` — ширина и цвет заливки
 */
export const StyledProgressBarFill = styled.div.withConfig({
  shouldForwardProp: (prop) => !PROGRESS_BAR_PROP_NAMES.has(prop),
})<ProgressBarStyleProps>`
  block-size: 100%;
  border-radius: inherit;
  transition: inline-size 120ms ease-out;
  ${(props) => getProgressBarFillStyles(props)}
`;
