/**
 * Файл: `src/ui/segment-button-parts/segment-button-parts.styles.ts`
 * Определяет внешний вид компонента SegmentButtonParts.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `SegmentButtonPartsStyleProps`,
 *    `SegmentButtonPartsPartStyleProps` и `SegmentButtonPartsDividerStyleProps`
 * 2. Хранить вертикальный отступ разделителя в `segmentButtonPartsDividerMarginBlock`
 * 3. Предоставить styled-узлы `StyledSegmentButtonPartsRoot`,
 *    `StyledSegmentButtonPartsPart` и `StyledSegmentButtonPartsDivider`
 *
 * Потребители:
 *  - `src/ui/segment-button-parts/index.tsx` — собирает компонент SegmentButtonParts
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
 * SegmentButtonPartsStyleProps — представляет пропсы стилизации SegmentButtonParts
 * и layout-пропсы.
 *
 * @property sizePreset — размер ряда сегментов
 */
export type SegmentButtonPartsStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов
 * стилизации корня SegmentButtonParts.
 */
const SEGMENT_BUTTON_PARTS_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'sizePreset',
]);

/**
 * getSegmentButtonPartsRootStyles — возвращает CSS-правила для корня
 * `StyledSegmentButtonPartsRoot`: минимальную высоту ряда по `sizePreset`.
 *
 * @param props пропсы стилизации корня
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsRootStyles(props: SegmentButtonPartsStyleProps): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `min-block-size: ${getMinBlockSize(sizePreset)};`;
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
 * @property hasIcon — включает кластер иконки с текстом по центру сегмента
 * @property shape — форма ряда для скругления крайних сегментов
 * @property sizePreset — размер сегмента
 * @property tone — тон заливки сегмента
 */
type SegmentButtonPartsPartStyleProps = {
  hasIcon: boolean;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * SEGMENT_BUTTON_PARTS_PART_PROP_NAMES — хранит имена пропсов стилизации сегмента.
 */
const SEGMENT_BUTTON_PARTS_PART_PROP_NAMES = new Set<string>([
  'hasIcon',
  'shape',
  'sizePreset',
  'tone',
]);

/**
 * getSegmentButtonPartsPartStyles — возвращает CSS-правила для узла
 * `StyledSegmentButtonPartsPart`: высоту, заливку по `tone`, центрирование
 * кластера иконки с текстом, наведение, фокус и скругление крайних сегментов
 * по `shape`. Статику окна красит внутренний Icon своими пропсами. Шов секции
 * не ставится: иконка и текст — кластер в сегменте, не краевая секция.
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
 *    оболочка ряда на `:focus-within`, не сегмент
 * 6. Скругляет первый и последний сегмент радиусом из `resolveBlockRadius` по
 *    `shape` и минимальной высоте ряда
 *
 * @param props пропсы стилизации сегмента и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getSegmentButtonPartsPartStyles(
  props: SegmentButtonPartsPartStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    hasIcon,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const minBlockSize = getMinBlockSize(sizePreset);
  const radius = resolveBlockRadius(shape, minBlockSize);
  const colorKey = getToneColorKey(tone);
  const hoverStateBackground = resolveIconStateBackground(theme, tone, 'none');

  const styles = [
    'display: grid;',
    'align-items: center;',
    `min-block-size: ${minBlockSize};`,
    'min-inline-size: 0;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
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

  styles.push(
    `&:first-child {\nborder-start-start-radius: ${radius};\nborder-end-start-radius: ${radius};\n}`
  );
  styles.push(
    `&:last-child {\nborder-start-end-radius: ${radius};\nborder-end-end-radius: ${radius};\n}`
  );

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
 *    наведение, фокус и радиусы
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

  return `
    margin-block: ${getSpacingValue(segmentButtonPartsDividerMarginBlock[sizePreset])};
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
