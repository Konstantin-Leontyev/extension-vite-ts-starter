/**
 * Файл: `src/ui/segment-button-parts/segment-button-parts.styles.ts`
 * Определяет внешний вид компонента SegmentButtonParts.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonPartsRootStyleProps` и
 *    `SegmentButtonPartsPartStyleProps`
 * 2. Хранить зазоры ряда в `segmentButtonPartsLayoutPresets`
 * 3. Предоставить styled-узлы `StyledSegmentButtonPartsRoot`,
 *    `StyledSegmentButtonPartsPart` и `StyledSegmentButtonPartsDivider`
 *
 * Потребители:
 *  - `src/ui/segment-button-parts/index.tsx` — собирает компонент SegmentButtonParts
 */

import styled from 'styled-components';

import { ICON_SETTING_PROP_NAMES, resolveIconSurface } from '@ui/icon';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

/**
 * segmentButtonPartsLayoutPresets — хранит зазор между иконкой и текстом сегмента
 * и вертикальный отступ разделителя для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — пара ключей шкалы из `@ui/spacing`:
 *  - `gap` → значение для CSS-свойства `gap` сегмента
 *  - `dividerMarginBlock` → значение для CSS-свойства `margin-block` разделителя
 */
const segmentButtonPartsLayoutPresets = {
  small: { dividerMarginBlock: 8, gap: 4 },
  medium: { dividerMarginBlock: 8, gap: 8 },
  large: { dividerMarginBlock: 12, gap: 8 },
} as const satisfies Record<
  SizePreset,
  { dividerMarginBlock: SpacingValue; gap: SpacingValue }
>;

/**
 * SegmentButtonPartsRootStyleProps — представляет пропсы стилизации корня SegmentButtonParts.
 *
 * @property sizePreset — размер ряда сегментов
 */
export type SegmentButtonPartsRootStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES — хранит имена пропсов стилизации корня SegmentButtonParts.
 */
const SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES = new Set<string>(['sizePreset']);

/**
 * getSegmentButtonPartsRootStyles — возвращает CSS-правила для узла
 * `StyledSegmentButtonPartsRoot`: минимальную высоту ряда по `sizePreset`.
 *
 * @param props пропсы стилизации корня
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsRootStyles(
  props: SegmentButtonPartsRootStyleProps
): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [`min-block-size: ${getMinBlockSize(sizePreset)};`];

  return styles.join('\n');
}

/**
 * StyledSegmentButtonPartsRoot — задаёт корневой узел компонента SegmentButtonParts.
 * Базируется на `<div>` и принимает пропсы из `SegmentButtonPartsRootStyleProps`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` — ряд сегментов и разделителей
 *  - `flex-shrink: 0` — ряд не сжимается во flex-контейнере
 *  - `min-inline-size: 0` — предотвращает переполнение
 *  - `overflow: hidden` — обрезает содержимое по границе ряда
 *  - `[data-segments='2'|'3']` — равные колонки сегментов и auto-колонки разделителей
 *
 * Генерация стилей:
 *  - `getSegmentButtonPartsRootStyles` — минимальная высота ряда
 */
export const StyledSegmentButtonPartsRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES.has(prop),
})<SegmentButtonPartsRootStyleProps>`
  display: inline-grid;
  flex-shrink: 0;
  grid-template-columns: 1fr;
  min-inline-size: 0;
  overflow: hidden;

  &[data-segments='2'] {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    inline-size: 100%;
  }

  &[data-segments='3'] {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
    inline-size: 100%;
  }

  ${(props) => getSegmentButtonPartsRootStyles(props)}
`;

/**
 * SegmentButtonPartsPartStyleProps — представляет пропсы стилизации сегмента.
 * Позиция иконки в CSS сегмента не участвует — `iconPosition` живёт только
 * в JSX-порядке узлов и в styled-пропсы не передаётся.
 *
 * @property iconFill — тон глифа иконки
 * @property iconTone — тон секции иконки
 * @property shape — форма ряда для скругления крайних сегментов
 * @property sizePreset — размер сегмента
 */
export type SegmentButtonPartsPartStyleProps = {
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_PART_PROP_NAMES — объединяет имена пропсов иконки и стилизации сегмента.
 */
const SEGMENT_BUTTON_PARTS_PART_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * getSegmentButtonPartsPartStyles — возвращает CSS-правила для узла
 * `StyledSegmentButtonPartsPart`: зазор, высоту, отступы, поверхность иконки,
 * наведение, фокус и скругление крайних сегментов при `rounded`.
 *
 * Как работает:
 * 1. Берёт тему, дефолты и поверхность иконки через `resolveIconSurface`
 * 2. Собирает зазор, высоту, `padding-inline` и цвет глифа
 * 3. При цветном `iconTone` красит секцию иконки и её hover
 * 4. Добавляет вуаль наведения на сегмент и кольцо `:focus-visible`
 * 5. При `shape === 'rounded'` скругляет первый и последний сегмент
 *
 * @param props пропсы стилизации сегмента и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsPartStyles(
  props: SegmentButtonPartsPartStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    iconFill,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const iconSurface = resolveIconSurface(theme, iconTone, iconFill);
  const hasIconTone = iconTone !== DEFAULT_TONE;
  const hasIconFill =
    iconFill != null && iconFill !== DEFAULT_TONE && iconFill !== iconTone;

  const styles = [
    `gap: ${getSpacingValue(segmentButtonPartsLayoutPresets[sizePreset].gap)};`,
    `block-size: ${getMinBlockSize(sizePreset)};`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    `[data-slot='label'] {`,
    'min-inline-size: 0;',
    '}',
  ];

  if (hasIconTone || hasIconFill) {
    styles.push(`[data-slot='icon'] {`, `color: ${iconSurface.color};`);

    if (hasIconTone) {
      styles.push(`background-color: ${iconSurface.backgroundColor};`);
    }

    styles.push('}');
  }

  styles.push(
    `&:not(:disabled):hover {`,
    `background-color: ${theme.colors.veil};`,
    '}'
  );

  if (hasIconTone) {
    styles.push(
      `&:not(:disabled):hover [data-slot='icon'] {`,
      `background: ${iconSurface.hoverBackground};`,
      '}'
    );
  }

  styles.push(
    '&:focus-visible {',
    'position: relative;',
    'z-index: 1;',
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: -2px;',
    '}'
  );

  if (shape === 'rounded') {
    const radius = getSpacingValue(8);

    styles.push(
      `&:first-child {\nborder-start-start-radius: ${radius};\nborder-end-start-radius: ${radius};\n}`
    );
    styles.push(
      `&:last-child {\nborder-start-end-radius: ${radius};\nborder-end-end-radius: ${radius};\n}`
    );
  }

  return styles.join('\n');
}

/**
 * StyledSegmentButtonPartsPart — задаёт кнопку одного сегмента SegmentButtonParts.
 * Базируется на `<button>` и принимает пропсы из `SegmentButtonPartsPartStyleProps`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: центрированный ряд
 *    иконки и текста, где текст сжимается с многоточием. Grid с auto-колонками тянет
 *    трек к max-content и ломает усечение
 *  - `align-items: center` и `justify-content: center` — центрирует содержимое сегмента
 *  - `min-inline-size: 0` — позволяет тексту сжиматься
 *  - `:focus { outline: none }` — кольцо фокуса рисует генератор на `:focus-visible`
 *
 * Генерация стилей:
 *  - `getSegmentButtonPartsPartStyles` — зазор, высота, иконка, hover, focus и радиусы
 */
export const StyledSegmentButtonPartsPart = styled.button.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PARTS_PART_PROP_NAMES.has(prop),
})<SegmentButtonPartsPartStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 0;

  &:focus {
    outline: none;
  }

  ${(props) => getSegmentButtonPartsPartStyles(props)}
`;

/**
 * SegmentButtonPartsDividerStyleProps — представляет пропсы стилизации разделителя сегментов.
 *
 * @property sizePreset — размер ряда для вертикального отступа разделителя
 */
type SegmentButtonPartsDividerStyleProps = {
  sizePreset?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_DIVIDER_PROP_NAMES — хранит имена пропсов стилизации разделителя.
 */
const SEGMENT_BUTTON_PARTS_DIVIDER_PROP_NAMES = new Set<string>(['sizePreset']);

/**
 * getSegmentButtonPartsDividerStyles — возвращает CSS-правила для узла
 * `StyledSegmentButtonPartsDivider`: вертикальный отступ и цвет полосы.
 *
 * @param props пропсы стилизации разделителя и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsDividerStyles(
  props: SegmentButtonPartsDividerStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    `margin-block: ${getSpacingValue(segmentButtonPartsLayoutPresets[sizePreset].dividerMarginBlock)};`,
    `background-color: ${theme.colors.border};`,
  ];

  return styles.join('\n');
}

/**
 * StyledSegmentButtonPartsDivider — задаёт разделитель между сегментами.
 * Базируется на `<span>` и принимает пропсы из `SegmentButtonPartsDividerStyleProps`.
 *
 * Встроенные стили:
 *  - `inline-size: 1px` — тонкая вертикальная полоса
 *
 * Генерация стилей:
 *  - `getSegmentButtonPartsDividerStyles` — отступ и цвет полосы
 */
export const StyledSegmentButtonPartsDivider = styled.span.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PARTS_DIVIDER_PROP_NAMES.has(prop),
})<SegmentButtonPartsDividerStyleProps>`
  inline-size: 1px;
  ${(props) => getSegmentButtonPartsDividerStyles(props)}
`;
