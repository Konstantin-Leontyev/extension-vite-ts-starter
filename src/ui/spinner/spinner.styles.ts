/**
 * Файл: `src/ui/spinner/spinner.styles.ts`
 * Определяет внешний вид компонента Spinner.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SpinnerStyleProps`
 * 2. Хранить размер и толщину рамки в `spinnerSize` и `spinnerBorderWidth`
 * 3. Предоставить функцию `getSpinnerTextSize`
 * 4. Предоставить styled-узлы `StyledSpinnerRoot` и `StyledSpinner`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/spinner/index.tsx` — собирает компонент Spinner и реэкспортирует публичное API
 */

import { keyframes, styled } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { getToneColor, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * spinnerSize — хранит размер спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Ряд компактнее контролов.
 */
const spinnerSize = {
  small: 16,
  normal: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getSpinnerSize — возвращает CSS-размер стороны спиннера.
 *
 * @param sizePreset размер из ряда контролов
 * @returns длина стороны в rem
 */
function getSpinnerSize(sizePreset: SizePreset): string {
  return getSpacingValue(spinnerSize[sizePreset]);
}

/**
 * spinnerBorderWidth — хранит толщину рамки спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — толщина в px.
 * Толщина штриха не привязана к шкале spacing: это не отступ.
 */
const spinnerBorderWidth = {
  small: 2,
  normal: 2,
  large: 4,
} as const satisfies Record<SizePreset, number>;

/**
 * getSpinnerBorderWidth — возвращает толщину рамки спиннера в px.
 *
 * @param sizePreset размер из ряда контролов
 * @returns толщина рамки в px
 */
function getSpinnerBorderWidth(sizePreset: SizePreset): number {
  return spinnerBorderWidth[sizePreset];
}

/**
 * getSpinnerTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер спиннера
 * @returns метка размера текста из `TextSizePreset` для подписи под индикатором
 */
export function getSpinnerTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * SpinnerStyleProps — представляет пропсы стилизации Spinner и layout-пропсы.
 *
 * @property sizePreset — размер спиннера
 * @property tone — семантический тон
 */
export type SpinnerStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * StyledSpinnerRoot — задаёт корневой узел компонента Spinner.
 * Базируется на `<div>` и поддерживает пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `gap` — отступ между индикатором и подписью
 *  - `justify-items: center` — центрирует индикатор и подпись
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSpinnerRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  justify-items: center;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * SpinnerIndicatorStyleProps — представляет пропсы стилизации индикатора Spinner.
 */
type SpinnerIndicatorStyleProps = Pick<SpinnerStyleProps, 'sizePreset' | 'tone'>;

/**
 * SPINNER_INDICATOR_PROP_NAMES — хранит имена пропсов стилизации индикатора Spinner.
 */
const SPINNER_INDICATOR_PROP_NAMES = new Set<string>(['sizePreset', 'tone']);

/**
 * DEFAULT_SPINNER_TONE — задаёт тон по умолчанию.
 * Используется, когда вызывающий код не передал проп `tone`.
 */
const DEFAULT_SPINNER_TONE: TonePreset = 'primary';

/**
 * spinnerRotate — задаёт ключевые кадры анимации вращения спиннера.
 */
const spinnerRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * SPINNER_ROTATE_DURATION — задаёт длительность оборота индикатора.
 * Используется в `StyledSpinner`.
 */
const SPINNER_ROTATE_DURATION = '0.8s';

/**
 * getSpinnerStyles — возвращает CSS-правила для узла `StyledSpinner`:
 * размер, рамку, цвет и скругление.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `sizePreset` и `tone`
 * 2. Собирает габариты через `getSpinnerSize`, рамку нейтральным
 *    `theme.colors.border` с толщиной из `getSpinnerBorderWidth`, цвет верхней
 *    грани через `getToneColor` с запасным `theme.colors.border` и
 *    `border-radius: 50%`
 *
 * @param props пропсы стилизации индикатора и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSpinnerStyles(
  props: SpinnerIndicatorStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET, tone = DEFAULT_SPINNER_TONE } = props;
  const size = getSpinnerSize(sizePreset);

  return `
    inline-size: ${size};
    block-size: ${size};
    border: ${getSpinnerBorderWidth(sizePreset)}px solid ${theme.colors.border};
    border-block-start-color: ${getToneColor(theme, tone, theme.colors.border)};
    border-radius: 50%;
  `;
}

/**
 * StyledSpinner — задаёт индикатор компонента Spinner.
 * Базируется на `<div>` и поддерживает пропсы из `SpinnerIndicatorStyleProps`.
 *
 * Встроенные стили:
 *  - `animation` — бесконечное вращение индикатора через `spinnerRotate` и
 *    `SPINNER_ROTATE_DURATION`
 *  - `animation-duration: calc(${SPINNER_ROTATE_DURATION} * 2)` при
 *    `prefers-reduced-motion: reduce` — удваивает длительность оборота
 *
 * Генерация стилей:
 *  - `getSpinnerStyles` — размер, рамка, цвет и скругление
 */
export const StyledSpinner = styled.div.withConfig({
  shouldForwardProp: (prop) => !SPINNER_INDICATOR_PROP_NAMES.has(prop),
})<SpinnerIndicatorStyleProps>`
  ${(props) => getSpinnerStyles(props)}
  animation: ${spinnerRotate} ${SPINNER_ROTATE_DURATION} linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: calc(${SPINNER_ROTATE_DURATION} * 2);
  }
`;
