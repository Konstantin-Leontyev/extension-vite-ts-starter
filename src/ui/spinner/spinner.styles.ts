/**
 * Файл: `src/ui/spinner/spinner.styles.ts`
 * Определяет внешний вид компонента Spinner.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SpinnerStyleProps`
 * 2. Хранить размер и толщину рамки в `spinnerBlockSize` и `spinnerBorderWidth`
 * 3. Предоставить функции `getSpinnerStyles` и `getSpinnerTextSize`
 * 4. Предоставить styled-узлы `StyledSpinnerRoot` и `StyledSpinner`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/spinner/index.tsx` — собирает компонент Spinner
 */

import { css, keyframes, styled } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * spinnerBlockSize — хранит размер спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Ряд компактнее контролов.
 */
const spinnerBlockSize = {
  small: 16,
  medium: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * spinnerBorderWidth — хранит толщину рамки спиннера для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — толщина в px.
 * Толщина штриха не привязана к шкале spacing: это не отступ.
 */
const spinnerBorderWidth = {
  small: 2,
  medium: 2,
  large: 4,
} as const satisfies Record<SizePreset, number>;

/**
 * SpinnerStyleProps — представляет пропсы стилизации спиннера и layout-пропсы.
 *
 * @property sizePreset — размер спиннера
 * @property tone — семантический тон
 */
export type SpinnerStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * SPINNER_ROOT_PROP_NAMES — объединяет имена layout-пропсов корня Spinner.
 */
const SPINNER_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * SPINNER_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации индикатора Spinner.
 */
const SPINNER_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset', 'tone']);

/**
 * getSpinnerTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset — размер спиннера
 * @returns метка размера текста из `TextSizePreset` для подписи под индикатором
 */
export function getSpinnerTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * spinnerRotate — задаёт ключевые кадры анимации вращения спиннера.
 */
const spinnerRotate = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/**
 * getSpinnerStyles — возвращает CSS-правила для индикатора `StyledSpinner`:
 * размер, рамку и анимацию.
 *
 * @param props — пропсы стилизации спиннера и тема
 * @returns CSS-правила с анимацией
 */
export function getSpinnerStyles(props: SpinnerStyleProps & { theme: AppTheme }) {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;
  const tone = props.tone ?? DEFAULT_TONE;
  const blockSize = getSpacingValue(spinnerBlockSize[sizePreset]);
  const borderWidth = `${spinnerBorderWidth[sizePreset]}px`;
  const spinnerColor = getToneColor(theme, tone, theme.colors.primary);

  return css`
    inline-size: ${blockSize};
    block-size: ${blockSize};
    border: ${borderWidth} solid ${theme.colors.border};
    border-block-start-color: ${spinnerColor};
    border-radius: 50%;
    animation: ${spinnerRotate} 0.8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation-duration: 1.6s;
    }
  `;
}

/**
 * StyledSpinnerRoot — задаёт корневой узел компонента Spinner.
 * Базируется на `<div>` и поддерживает пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `justify-items: center` — центрирует индикатор и подпись
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSpinnerRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !SPINNER_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  justify-items: center;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledSpinner — задаёт индикатор компонента Spinner.
 * Базируется на `<div>` и поддерживает пропсы из `SpinnerStyleProps`.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — индикатор не сжимается при нехватке места
 *
 * Генерация стилей:
 *  - `getSpinnerStyles` — размер, рамка, цвет, анимация
 *  - `getLayoutStyles` — отступы, позиционирование, размеры в одиночном режиме
 */
export const StyledSpinner = styled.div.withConfig({
  shouldForwardProp: (prop) => !SPINNER_PROP_NAMES.has(prop),
})<SpinnerStyleProps>`
  flex-shrink: 0;
  ${(props) => getSpinnerStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
