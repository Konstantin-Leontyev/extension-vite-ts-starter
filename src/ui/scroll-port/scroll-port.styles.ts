/**
 * Файл: `src/ui/scroll-port/scroll-port.styles.ts`
 * Определяет внешний вид компонента ScrollPort.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ScrollPortStyleProps`
 * 2. Задать значение по умолчанию через `DEFAULT_SCROLL_PORT_PADDING_INLINE_END`
 * 3. Предоставить styled-узлы `StyledScrollPortRoot`, `StyledScrollPortContainer`
 *    и `StyledScrollPortViewport`
 *
 * Потребители:
 *  - `src/ui/scroll-port/index.tsx` — собирает компонент ScrollPort
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';

/**
 * VEIL_BLOCK_SIZE — задаёт высоту градиентной вуали на краях прокрутки.
 * По умолчанию подставляется в отступы `scrollbarInsetBlockStart` и
 * `scrollbarInsetBlockEnd` вьюпорта, чтобы контент не скрывался под вуалью.
 */
const VEIL_BLOCK_SIZE: SpacingValue = 32;

/**
 * VEIL_INSET_OFFSET — задаёт выступ вуали за край контента и зазор до трека скроллбара.
 * Используется в `getScrollPortRootStyles`.
 */
const VEIL_INSET_OFFSET: SpacingValue = 4;

/**
 * SCROLLBAR_TRACK_WIDTH — задаёт ширину трека скроллбара.
 * Используется в `resolveScrollPortTrackMarginInlineEnd`.
 */
const SCROLLBAR_TRACK_WIDTH: SpacingValue = 8;

/**
 * ScrollPortRootStyleProps — представляет пропсы стилизации корня ScrollPort.
 * `gutterInlineEnd` обязателен: сборка подставляет дефолт один раз в `index.tsx`.
 * Публичный проп называется `paddingInlineEnd`; на корне значение переименовано,
 * потому что питает не CSS-свойство `padding-inline-end`, а смещение трека и края
 * вуали: имя layout-пропа заставило бы `getLayoutStyles` корня написать лишний
 * `padding-inline-end`.
 *
 * @property gutterInlineEnd — ширина правого отступа под трек скроллбара и зазор вуали
 * @property showVeil — включает градиентные вуали на краях при прокрутке
 */
type ScrollPortRootStyleProps = {
  gutterInlineEnd: SpacingValue;
  showVeil?: boolean;
};

/**
 * SCROLL_PORT_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов корня ScrollPort.
 */
const SCROLL_PORT_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'gutterInlineEnd',
  'showVeil',
]);

/**
 * DEFAULT_SCROLL_PORT_PADDING_INLINE_END — задаёт отступ inline-end по умолчанию.
 * Используется, когда вызывающий код не передал проп `paddingInlineEnd`.
 */
export const DEFAULT_SCROLL_PORT_PADDING_INLINE_END: SpacingValue = 16;

/**
 * DEFAULT_SCROLL_PORT_SHOW_VEIL — задаёт видимость вуали по умолчанию.
 * Используется, когда вызывающий код не передал проп `showVeil`.
 */
const DEFAULT_SCROLL_PORT_SHOW_VEIL = true;

/**
 * resolveScrollPortTrackMarginInlineEnd — вычисляет значение для CSS-свойства
 * `margin-inline-end`, смещающее трек скроллбара в область правого отступа.
 * Берёт половину `SCROLLBAR_TRACK_WIDTH`: полширины трека остаётся видимой,
 * остальное уходит в отступ.
 *
 * @param gutterInlineEnd ширина правого отступа под трек скроллбара
 * @returns значение для CSS-свойства `margin-inline-end`
 */
function resolveScrollPortTrackMarginInlineEnd(gutterInlineEnd: SpacingValue): string {
  return `calc(-1 * (${getSpacingValue(gutterInlineEnd)} - ${getSpacingValue(SCROLLBAR_TRACK_WIDTH)} / 2))`;
}

/**
 * getScrollPortRootStyles — возвращает CSS-правила для корня `StyledScrollPortRoot`:
 * раскладку, смещение трека скроллбара и градиентные вуали.
 *
 * Как работает:
 * 1. Собирает раскладку корня и смещает трек через
 *    `resolveScrollPortTrackMarginInlineEnd`
 * 2. При `showVeil` задаёт `inset-inline` вуалей: выступ на `VEIL_INSET_OFFSET`
 *    слева и зазор до трека скроллбара справа
 *
 * @param props пропсы стилизации корня ScrollPort
 * @returns CSS-правила, каждое с новой строки
 */
function getScrollPortRootStyles(props: ScrollPortRootStyleProps): string {
  const { gutterInlineEnd, showVeil = DEFAULT_SCROLL_PORT_SHOW_VEIL } = props;

  const styles = [
    'position: relative;',
    'display: grid;',
    'grid-template-rows: minmax(0, 1fr);',
    'block-size: 100%;',
    'min-block-size: 0;',
    'min-inline-size: 0;',
    'background-color: inherit;',
    `margin-inline-end: ${resolveScrollPortTrackMarginInlineEnd(gutterInlineEnd)};`,
  ];

  if (showVeil) {
    const veilInsetOffset = getSpacingValue(VEIL_INSET_OFFSET);
    const veilInsetInline = `calc(${veilInsetOffset} * -1) calc(${getSpacingValue(gutterInlineEnd)} - ${veilInsetOffset})`;

    styles.push(`
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 2;
        block-size: ${getSpacingValue(VEIL_BLOCK_SIZE)};
        pointer-events: none;
        inset-inline: ${veilInsetInline};
        background-color: inherit;
      }

      &::before {
        inset-block-start: 0;
        mask-image: linear-gradient(to bottom, black, transparent);
      }

      &::after {
        inset-block-end: 0;
        mask-image: linear-gradient(to top, black, transparent);
      }
    `);
  }

  return styles.join('\n');
}

/**
 * StyledScrollPortRoot — задаёт корневой узел компонента ScrollPort.
 * Базируется на `<div>` и поддерживает layout-пропсы и пропсы корня.
 *
 * Генерация стилей:
 *  - `getScrollPortRootStyles` — раскладка, смещение трека скроллбара и градиентные вуали
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledScrollPortRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !SCROLL_PORT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps & ScrollPortRootStyleProps>`
  ${(props) => getScrollPortRootStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledScrollPortContainer — задаёт промежуточную обёртку компонента ScrollPort.
 * Базируется на `<div>` между корнем и вьюпортом прокрутки.
 *
 * Встроенные стили:
 *  - `min-inline-size: 0` — сжимается по строчной оси во flex/grid-родителе
 *  - `min-block-size: 0` — сжимается по блочной оси во flex/grid-родителе
 *  - `padding-block` — вертикальный зазор между корнем и вьюпортом
 */
export const StyledScrollPortContainer = styled.div`
  min-inline-size: 0;
  min-block-size: 0;
  padding-block: ${getSpacingValue(4)};
`;

/**
 * ScrollPortViewportStyleProps — представляет пропсы стилизации вьюпорта ScrollPort.
 * `paddingInlineEnd` обязателен: сборка подставляет дефолт один раз в `index.tsx`.
 *
 * @property paddingInlineEnd — отступ inline-end содержимого вьюпорта
 * @property scrollbarInsetBlockEnd — отступ снизу перед прокручиваемым контентом
 * @property scrollbarInsetBlockStart — отступ сверху перед прокручиваемым контентом
 */
type ScrollPortViewportStyleProps = {
  paddingInlineEnd: SpacingValue;
  scrollbarInsetBlockEnd?: SpacingValue;
  scrollbarInsetBlockStart?: SpacingValue;
};

/**
 * SCROLL_PORT_VIEWPORT_PROP_NAMES — хранит имена пропсов вьюпорта ScrollPort
 * из `ScrollPortViewportStyleProps`.
 */
const SCROLL_PORT_VIEWPORT_PROP_NAMES = new Set<string>([
  'paddingInlineEnd',
  'scrollbarInsetBlockEnd',
  'scrollbarInsetBlockStart',
]);

/**
 * DEFAULT_SCROLL_PORT_SCROLLBAR_INSET_BLOCK — задаёт отступ block скроллбара по умолчанию.
 * Совпадает с высотой вуали, чтобы контент не скрывался под ней. Подставляется для
 * `scrollbarInsetBlockStart` и `scrollbarInsetBlockEnd`, когда вызывающий код их не передал.
 */
const DEFAULT_SCROLL_PORT_SCROLLBAR_INSET_BLOCK: SpacingValue = VEIL_BLOCK_SIZE;

/**
 * getScrollPortViewportStyles — возвращает CSS-правила для узла `StyledScrollPortViewport`:
 * прокрутку, отступы содержимого и стиль трека скроллбара.
 *
 * @param props пропсы стилизации вьюпорта ScrollPort
 * @returns CSS-правила, каждое с новой строки
 */
function getScrollPortViewportStyles(props: ScrollPortViewportStyleProps): string {
  const {
    paddingInlineEnd,
    scrollbarInsetBlockEnd = DEFAULT_SCROLL_PORT_SCROLLBAR_INSET_BLOCK,
    scrollbarInsetBlockStart = DEFAULT_SCROLL_PORT_SCROLLBAR_INSET_BLOCK,
  } = props;

  const styles = [
    'block-size: 100%;',
    'min-block-size: 0;',
    'min-inline-size: 0;',
    'overflow: auto;',
    'overscroll-behavior: contain;',
    `padding-inline: ${getSpacingValue(4)} ${getSpacingValue(paddingInlineEnd)};`,
    `padding-block-start: ${getSpacingValue(scrollbarInsetBlockStart)};`,
    `padding-block-end: ${getSpacingValue(scrollbarInsetBlockEnd)};`,
    `&::-webkit-scrollbar-track { margin-block-end: ${getSpacingValue(4)}; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledScrollPortViewport — задаёт вьюпорт прокрутки компонента ScrollPort.
 * Базируется на `<div>` и принимает пропсы `paddingInlineEnd`, `scrollbarInsetBlockStart`
 * и `scrollbarInsetBlockEnd`.
 *
 * Генерация стилей:
 *  - `getScrollPortViewportStyles` — прокрутку, отступы содержимого и стиль трека скроллбара
 */
export const StyledScrollPortViewport = styled.div.withConfig({
  shouldForwardProp: (prop) => !SCROLL_PORT_VIEWPORT_PROP_NAMES.has(prop),
})<ScrollPortViewportStyleProps>`
  ${(props) => getScrollPortViewportStyles(props)}
`;

/**
 * ScrollPortStyleProps — представляет пропсы стилизации ScrollPort и layout-пропсы.
 * `paddingInlineEnd` опционален: сборка подставляет дефолт один раз в `index.tsx`,
 * во внутренние узлы уходит уже подставленное значение. Одно значение задаёт отступ
 * под трек скроллбара на корне и отступ содержимого во вьюпорте.
 *
 * @property paddingInlineEnd — отступ inline-end для трека скроллбара и содержимого
 * @property scrollbarInsetBlockEnd — отступ снизу перед прокручиваемым контентом
 * @property scrollbarInsetBlockStart — отступ сверху перед прокручиваемым контентом
 * @property showVeil — включает градиентные вуали на краях при прокрутке
 */
export type ScrollPortStyleProps = LayoutProps & {
  paddingInlineEnd?: SpacingValue;
  scrollbarInsetBlockEnd?: SpacingValue;
  scrollbarInsetBlockStart?: SpacingValue;
  showVeil?: boolean;
};
