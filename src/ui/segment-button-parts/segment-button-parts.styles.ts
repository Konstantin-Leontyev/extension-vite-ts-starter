/**
 * Файл: `src/ui/segment-button-parts/segment-button-parts.styles.ts`
 * Определяет внешний вид компонента SegmentButtonParts.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonPartsStyleProps`
 *    и `SegmentButtonPartsShape`
 * 2. Хранить вертикальный отступ разделителя в `segmentButtonPartsDividerMarginBlock`,
 *    зазор иконки с текстом в `SEGMENT_BUTTON_PARTS_ICON_LABEL_GAP`
 *    и форму без радиуса в `SEGMENT_BUTTON_PARTS_FLUSH_SHAPE`
 * 3. Предоставить styled-узлы `StyledSegmentButtonPartsRoot`,
 *    `StyledSegmentButtonPartsPart` и `StyledSegmentButtonPartsDivider`
 *
 * Потребители:
 *  - `src/ui/segment-button-parts/index.tsx` — собирает компонент SegmentButtonParts
 *    и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { resolveIconStateBackground } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  resolvePressedBackground,
  type TonePreset,
} from '@ui/tones';

/**
 * segmentButtonPartsDividerMarginBlock — хранит вертикальный отступ разделителя
 * для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы из `@ui/spacing`.
 */
const segmentButtonPartsDividerMarginBlock = {
  small: 8,
  normal: 8,
  large: 12,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * SEGMENT_BUTTON_PARTS_ICON_LABEL_GAP — задаёт зазор между иконкой и текстом в сегменте.
 * Кластер контента, не краевая секция: `gap` вместо отступа лейбла у track-модели.
 */
const SEGMENT_BUTTON_PARTS_ICON_LABEL_GAP: SpacingValue = 8;

/**
 * SEGMENT_BUTTON_PARTS_FLUSH_SHAPE — задаёт форму сегмента без радиуса.
 * Крайние сегменты не пишут `border-radius`: начальное значение уже `0`.
 * Нужна под обрезающей оболочкой, где скругление даёт обрезка ряда.
 */
export const SEGMENT_BUTTON_PARTS_FLUSH_SHAPE = 'square' as const;

/**
 * SegmentButtonPartsShape — представляет форму ряда сегментов.
 * Канонические `rounded` / `pill` скругляют крайние сегменты.
 * `square` оставляет прямые углы под обрезкой оболочки.
 */
export type SegmentButtonPartsShape =
  | ShapePreset
  | typeof SEGMENT_BUTTON_PARTS_FLUSH_SHAPE;

/**
 * resolveSegmentButtonPartsRadius — возвращает радиус крайних сегментов
 * по форме ряда. Для `square` радиус не пишется: начальное значение уже `0`.
 *
 * @param shape форма ряда
 * @param minBlockSize минимальная высота сегмента
 * @returns значение `border-radius` или `undefined` при прямой форме
 */
function resolveSegmentButtonPartsRadius(
  shape: SegmentButtonPartsShape,
  minBlockSize: string
): string | undefined {
  if (shape === SEGMENT_BUTTON_PARTS_FLUSH_SHAPE) {
    return undefined;
  }

  return resolveBlockRadius(shape, minBlockSize);
}

/**
 * SegmentButtonPartsStyleProps — представляет пропсы стилизации SegmentButtonParts
 * и layout-пропсы.
 *
 * @property size — размер ряда сегментов
 */
export type SegmentButtonPartsStyleProps = LayoutProps & {
  size?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов
 * стилизации корня SegmentButtonParts.
 */
const SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'size',
]);

/**
 * getSegmentButtonPartsRootStyles — возвращает CSS-правила для корня
 * `StyledSegmentButtonPartsRoot`: минимальную высоту ряда по `size`.
 *
 * @param props пропсы стилизации корня
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsRootStyles(props: SegmentButtonPartsStyleProps): string {
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `min-block-size: ${getMinBlockSize(size)};`;
}

/**
 * StyledSegmentButtonPartsRoot — задаёт корневой узел компонента SegmentButtonParts.
 * Базируется на `<div>` и поддерживает пропсы из `SegmentButtonPartsStyleProps`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` — ряд сегментов и разделителей
 *  - `flex-shrink: 0` — ряд не сжимается во flex-контейнере
 *  - `inline-size: 100%` — ряд занимает всю ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение
 *  - `overflow: hidden` — обрезает содержимое по границе ряда
 *  - `grid-template-columns` при `[data-segments='2'|'3']` — равные колонки
 *    сегментов и auto-колонки разделителей
 *
 * Генерация стилей:
 *  - `getSegmentButtonPartsRootStyles` — минимальная высота ряда
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledSegmentButtonPartsRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES.has(prop),
})<SegmentButtonPartsStyleProps>`
  display: inline-grid;
  flex-shrink: 0;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;

  &[data-segments='2'] {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }

  &[data-segments='3'] {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  }

  ${(props) => getSegmentButtonPartsRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * SegmentButtonPartsPartStyleProps — представляет пропсы стилизации сегмента.
 * Позиция иконки в CSS сегмента не участвует — `iconPosition` живёт только
 * в JSX-порядке узлов и в styled-пропсы не передаётся.
 *
 * @property active — включает активное состояние сегмента
 * @property hasIcon — включает кластер иконки с текстом по центру сегмента
 * @property shape — форма ряда для скругления крайних сегментов
 * @property size — размер сегмента
 * @property tone — тон заливки сегмента
 */
type SegmentButtonPartsPartStyleProps = {
  active?: boolean;
  hasIcon: boolean;
  shape?: SegmentButtonPartsShape;
  size?: SizePreset;
  tone?: TonePreset;
};

/**
 * DEFAULT_SEGMENT_BUTTON_PARTS_ACTIVE — задаёт активное состояние сегмента по умолчанию.
 * Используется, когда вызывающий код не передал проп `active`.
 */
const DEFAULT_SEGMENT_BUTTON_PARTS_ACTIVE = false;

/**
 * SEGMENT_BUTTON_PARTS_PART_PROP_NAMES — хранит имена пропсов стилизации сегмента.
 */
const SEGMENT_BUTTON_PARTS_PART_PROP_NAMES = new Set<string>([
  'active',
  'hasIcon',
  'shape',
  'size',
  'tone',
]);

/**
 * getSegmentButtonPartsPartStyles — возвращает CSS-правила для узла
 * `StyledSegmentButtonPartsPart`: высоту, заливку по `tone`, центрирование
 * кластера иконки с текстом, наведение, фокус, скругление крайних сегментов
 * по `shape` и тень нажатия. Статику окна красит внутренний Icon своими
 * пропсами. Шов секции не ставится: иконка и текст — кластер в сегменте, не
 * краевая секция.
 *
 * Как работает:
 * 1. Берёт тему и дефолты пропсов
 * 2. Красит заливку и цвет текста по `tone`. Нейтраль — без собственной заливки.
 *    На наведении цветного тона смешивает заливку с `shade` через `resolveColorMix`
 * 3. Кладёт `padding-inline` из `getPaddingInline` на сегмент. С иконкой — колоночный
 *    грид с `gap` и `justify-content: center`, без track и seam. Без иконки лейбл
 *    растягивается на сегмент без `justify-items: center`, чтобы `ellipsis` имел
 *    потолок ширины
 * 4. На наведении и `:focus-visible` нейтрали ставит вуаль сегмента. Цветной
 *    `tone` дополнительно отдаёт в `--icon-state-background` цвет из
 *    `resolveIconStateBackground` с политикой `'none'` для нейтрали
 * 5. `outline` на фокусе не рисует: снятие даёт статика `:focus { outline: none }`
 *    в шаблоне узла. Акцент фокуса совпадает с наведением. Фокус-контур несёт
 *    оболочка ряда на `&:has(:focus-visible)`, не сегмент
 * 6. Скругляет первый и последний сегмент радиусом из
 *    `resolveSegmentButtonPartsRadius` по `shape` и минимальной высоте ряда.
 *    Форма `square` радиус не пишет: углы прямые, скругление даёт обрезка ряда
 * 7. На `:active` и при `active` красит сегмент заливкой нажатия через
 *    `resolvePressedBackground` и ставит `shadow.pressed`. Оболочка ряда
 *    тень не меняет. Положение сегмента не меняется
 *
 * @param props пропсы стилизации сегмента и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsPartStyles(
  props: SegmentButtonPartsPartStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_SEGMENT_BUTTON_PARTS_ACTIVE,
    hasIcon,
    shape = DEFAULT_SHAPE_PRESET,
    size = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const minBlockSize = getMinBlockSize(size);
  const radius = resolveSegmentButtonPartsRadius(shape, minBlockSize);
  const colorKey = getToneColorKey(tone);
  const hoverStateBackground = resolveIconStateBackground(theme, tone, 'none');
  const pressedBackground = resolvePressedBackground(theme, tone);
  const pressedShadow = `box-shadow: ${theme.shadow.pressed};`;

  const styles = [
    'display: grid;',
    'align-items: center;',
    `min-block-size: ${minBlockSize};`,
    'min-inline-size: 0;',
    `padding-inline: ${getPaddingInline(size)};`,
  ];

  if (colorKey) {
    const color = theme.colors[colorKey];

    styles.push(
      `background-color: ${color};`,
      `color: ${theme.colors.inverse};`,
      `&:not(:disabled):hover,`,
      `&:focus-visible { background-color: ${resolveColorMix(color, theme.colors.shade)}; }`
    );
  } else {
    styles.push(
      `&:not(:disabled):hover,`,
      `&:focus-visible { background-color: ${theme.colors.veil}; }`
    );
  }

  if (hasIcon) {
    styles.push(
      'grid-auto-flow: column;',
      'justify-content: center;',
      `gap: ${getSpacingValue(SEGMENT_BUTTON_PARTS_ICON_LABEL_GAP)};`
    );

    if (hoverStateBackground) {
      styles.push(
        `&:not(:disabled):hover,`,
        `&:focus-visible {`,
        `--icon-state-background: ${hoverStateBackground};`,
        '}'
      );
    }
  }

  if (radius) {
    styles.push(
      `&:first-child {`,
      `border-start-start-radius: ${radius};`,
      `border-end-start-radius: ${radius};`,
      '}',
      `&:last-child {`,
      `border-start-end-radius: ${radius};`,
      `border-end-end-radius: ${radius};`,
      '}'
    );
  }

  styles.push(
    `&:not(:disabled):active {`,
    `background-color: ${pressedBackground};`,
    pressedShadow,
    '}'
  );

  if (active) {
    styles.push(
      `&:not(:disabled) {`,
      `background-color: ${pressedBackground};`,
      pressedShadow,
      '}'
    );
  }

  return styles.join('\n');
}

/**
 * StyledSegmentButtonPartsPart — задаёт кнопку одного сегмента SegmentButtonParts.
 * Базируется на `<button>` и принимает пропсы из `SegmentButtonPartsPartStyleProps`.
 *
 * Встроенные стили:
 *  - `:focus { outline: none }` — акцент фокуса совпадает с наведением в генераторе
 *
 * Генерация стилей:
 *  - `getSegmentButtonPartsPartStyles` — заливка, кластер иконки с текстом,
 *    наведение, фокус, радиусы и тень нажатия
 */
export const StyledSegmentButtonPartsPart = styled.button.withConfig({
  shouldForwardProp: (prop) => !SEGMENT_BUTTON_PARTS_PART_PROP_NAMES.has(prop),
})<SegmentButtonPartsPartStyleProps>`
  &:focus {
    outline: none;
  }

  ${(props) => getSegmentButtonPartsPartStyles(props)}
`;

/**
 * SegmentButtonPartsDividerStyleProps — представляет пропсы стилизации разделителя сегментов.
 *
 * @property size — размер ряда для вертикального отступа разделителя
 */
type SegmentButtonPartsDividerStyleProps = {
  size?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_DIVIDER_PROP_NAMES — хранит имена пропсов стилизации разделителя.
 */
const SEGMENT_BUTTON_PARTS_DIVIDER_PROP_NAMES = new Set<string>(['size']);

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
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    margin-block: ${getSpacingValue(segmentButtonPartsDividerMarginBlock[size])};
    background-color: ${theme.colors.border};
  `;
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
