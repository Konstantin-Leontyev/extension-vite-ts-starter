/**
 * Файл: `src/ui/date-range-input/calendar-panel/calendar-panel.styles.ts`
 * Определяет внешний вид компонента CalendarPanel.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CalendarPanelStyleProps`
 * 2. Хранить минимальные размеры подсветки дня в `calendarDayHighlightMinBlockSize`,
 *    потолок квадрата стрелки в `calendarNavButtonMaxSize` и глиф без паддинга в
 *    `calendarNavGlyphSize`
 * 3. Предоставить функцию `getCalendarNavGlyphSize`, а также дефолт `DEFAULT_CALENDAR_PANEL_SIZE_PRESET`
 * 4. Предоставить styled-узлы `StyledCalendarPanelRoot`, `StyledCalendarHeader`,
 *    `StyledCalendarNavButton`, `StyledCalendarMonthTitle`, `StyledCalendarWeekdayRow`,
 *    `StyledCalendarWeekdayCell`, `StyledCalendarWeekRow`, `StyledCalendarDayCell`,
 *    `StyledCalendarGrid` и `StyledCalendarDayButton`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — собирает CalendarPanel
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, resolvePressedBackground } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * CALENDAR_DAY_GRID_GAP — задаёт зазор сетки дней и шапки в rem.
 * Один зазор у шапки и у `StyledCalendarGrid`, чтобы колонки совпадали.
 */
const CALENDAR_DAY_GRID_GAP = getSpacingValue(4);

/**
 * calendarDayHighlightMinBlockSize — хранит минимальный размер подсветки дня
 * для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 */
const calendarDayHighlightMinBlockSize = {
  small: 24,
  normal: 28,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getCalendarDayHighlightMinBlockSize — возвращает минимальный размер подсветки дня.
 *
 * @param size размер панели
 * @returns значение для CSS-свойства размера подсветки
 */
function getCalendarDayHighlightMinBlockSize(size: SizePreset): string {
  return getSpacingValue(calendarDayHighlightMinBlockSize[size]);
}

/**
 * getCalendarDayHighlightMaxSize — возвращает верхнюю границу размера подсветки дня.
 * Ограничивает квадрат подсветки ячейкой с учётом зазора сетки.
 *
 * @param size размер панели
 * @returns значение для CSS-свойств `inline-size` и `max-block-size` подсветки
 */
function getCalendarDayHighlightMaxSize(size: SizePreset): string {
  return `min(${getCalendarDayHighlightMinBlockSize(size)}, calc(100% + ${CALENDAR_DAY_GRID_GAP} - 1px))`;
}

/**
 * resolveCalendarDayHighlightRadius — возвращает скругление подсветки дня.
 *
 * @param dayShape форма подсветки
 * @param size размер панели
 * @returns значение для CSS-свойства `border-radius` псевдоэлемента подсветки
 */
function resolveCalendarDayHighlightRadius(
  dayShape: ShapePreset,
  size: SizePreset
): string {
  return resolveBlockRadius(dayShape, getCalendarDayHighlightMinBlockSize(size));
}

/**
 * calendarNavButtonMaxSize — хранит потолок квадрата стрелки шапки.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Квадрат не шире колонки сетки и не больше этого потолка.
 */
const calendarNavButtonMaxSize = {
  small: 24,
  normal: 32,
  large: 40,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getCalendarNavButtonMaxSize — возвращает потолок квадрата стрелки шапки.
 *
 * @param size размер панели
 * @returns значение для CSS-свойств `max-inline-size` и `max-block-size`
 */
function getCalendarNavButtonMaxSize(size: SizePreset): string {
  return getSpacingValue(calendarNavButtonMaxSize[size]);
}

/**
 * calendarNavGlyphSize — хранит сторону глифа стрелки без паддинга Icon.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Компактный ряд экономит место строки под заголовок месяца.
 */
const calendarNavGlyphSize = {
  small: 16,
  normal: 24,
  large: 32,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * DEFAULT_CALENDAR_PANEL_SIZE_PRESET — задаёт размер CalendarPanel по умолчанию.
 * Используется, когда вызывающий код не передал проп `size`.
 */
export const DEFAULT_CALENDAR_PANEL_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;

/**
 * getCalendarNavGlyphSize — возвращает CSS-сторону глифа стрелки без паддинга.
 * Подставляет `DEFAULT_CALENDAR_PANEL_SIZE_PRESET`, когда размер не задан.
 *
 * @param size размер панели календаря
 * @returns значение для CSS-свойств `inline-size` и `block-size` окна Icon
 */
export function getCalendarNavGlyphSize(size?: SizePreset): string {
  return getSpacingValue(
    calendarNavGlyphSize[size ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET]
  );
}

/**
 * CalendarPanelSurfaceStyleProps — представляет пропсы стилизации поверхности CalendarPanel.
 *
 * @property dayShape — форма подсветки дня
 * @property shape — форма кнопок навигации
 * @property size — размер панели
 */
type CalendarPanelSurfaceStyleProps = {
  dayShape?: ShapePreset;
  shape?: ShapePreset;
  size?: SizePreset;
};

/**
 * CalendarPanelStyleProps — представляет пропсы стилизации CalendarPanel и layout-пропсы.
 */
export type CalendarPanelStyleProps = LayoutProps & CalendarPanelSurfaceStyleProps;

/**
 * DEFAULT_CALENDAR_PANEL_SHAPE — задаёт форму CalendarPanel по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape` или `dayShape`.
 */
const DEFAULT_CALENDAR_PANEL_SHAPE: ShapePreset = DEFAULT_SHAPE_PRESET;

/**
 * getCalendarPanelRootStyles — возвращает CSS-правила для корня `StyledCalendarPanelRoot`:
 * раскладку, зазор и ширину панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getCalendarPanelRootStyles(): string {
  return `
    display: grid;
    gap: ${getSpacingValue(8)};
    inline-size: 100%;
    min-inline-size: 0;
  `;
}

/**
 * StyledCalendarPanelRoot — задаёт корневой узел компонента CalendarPanel.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getCalendarPanelRootStyles` — раскладка, зазор и ширина
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledCalendarPanelRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getCalendarPanelRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledCalendarHeader — задаёт шапку с навигацией компонента CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — семь колонок, как у сетки дней
 *  - `grid-template-columns: repeat(7, minmax(0, 1fr))` — стрелки в 1–2 и 6–7,
 *    заголовок месяца на колонки 3–5
 *  - `gap` — тот же `CALENDAR_DAY_GRID_GAP`, что у дней
 *  - `align-items: center` — вертикальное выравнивание ряда
 *  - `min-inline-size: 0` — шапка не раздувает панель шире якоря
 */
export const StyledCalendarHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${CALENDAR_DAY_GRID_GAP};
  align-items: center;
  min-inline-size: 0;
`;

/**
 * CalendarNavButtonStyleProps — представляет пропсы стилизации кнопки навигации.
 *
 * @property shape — форма кнопки
 * @property size — размер кнопки
 */
type CalendarNavButtonStyleProps = {
  shape?: ShapePreset;
  size?: SizePreset;
};

/**
 * CALENDAR_NAV_BUTTON_PROP_NAMES — хранит имена пропсов стилизации кнопки навигации.
 */
const CALENDAR_NAV_BUTTON_PROP_NAMES = new Set<string>(['shape', 'size']);

/**
 * getCalendarNavButtonStyles — возвращает CSS-правила для узла
 * `StyledCalendarNavButton`: квадрат не шире колонки и не выше потолка из
 * `calendarNavButtonMaxSize`, цвет, радиус, наведение и нажатие. Глиф Icon задаёт JSX
 * через `getCalendarNavGlyphSize` без паддинга.
 *
 * @param props пропсы стилизации кнопки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getCalendarNavButtonStyles(
  props: CalendarNavButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const shape = props.shape ?? DEFAULT_CALENDAR_PANEL_SHAPE;
  const size = props.size ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET;
  const maxSize = getCalendarNavButtonMaxSize(size);

  return `
    display: grid;
    place-items: center;
    justify-self: center;
    inline-size: min(100%, ${maxSize});
    aspect-ratio: 1;
    max-block-size: ${maxSize};
    color: ${theme.colors.default};
    border-radius: ${resolveBlockRadius(shape, maxSize)};
    &:not(:disabled):hover,
    &:focus-visible { background-color: ${theme.colors.veil}; }
    &:not(:disabled):active {
      background-color: ${resolvePressedBackground(theme)};
      ${getBorderStyles(theme, false, false, DEFAULT_TONE, true)}
    }
  `;
}

/**
 * StyledCalendarNavButton — задаёт кнопку навигации по месяцам и годам
 * компонента CalendarPanel.
 * Базируется на `<button>` и принимает пропсы из `CalendarNavButtonStyleProps`.
 *
 * Генерация стилей:
 *  - `getCalendarNavButtonStyles` — квадрат по колонке с потолком модуля, наведение и нажатие
 */
export const StyledCalendarNavButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !CALENDAR_NAV_BUTTON_PROP_NAMES.has(prop),
})<CalendarNavButtonStyleProps>`
  ${(props) => getCalendarNavButtonStyles(props)}
`;

/**
 * StyledCalendarMonthTitle — задаёт полосу месяца и года в шапке CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-column: 3 / span 3` — средние три колонки шапки
 *  - `min-inline-size: 0` — заголовок сжимается. Длинный текст переносится, без `ellipsis`
 */
export const StyledCalendarMonthTitle = styled.div`
  grid-column: 3 / span 3;
  min-inline-size: 0;
`;

/**
 * StyledCalendarWeekdayRow — задаёт ряд подписей дней недели компонента CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: contents` — ячейки подписей становятся прямыми детьми сетки дней,
 *    чтобы колонки совпали с кнопками дней
 */
export const StyledCalendarWeekdayRow = styled.div`
  display: contents;
`;

/**
 * getCalendarWeekdayCellStyles — возвращает CSS-правила для узла
 * `StyledCalendarWeekdayCell`: центрирование и вертикальные отступы подписи.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getCalendarWeekdayCellStyles(): string {
  return `
    display: grid;
    place-items: center;
    min-block-size: 0;
    padding-block: ${getSpacingValue(4)};
  `;
}

/**
 * StyledCalendarWeekdayCell — задаёт ячейку подписи дня недели компонента CalendarPanel.
 * Базируется на `<span>`.
 *
 * Генерация стилей:
 *  - `getCalendarWeekdayCellStyles` — центрирование и отступы
 */
export const StyledCalendarWeekdayCell = styled.span`
  ${getCalendarWeekdayCellStyles()}
`;

/**
 * StyledCalendarWeekRow — задаёт ряд недели в сетке дней компонента CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: contents` — ячейки дней становятся прямыми детьми сетки,
 *    чтобы ряд не создавал вложенную сетку
 */
export const StyledCalendarWeekRow = styled.div`
  display: contents;
`;

/**
 * StyledCalendarDayCell — задаёт ячейку дня компонента CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: contents` — кнопка дня становится прямым ребёнком сетки
 */
export const StyledCalendarDayCell = styled.div`
  display: contents;
`;

/**
 * StyledCalendarGrid — задаёт сетку дней месяца компонента CalendarPanel.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — семь колонок дней
 *  - `grid-template-columns: repeat(7, minmax(0, 1fr))` — равные колонки без переполнения
 *  - `gap` — зазор между днями из `CALENDAR_DAY_GRID_GAP`
 *  - `inline-size: 100%` — занимает ширину панели
 *  - `min-inline-size: 0` — предотвращает переполнение
 */
export const StyledCalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: ${CALENDAR_DAY_GRID_GAP};
  inline-size: 100%;
  min-inline-size: 0;
`;

/**
 * CalendarDayButtonStyleProps — представляет пропсы стилизации кнопки дня.
 *
 * @property dayShape — форма подсветки дня
 * @property size — размер кнопки дня
 */
type CalendarDayButtonStyleProps = {
  dayShape?: ShapePreset;
  size?: SizePreset;
};

/**
 * CALENDAR_DAY_BUTTON_PROP_NAMES — хранит имена пропсов стилизации кнопки дня.
 */
const CALENDAR_DAY_BUTTON_PROP_NAMES = new Set<string>(['dayShape', 'size']);

/**
 * getCalendarDayButtonStyles — возвращает CSS-правила для узла
 * `StyledCalendarDayButton`: раскладку ячейки, псевдоэлемент подсветки и состояния
 * выбора, диапазона, сегодняшнего дня, прошлого соседнего месяца и неактивных дней. Недоступные
 * дни берут `muted` и глобальный `opacity` disabled — двойное приглушение будущего.
 *
 * @param props пропсы стилизации кнопки дня и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getCalendarDayButtonStyles(
  props: CalendarDayButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const dayShape = props.dayShape ?? DEFAULT_CALENDAR_PANEL_SHAPE;
  const size = props.size ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET;
  const highlightMaxSize = getCalendarDayHighlightMaxSize(size);
  const highlightRadius = resolveCalendarDayHighlightRadius(dayShape, size);
  const pressedShadow = getBorderStyles(theme, false, false, DEFAULT_TONE, true);
  const selectedPressedBackground = resolvePressedBackground(theme, 'primary');

  return `
    position: relative;
    z-index: 0;
    display: grid;
    place-items: center;
    inline-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    padding-block: ${getSpacingValue(4)};
    color: ${theme.colors.default};
    &::before {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      z-index: -1;
      inline-size: ${highlightMaxSize};
      block-size: auto;
      max-block-size: ${highlightMaxSize};
      aspect-ratio: 1;
      pointer-events: none;
      content: '';
      border-radius: ${highlightRadius};
      opacity: 0;
      translate: -50% -50%;
    }
    &[data-in-range='true']::before {
      background-color: ${theme.colors.scrollbarThumb};
      opacity: 1;
    }
    &[data-adjacent='true']:not([data-selected='true']) {
      color: ${theme.colors.muted};
    }
    &[data-in-range='true']:not([data-selected='true']) {
      color: ${theme.colors.default};
    }
    &:disabled:not([data-selected='true']) {
      color: ${theme.colors.muted};
    }
    &[data-selected='true'] {
      color: ${theme.colors.inverse};
    }
    &[data-selected='true']::before {
      background-color: ${theme.colors.primary};
      opacity: 1;
    }
    &:not(:disabled):hover:not([data-selected='true'])::before,
    &:focus-visible:not([data-selected='true'])::before {
      background-color: ${theme.colors.veil};
      opacity: 1;
    }
    &[data-selected='true']:not(:disabled):hover::before,
    &[data-selected='true']:focus-visible::before {
      background-color: ${selectedPressedBackground};
      opacity: 1;
    }
    &:not(:disabled):active:not([data-selected='true'])::before {
      background-color: ${resolvePressedBackground(theme)};
      opacity: 1;
      ${pressedShadow}
    }
    &[data-selected='true']:not(:disabled):active::before {
      background-color: ${selectedPressedBackground};
      opacity: 1;
      ${pressedShadow}
    }
    &[data-today='true']::after {
      position: absolute;
      inset-block-end: ${getSpacingValue(2)};
      inset-inline-start: 50%;
      z-index: 1;
      inline-size: ${getSpacingValue(4)};
      block-size: ${getSpacingValue(4)};
      pointer-events: none;
      content: '';
      background-color: currentColor;
      border-radius: 50%;
      translate: -50% 0;
    }
  `;
}

/**
 * StyledCalendarDayButton — задаёт кнопку дня компонента CalendarPanel.
 * Базируется на `<button>` и принимает пропсы из `CalendarDayButtonStyleProps`.
 *
 * Генерация стилей:
 *  - `getCalendarDayButtonStyles` — раскладка, подсветка и состояния дня
 *
 * Подсветка рисуется псевдоэлементом `::before`: выбор заливает `primary`, наведение
 * и `:focus-visible` на выбранный день сдвигают заливку к `shade`, дни внутри
 * диапазона — нейтральный фон, на невыбранный день — вуаль `veil`.
 * Нажатие красит кружок заливкой нажатия и внутренней тенью.
 * Сегодняшний день помечает точка `::after`.
 */
export const StyledCalendarDayButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !CALENDAR_DAY_BUTTON_PROP_NAMES.has(prop),
})<CalendarDayButtonStyleProps>`
  ${(props) => getCalendarDayButtonStyles(props)}
`;
