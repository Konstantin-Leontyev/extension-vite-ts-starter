/**
 * Файл: `src/ui/segment-button/segment-button.styles.ts`
 * Определяет внешний вид компонента SegmentButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonStyleProps`
 * 2. Предоставить styled-узлы `StyledSegmentButtonRoot` и `StyledSegmentButton`
 * 3. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/segment-button/index.tsx` — собирает компонент SegmentButton и реэкспортирует
 *    публичное API
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * SegmentButtonStyleProps — представляет пропсы стилизации SegmentButton и layout-пропсы.
 *
 * @property borderTone — тон рамки
 * @property shape — форма оболочки ряда
 * @property size — размер компонента
 */
export type SegmentButtonStyleProps = LayoutProps & {
  borderTone?: TonePreset;
  shape?: ShapePreset;
  size?: SizePreset;
};

/**
 * StyledSegmentButtonRoot — задаёт корневой узел компонента SegmentButton.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный поток подписи и оболочки
 *  - `gap` — отступ между подписью и оболочкой
 *  - `inline-size: 100%` — занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSegmentButtonRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * SEGMENT_BUTTON_PROP_NAMES — хранит имена пропсов стилизации оболочки ряда.
 */
const SEGMENT_BUTTON_PROP_NAMES = new Set<string>(['borderTone', 'shape', 'size']);

/**
 * getSegmentButtonStyles — возвращает CSS-правила для узла `StyledSegmentButton`:
 * высоту, заливку, рамку с тенью через `getBorderStyles`, радиус по `shape`
 * и фокус-контур ряда на `&:has(:focus-visible)`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `size`
 * 2. Собирает `min-block-size` через `getMinBlockSize`, заливку `surface`,
 *    рамку с тенью через `getBorderStyles` и `border-radius` через
 *    `resolveBlockRadius` по форме и высоте
 * 3. На `&:has(:focus-visible)` рисует фокус-контур через `getOutlineStyles` —
 *    общая обводка ряда, пока фокус на сегменте виден. Сам сегмент контур не рисует
 *
 * @param props пропсы стилизации оболочки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonStyles(
  props: Pick<SegmentButtonStyleProps, 'borderTone' | 'shape' | 'size'> & {
    theme: AppTheme;
  }
): string {
  const theme = getTheme(props);
  const { borderTone, shape = DEFAULT_SHAPE_PRESET, size = DEFAULT_SIZE_PRESET } = props;
  const minBlockSize = getMinBlockSize(size);

  return `
    min-block-size: ${minBlockSize};
    background-color: ${theme.colors.surface};
    ${getBorderStyles(theme, undefined, undefined, borderTone)}
    border-radius: ${resolveBlockRadius(shape, minBlockSize)};
    &:has(:focus-visible) {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledSegmentButton — задаёт оболочку ряда сегментов компонента SegmentButton.
 * Базируется на `<div>` и принимает пропсы `borderTone`, `shape` и `size`.
 *
 * Встроенные стили:
 *  - `display: grid` — оболочка над рядом сегментов
 *  - `inline-size: 100%` — занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *  - `overflow: hidden` — обрезает сегменты по скруглению оболочки
 *
 * Генерация стилей:
 *  - `getSegmentButtonStyles` — высота, заливка, рамка с тенью через `getBorderStyles`,
 *    радиус и фокус-контур `&:has(:focus-visible)`
 */
export const StyledSegmentButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PROP_NAMES.has(prop),
})<Pick<SegmentButtonStyleProps, 'borderTone' | 'shape' | 'size'>>`
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getSegmentButtonStyles(props)}
`;
