/**
 * Файл: `src/ui/progress-bar/progress-bar.styles.ts`
 * Определяет внешний вид компонента ProgressBar.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ProgressBarStyleProps`
 * 2. Хранить высоту полосы в `progressBarBlockSize`
 * 3. Предоставить функции `clampProgressValue` и `getProgressBarTextSize`
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
 * getProgressBarBlockSize — возвращает CSS-высоту полосы прогресса.
 *
 * @param sizePreset размер из ряда контролов
 * @returns высота полосы в rem
 */
function getProgressBarBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(progressBarBlockSize[sizePreset]);
}

/**
 * getProgressBarTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер полосы
 * @returns метка размера текста из `TextSizePreset` для подписи с процентом
 */
export function getProgressBarTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * clampProgressValue — ограничивает значение диапазоном от 0 до 1.
 *
 * @param value число для ограничения
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
 * ProgressBarStyleProps — представляет пропсы стилизации ProgressBar и layout-пропсы.
 *
 * @property sizePreset — размер полосы
 * @property tone — семантический тон заливки
 * @property value — доля заполнения от 0 до 1
 */
export type ProgressBarStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
  value: number;
};

/**
 * PROGRESS_BAR_ROOT_PROP_NAMES — объединяет имена layout-пропсов корня ProgressBar.
 */
const PROGRESS_BAR_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * StyledProgressBarRoot — задаёт корневой узел компонента ProgressBar.
 * Базируется на `<div>` и поддерживает пропсы из `LayoutProps`.
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
  shouldForwardProp: (prop) => !PROGRESS_BAR_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: flex;
  gap: ${getSpacingValue(12)};
  align-items: center;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * PROGRESS_BAR_PROP_NAMES — хранит имена пропсов стилизации полосы ProgressBar.
 */
const PROGRESS_BAR_PROP_NAMES = new Set<string>(['sizePreset']);

/**
 * getProgressBarStyles — возвращает CSS-правила для узла `StyledProgressBar`:
 * высоту, скругление и цвет дорожки.
 *
 * @param props пропсы стилизации полосы прогресса и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getProgressBarStyles(
  props: Pick<ProgressBarStyleProps, 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;
  const blockSize = getProgressBarBlockSize(sizePreset);

  const styles = [
    `block-size: ${blockSize};`,
    `border-radius: ${blockSize};`,
    `background-color: ${theme.colors.border};`,
  ];

  return styles.join('\n');
}

/**
 * StyledProgressBar — задаёт полосу прогресса компонента ProgressBar.
 * Базируется на `<div>` и принимает проп `sizePreset`.
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
})<Pick<ProgressBarStyleProps, 'sizePreset'>>`
  display: grid;
  flex-grow: 1;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getProgressBarStyles(props)}
`;

/**
 * ProgressBarFillStyleProps — представляет пропсы стилизации заливки ProgressBar.
 */
type ProgressBarFillStyleProps = Pick<ProgressBarStyleProps, 'tone' | 'value'>;

/**
 * PROGRESS_BAR_FILL_PROP_NAMES — хранит имена пропсов стилизации заливки ProgressBar.
 */
const PROGRESS_BAR_FILL_PROP_NAMES = new Set<string>(['tone', 'value']);

/**
 * getProgressBarFillStyles — возвращает CSS-правила для узла `StyledProgressBarFill`:
 * ширину по значению и цвет по тону.
 *
 * @param props пропсы стилизации заливки полосы прогресса и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getProgressBarFillStyles(
  props: ProgressBarFillStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { tone = DEFAULT_TONE, value } = props;

  const styles = [
    `inline-size: ${value * 100}%;`,
    `background-color: ${getToneColor(theme, tone, theme.colors.primary)};`,
  ];

  return styles.join('\n');
}

/**
 * StyledProgressBarFill — задаёт заливку полосы компонента ProgressBar.
 * Базируется на `<div>` и поддерживает пропсы из `ProgressBarFillStyleProps`.
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
  shouldForwardProp: (prop) => !PROGRESS_BAR_FILL_PROP_NAMES.has(prop),
})<ProgressBarFillStyleProps>`
  block-size: 100%;
  border-radius: inherit;
  transition: inline-size 120ms ease-out;
  ${(props) => getProgressBarFillStyles(props)}
`;
