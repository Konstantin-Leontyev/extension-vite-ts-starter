/**
 * Файл: `src/ui/segment-button/segment-button.styles.ts`
 * Определяет внешний вид компонента SegmentButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonStyleProps`
 * 2. Предоставить функцию `getSegmentButtonTextSize`
 * 3. Предоставить styled-узлы `StyledSegmentButtonRoot` и `StyledSegmentButton`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
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
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * getSegmentButtonTextSize — возвращает размер текста сегмента по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер сегментной кнопки
 * @returns метка размера текста из `TextSizePreset` для текста сегмента
 */
export function getSegmentButtonTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * SegmentButtonStyleProps — представляет пропсы стилизации SegmentButton и layout-пропсы.
 *
 * @property shape — форма оболочки ряда
 * @property sizePreset — размер компонента
 */
export type SegmentButtonStyleProps = LayoutProps & {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
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
const SEGMENT_BUTTON_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * getSegmentButtonStyles — возвращает CSS-правила для узла `StyledSegmentButton`:
 * высоту, заливку, рамку с тенью через `getBorderStyles`, радиус по `shape`
 * и фокус-контур ряда на `:focus-within`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает `min-block-size` через `getMinBlockSize`, заливку `surface`,
 *    рамку с тенью через `getBorderStyles` и `border-radius` через
 *    `resolveBlockRadius` по форме и высоте
 * 3. На `:focus-within` рисует фокус-контур через `getOutlineStyles` — общая
 *    обводка ряда, пока фокус на сегменте. Сам сегмент контур не рисует
 *
 * @param props пропсы стилизации оболочки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonStyles(
  props: Pick<SegmentButtonStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const minBlockSize = getMinBlockSize(sizePreset);

  return `
    min-block-size: ${minBlockSize};
    background-color: ${theme.colors.surface};
    ${getBorderStyles(theme)}
    border-radius: ${resolveBlockRadius(shape, minBlockSize)};
    &:focus-within {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}

/**
 * StyledSegmentButton — задаёт оболочку ряда сегментов компонента SegmentButton.
 * Базируется на `<div>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Встроенные стили:
 *  - `display: grid` — оболочка над рядом сегментов
 *  - `inline-size: 100%` — занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *  - `overflow: hidden` — обрезает сегменты по скруглению оболочки
 *
 * Генерация стилей:
 *  - `getSegmentButtonStyles` — высота, заливка, рамка с тенью через `getBorderStyles`,
 *    радиус и фокус-контур `:focus-within`
 */
export const StyledSegmentButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PROP_NAMES.has(prop),
})<Pick<SegmentButtonStyleProps, 'shape' | 'sizePreset'>>`
  display: grid;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getSegmentButtonStyles(props)}
`;
