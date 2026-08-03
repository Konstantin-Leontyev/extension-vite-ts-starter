/**
 * Файл: `src/ui/date-range-input/calendar-panel/calendar-panel.styles.ts`
 * Определяет внешний вид компонента CalendarPanel.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CalendarPanelStyleProps`
 * 2. Хранить минимальные размеры подсветки дня в `calendarDayHighlightMinBlockSize`,
 *    потолок квадрата стрелки в `calendarNavButtonMaxSize` и глиф без паддинга в
 *    `calendarNavGlyphSize`
 * 3. Предоставить функции `getCalendarNavGlyphSize` и `getCalendarPanelTextSize`
 * 4. Предоставить styled-узлы `StyledCalendarPanelRoot`, `StyledCalendarHeader`,
 *    `StyledCalendarNavButton`, `StyledCalendarMonthTitle`, `StyledCalendarWeekdayRow`,
 *    `StyledCalendarWeekdayCell`, `StyledCalendarGrid` и `StyledCalendarDayButton`
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — собирает CalendarPanel
 */

import styled from 'styled-components';

import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { resolveColorMix } from '@ui/tones';

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
 * @param sizePreset размер панели
 * @returns значение для CSS-свойства размера подсветки
 */
function getCalendarDayHighlightMinBlockSize(sizePreset: SizePreset): string {
  return getSpacingValue(calendarDayHighlightMinBlockSize[sizePreset]);
}

/**
 * getCalendarDayHighlightMaxSize — возвращает верхнюю границу размера подсветки дня.
 * Ограничивает квадрат подсветки ячейкой с учётом зазора сетки.
 *
 * @param sizePreset размер панели
 * @returns значение для CSS-свойств `inline-size` и `max-block-size` подсветки
 */
function getCalendarDayHighlightMaxSize(sizePreset: SizePreset): string {
  return `min(${getCalendarDayHighlightMinBlockSize(sizePreset)}, calc(100% + ${CALENDAR_DAY_GRID_GAP} - 1px))`;
}

/**
 * resolveCalendarDayHighlightRadius — возвращает скругление подсветки дня.
 *
 * @param dayShape форма подсветки
 * @param sizePreset размер панели
 * @returns значение для CSS-свойства `border-radius` псевдоэлемента подсветки
 */
function resolveCalendarDayHighlightRadius(
  dayShape: ShapePreset,
  sizePreset: SizePreset
): string {
  return resolveBlockRadius(dayShape, getCalendarDayHighlightMinBlockSize(sizePreset));
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
 * @param sizePreset размер панели
 * @returns значение для CSS-свойств `max-inline-size` и `max-block-size`
 */
function getCalendarNavButtonMaxSize(sizePreset: SizePreset): string {
  return getSpacingValue(calendarNavButtonMaxSize[sizePreset]);
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
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
const DEFAULT_CALENDAR_PANEL_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;

/**
 * getCalendarNavGlyphSize — возвращает CSS-сторону глифа стрелки без паддинга.
 * Подставляет `DEFAULT_CALENDAR_PANEL_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер панели календаря
 * @returns значение для CSS-свойств `inline-size` и `block-size` окна Icon
 */
export function getCalendarNavGlyphSize(sizePreset?: SizePreset): string {
  return getSpacingValue(
    calendarNavGlyphSize[sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET]
  );
}

/**
 * getCalendarPanelTextSize — возвращает размер текста дня и заголовка по `sizePreset`.
 * Подставляет `DEFAULT_CALENDAR_PANEL_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер панели календаря
 * @returns метка размера текста из `TextSizePreset` для дня и заголовка месяца
 */
export function getCalendarPanelTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET);
}

/**
 * CalendarPanelStyleProps — представляет пропсы стилизации CalendarPanel.
 *
 * @property dayShape — форма подсветки дня
 * @property shape — форма кнопок навигации
 * @property sizePreset — размер панели
 */
export type CalendarPanelStyleProps = {
  dayShape?: ShapePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

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
 * Базируется на `<div>`.
 *
 * Генерация стилей:
 *  - `getCalendarPanelRootStyles` — раскладка, зазор и ширина
 */
export const StyledCalendarPanelRoot = styled.div`
  ${getCalendarPanelRootStyles()}
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
 *  - `min-inline-size: 0` — шапка не раздувает портал шире якоря
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
 * @property sizePreset — размер кнопки
 */
type CalendarNavButtonStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * CALENDAR_NAV_BUTTON_PROP_NAMES — хранит имена пропсов стилизации кнопки навигации.
 */
const CALENDAR_NAV_BUTTON_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * getCalendarNavButtonStyles — возвращает CSS-правила для узла
 * `StyledCalendarNavButton`: квадрат не шире колонки и не выше потолка из
 * `calendarNavButtonMaxSize`, цвет, радиус и наведение. Глиф Icon задаёт JSX
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
  const sizePreset = props.sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET;
  const maxSize = getCalendarNavButtonMaxSize(sizePreset);
  const size = `min(100%, ${maxSize})`;

  return `
    display: grid;
    place-items: center;
    justify-self: center;
    inline-size: ${size};
    aspect-ratio: 1;
    max-block-size: ${maxSize};
    color: ${theme.colors.default};
    border-radius: ${resolveBlockRadius(shape, maxSize)};
    &:not(:disabled):hover { background-color: ${theme.colors.veil}; }
  `;
}

/**
 * StyledCalendarNavButton — задаёт кнопку навигации по месяцам и годам
 * компонента CalendarPanel.
 * Базируется на `<button>` и принимает пропсы из `CalendarNavButtonStyleProps`.
 *
 * Генерация стилей:
 *  - `getCalendarNavButtonStyles` — квадрат по колонке с потолком модуля и наведение
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
 *  - `display: grid` — семь равных колонок
 *  - `grid-template-columns: repeat(7, minmax(0, 1fr))` — колонки сжимаются без переполнения
 *  - `inline-size: 100%` — занимает ширину панели
 *  - `min-inline-size: 0` — предотвращает переполнение
 */
export const StyledCalendarWeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  inline-size: 100%;
  min-inline-size: 0;
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
 * @property sizePreset — размер кнопки дня
 */
type CalendarDayButtonStyleProps = {
  dayShape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * CALENDAR_DAY_BUTTON_PROP_NAMES — хранит имена пропсов стилизации кнопки дня.
 */
const CALENDAR_DAY_BUTTON_PROP_NAMES = new Set<string>(['dayShape', 'sizePreset']);

/**
 * getCalendarDayButtonStyles — возвращает CSS-правила для узла
 * `StyledCalendarDayButton`: раскладку ячейки, псевдоэлемент подсветки и состояния
 * выбора, диапазона, прошлого соседнего месяца и неактивных дней. Недоступные
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
  const sizePreset = props.sizePreset ?? DEFAULT_CALENDAR_PANEL_SIZE_PRESET;
  const highlightMaxSize = getCalendarDayHighlightMaxSize(sizePreset);
  const highlightRadius = resolveCalendarDayHighlightRadius(dayShape, sizePreset);

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
      border: 1px solid transparent;
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
    &:not(:disabled):hover:not([data-selected='true'])::before {
      background-color: transparent;
      border-color: ${theme.colors.primary};
      opacity: 1;
    }
    &[data-selected='true']:not(:disabled):hover::before {
      background-color: ${resolveColorMix(theme.colors.primary, theme.colors.shade)};
      opacity: 1;
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
 * на выбранный день смешивает заливку с `shade`, дни внутри диапазона — нейтральный
 * фон, наведение на невыбранный день обводит `primary`.
 */
export const StyledCalendarDayButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !CALENDAR_DAY_BUTTON_PROP_NAMES.has(prop),
})<CalendarDayButtonStyleProps>`
  ${(props) => getCalendarDayButtonStyles(props)}
`;
