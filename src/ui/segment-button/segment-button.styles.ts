/**
 * Файл: `src/ui/segment-button/segment-button.styles.ts`
 * Определяет внешний вид компонента SegmentButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonStyleProps`
 * 2. Предоставить функцию `getSegmentButtonTextSize`
 * 3. Предоставить styled-узел `StyledSegmentButton`
 *
 * Потребители:
 *  - `src/ui/segment-button/index.tsx` — собирает компонент SegmentButton и реэкспортирует
 *    публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getControlBorder,
  getMinBlockSize,
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

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
 * SEGMENT_BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации SegmentButton.
 */
const SEGMENT_BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * getSegmentButtonStyles — возвращает CSS-правила для корня `StyledSegmentButton`:
 * высоту, заливку, рамку через `getControlBorder` и радиус по `shape`.
 *
 * @param props пропсы стилизации корня и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonStyles(
  props: SegmentButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    `background-color: ${theme.colors.surface};`,
    getControlBorder(theme),
    `border-radius: ${resolveBlockRadius(shape, getMinBlockSize(sizePreset))};`,
  ];

  return styles.join('\n');
}

/**
 * StyledSegmentButton — задаёт корневой узел компонента SegmentButton.
 * Базируется на `<div>` и поддерживает все пропсы из `SegmentButtonStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — оболочка над рядом сегментов
 *  - `flex-shrink: 0` — ряд не сжимается во flex-контейнере
 *  - `inline-size: 100%` — занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *  - `overflow: hidden` — обрезает сегменты по скруглению оболочки
 *
 * Генерация стилей:
 *  - `getSegmentButtonStyles` — высота, заливка, рамка и радиус
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSegmentButton = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PROP_NAMES.has(prop),
})<SegmentButtonStyleProps>`
  display: grid;
  flex-shrink: 0;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;
  ${(props) => getSegmentButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
