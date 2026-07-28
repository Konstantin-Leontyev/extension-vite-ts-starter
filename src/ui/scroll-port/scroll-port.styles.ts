/**
 * Файл: `src/ui/scroll-port/scroll-port.styles.ts`
 * Определяет внешний вид компонента ScrollPort.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ScrollPortStyleProps`
 * 2. Предоставить дефолты `DEFAULT_SCROLL_PORT_PADDING_INLINE_END` и
 *    `DEFAULT_SCROLL_PORT_SHOW_VEIL`
 * 3. Предоставить функции `resolveScrollPortPaddingEdge` и
 *    `omitScrollPortRoutedPaddingProps`
 * 4. Предоставить styled-узлы `StyledScrollPortRoot`, `StyledScrollPortContainer`
 *    и `StyledScrollPortViewport`
 *
 * Потребители:
 *  - `src/ui/scroll-port/index.tsx` — собирает компонент ScrollPort
 */

import styled from 'styled-components';

import {
  LAYOUT_PROP_NAMES,
  getLayoutStyles,
  getSpacingValue,
  type LayoutProps,
  type SpacingProps,
  type SpacingValue,
} from '@ui/layout';

/**
 * VEIL_BLOCK_SIZE — задаёт высоту градиентной вуали на краях прокрутки.
 * Используется в `getScrollPortRootStyles`.
 */
const VEIL_BLOCK_SIZE: SpacingValue = 32;

/**
 * DEFAULT_SCROLL_PORT_VEIL_INSET_INLINE — задаёт выступ вуали за край по умолчанию.
 * Используется, когда вызывающий код не передал проп `veilInsetInline`.
 */
const DEFAULT_SCROLL_PORT_VEIL_INSET_INLINE: SpacingValue = 4;

/**
 * SCROLLBAR_TRACK_WIDTH — задаёт ширину трека скроллбара.
 * Используется в `resolveScrollPortTrackMarginInlineEnd`.
 */
const SCROLLBAR_TRACK_WIDTH: SpacingValue = 8;

/**
 * ScrollPortStyleProps — представляет пропсы стилизации ScrollPort и layout-пропсы.
 * `padding*` раскладываются во вьюпорт и желоб скроллбара. Остальные layout-пропсы —
 * на корень. `paddingInlineEnd` одновременно задаёт отступ контента и смещение трека.
 *
 * @property showVeil — включает градиентные вуали на краях при прокрутке
 * @property veilInsetInline — выступ вуали за inline-край. Перекрывает тень в отступе карточки
 */
export type ScrollPortStyleProps = LayoutProps & {
  showVeil?: boolean;
  veilInsetInline?: SpacingValue;
};

/**
 * ScrollPortRootStyleProps — представляет пропсы стилизации корня ScrollPort.
 * Публичный `paddingInlineEnd` на корне переименован в `gutterInlineEnd`: питает
 * смещение трека и край вуали, а не CSS `padding-inline-end` через `getLayoutStyles`.
 *
 * @property gutterInlineEnd — ширина правого отступа под трек скроллбара и зазор вуали
 * @property showVeil — включает градиентные вуали на краях при прокрутке
 * @property veilInsetInline — выступ вуали за inline-край
 */
type ScrollPortRootStyleProps = {
  gutterInlineEnd: SpacingValue;
  showVeil?: boolean;
  veilInsetInline?: SpacingValue;
};

/**
 * SCROLL_PORT_ROUTED_PADDING_PROP_NAMES — хранит имена padding-пропсов, которые уходят
 * во вьюпорт и желоб и не должны попадать в `getLayoutStyles` корня.
 */
const SCROLL_PORT_ROUTED_PADDING_PROP_NAMES = new Set<string>([
  'padding',
  'paddingBlock',
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingInline',
  'paddingInlineEnd',
  'paddingInlineStart',
]);

/**
 * SCROLL_PORT_ROOT_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации
 * корня ScrollPort.
 */
const SCROLL_PORT_ROOT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'gutterInlineEnd',
  'showVeil',
  'veilInsetInline',
]);

/**
 * DEFAULT_SCROLL_PORT_PADDING_INLINE_END — задаёт отступ inline-end и желоб по умолчанию.
 * Используется, когда вызывающий код не передал проп `paddingInlineEnd`, `paddingInline`
 * или `padding`.
 */
export const DEFAULT_SCROLL_PORT_PADDING_INLINE_END: SpacingValue = 16;

/**
 * DEFAULT_SCROLL_PORT_PADDING_INLINE_START — задаёт отступ inline-start вьюпорта по умолчанию.
 * Используется, когда вызывающий код не передал проп `paddingInlineStart`.
 */
const DEFAULT_SCROLL_PORT_PADDING_INLINE_START: SpacingValue = 4;

/**
 * DEFAULT_SCROLL_PORT_PADDING_BLOCK_START — задаёт отступ block-start вьюпорта по умолчанию.
 * Используется, когда вызывающий код не передал проп `paddingBlockStart`.
 */
const DEFAULT_SCROLL_PORT_PADDING_BLOCK_START: SpacingValue = 0;

/**
 * DEFAULT_SCROLL_PORT_PADDING_BLOCK_END — задаёт отступ block-end вьюпорта по умолчанию.
 * Запас под тень задаёт вызывающий код через `paddingBlockEnd` или `paddingBlock`.
 */
const DEFAULT_SCROLL_PORT_PADDING_BLOCK_END: SpacingValue = 0;

/**
 * DEFAULT_SCROLL_PORT_SHOW_VEIL — задаёт видимость вуали по умолчанию.
 * Используется, когда вызывающий код не передал проп `showVeil`.
 */
export const DEFAULT_SCROLL_PORT_SHOW_VEIL = true;

/**
 * resolveScrollPortPaddingEdge — вычисляет отступ края вьюпорта с каскадом шорткатов
 * layout: сторона → ось → `padding` → дефолт края.
 *
 * @param props spacing-пропсы ScrollPort
 * @param edge край вьюпорта
 * @returns значение шкалы отступов
 */
export function resolveScrollPortPaddingEdge(
  props: SpacingProps,
  edge: 'blockEnd' | 'blockStart' | 'inlineEnd' | 'inlineStart'
): SpacingValue {
  if (edge === 'blockStart') {
    return (
      props.paddingBlockStart ??
      props.paddingBlock ??
      props.padding ??
      DEFAULT_SCROLL_PORT_PADDING_BLOCK_START
    );
  }

  if (edge === 'blockEnd') {
    return (
      props.paddingBlockEnd ??
      props.paddingBlock ??
      props.padding ??
      DEFAULT_SCROLL_PORT_PADDING_BLOCK_END
    );
  }

  if (edge === 'inlineStart') {
    return (
      props.paddingInlineStart ??
      props.paddingInline ??
      props.padding ??
      DEFAULT_SCROLL_PORT_PADDING_INLINE_START
    );
  }

  return (
    props.paddingInlineEnd ??
    props.paddingInline ??
    props.padding ??
    DEFAULT_SCROLL_PORT_PADDING_INLINE_END
  );
}

/**
 * omitScrollPortRoutedPaddingProps — убирает padding-пропсы, маршрутизируемые во вьюпорт,
 * чтобы `getLayoutStyles` корня не писал их на корневой узел.
 *
 * @param props layout-пропсы ScrollPort
 * @returns layout без маршрутизируемых padding-пропсов
 */
export function omitScrollPortRoutedPaddingProps(props: LayoutProps): LayoutProps {
  const rootLayoutProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (!SCROLL_PORT_ROUTED_PADDING_PROP_NAMES.has(key)) {
      rootLayoutProps[key] = value;
    }
  }

  return rootLayoutProps as LayoutProps;
}

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
 * 2. При `showVeil` задаёт геометрию вуалей. Видимость краёв включает
 *    `src/ui/scroll-port/index.tsx` через `data-veil-block-start` и
 *    `data-veil-block-end` по скроллу
 * 3. При `veilInsetInline` равном `0` пишет `inset-inline` без `calc`: часть
 *    движков отбрасывает `calc(0 * -1)`, и абсолютная вуаль схлопывается
 *
 * @param props пропсы стилизации корня ScrollPort
 * @returns CSS-правила, каждое с новой строки
 */
function getScrollPortRootStyles(props: ScrollPortRootStyleProps): string {
  const {
    gutterInlineEnd,
    showVeil = DEFAULT_SCROLL_PORT_SHOW_VEIL,
    veilInsetInline = DEFAULT_SCROLL_PORT_VEIL_INSET_INLINE,
  } = props;

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
    const gutter = getSpacingValue(gutterInlineEnd);

    styles.push(`
      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 2;
        block-size: ${getSpacingValue(VEIL_BLOCK_SIZE)};
        pointer-events: none;
        opacity: 0;
        inset-inline: ${
          veilInsetInline === 0
            ? `0 ${gutter}`
            : `calc(${getSpacingValue(veilInsetInline)} * -1) calc(${gutter} - ${getSpacingValue(veilInsetInline)})`
        };
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

      &[data-veil-block-start='true']::before {
        opacity: 1;
      }

      &[data-veil-block-end='true']::after {
        opacity: 1;
      }
    `);
  }

  return styles.join('\n');
}

/**
 * StyledScrollPortRoot — задаёт корневой узел компонента ScrollPort.
 * Базируется на `<div>` и поддерживает layout-пропсы без маршрутизируемых `padding*`
 * и пропсы корня.
 *
 * Генерация стилей:
 *  - `getScrollPortRootStyles` — раскладка, смещение трека скроллбара и градиентные вуали
 *  - `getLayoutStyles` — позиционирование, размеры и margin без отступов вьюпорта
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
 *
 * @property paddingBlockEnd — отступ снизу перед прокручиваемым контентом
 * @property paddingBlockStart — отступ сверху перед прокручиваемым контентом
 * @property paddingInlineEnd — отступ inline-end содержимого вьюпорта
 * @property paddingInlineStart — отступ inline-start содержимого вьюпорта
 */
type ScrollPortViewportStyleProps = {
  paddingBlockEnd: SpacingValue;
  paddingBlockStart: SpacingValue;
  paddingInlineEnd: SpacingValue;
  paddingInlineStart: SpacingValue;
};

/**
 * SCROLL_PORT_VIEWPORT_PROP_NAMES — хранит имена пропсов вьюпорта ScrollPort
 * из `ScrollPortViewportStyleProps`.
 */
const SCROLL_PORT_VIEWPORT_PROP_NAMES = new Set<string>([
  'paddingBlockEnd',
  'paddingBlockStart',
  'paddingInlineEnd',
  'paddingInlineStart',
]);

/**
 * getScrollPortViewportStyles — возвращает CSS-правила для узла `StyledScrollPortViewport`:
 * прокрутку, отступы содержимого и стиль трека скроллбара.
 *
 * @param props пропсы стилизации вьюпорта ScrollPort
 * @returns CSS-правила, каждое с новой строки
 */
function getScrollPortViewportStyles(props: ScrollPortViewportStyleProps): string {
  const { paddingBlockEnd, paddingBlockStart, paddingInlineEnd, paddingInlineStart } =
    props;

  const styles = [
    'block-size: 100%;',
    'min-block-size: 0;',
    'min-inline-size: 0;',
    'overflow: auto;',
    'overscroll-behavior: contain;',
    `padding-inline: ${getSpacingValue(paddingInlineStart)} ${getSpacingValue(paddingInlineEnd)};`,
    `padding-block-start: ${getSpacingValue(paddingBlockStart)};`,
    `padding-block-end: ${getSpacingValue(paddingBlockEnd)};`,
    `&::-webkit-scrollbar-track { margin-block-end: ${getSpacingValue(4)}; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledScrollPortViewport — задаёт вьюпорт прокрутки компонента ScrollPort.
 * Базируется на `<div>` и принимает итоговые значения `padding*`.
 *
 * Генерация стилей:
 *  - `getScrollPortViewportStyles` — прокрутку, отступы содержимого и стиль трека скроллбара
 */
export const StyledScrollPortViewport = styled.div.withConfig({
  shouldForwardProp: (prop) => !SCROLL_PORT_VIEWPORT_PROP_NAMES.has(prop),
})<ScrollPortViewportStyleProps>`
  ${(props) => getScrollPortViewportStyles(props)}
`;
