/**
 * Файл: `src/ui/date-range-input/calendar-panel/day.ts`
 * Содержит утилиты дат и построения сетки месяца для панели календаря.
 *
 * Основные задачи:
 * 1. Типизировать вид месяца через `MonthView`
 * 2. Предоставить константы `DATE_PLACEHOLDER` и `WEEKDAY_LABELS`
 * 3. Предоставить `todayUtc`, `formatIsoDayCompact`, `isIsoDayAfter`,
 *    `isIsoDayBetweenRange` и `isIsoDayInBounds`
 * 4. Предоставить `monthViewFromIsoDayOrToday`, `addMonths`, `addYears`,
 *    `formatMonthTitle`, `buildMonthGrid`, `canNavigateMonthPrevious`,
 *    `canNavigateMonthNext`, `canNavigateYearPrevious` и `canNavigateYearNext`
 *
 * Потребители:
 *  - `src/ui/date-range-input/calendar-panel/index.tsx` — собирает сетку, навигацию
 *    и реэкспортирует публичные утилиты
 */

/**
 * DATE_PLACEHOLDER — задаёт плейсхолдер пустого поля даты в формате ДД.ММ.ГГ.
 * Используется в триггерах DateRangeInput при пустом значении.
 */
export const DATE_PLACEHOLDER = 'ДД.ММ.ГГ';

/**
 * IsoDayParts — представляет разобранный календарный день.
 *
 * @property day — номер дня месяца
 * @property month — номер месяца от `1` до `12`
 * @property year — год
 */
type IsoDayParts = {
  day: number;
  month: number;
  year: number;
};

/**
 * MonthView — представляет отображаемый месяц панели календаря.
 *
 * @property month — номер месяца от `1` до `12`
 * @property year — год
 */
export type MonthView = {
  month: number;
  year: number;
};

/**
 * FALLBACK_MONTH_VIEW — задаёт запасной вид месяца при неразбираемой дате.
 * Используется в `monthViewFromIsoDayOrToday`, когда ISO-день и запасной день
 * не разбираются.
 */
const FALLBACK_MONTH_VIEW: MonthView = { month: 1, year: 1970 };

/**
 * todayUtc — возвращает сегодняшнюю дату UTC в формате ISO.
 *
 * @returns день в формате `YYYY-MM-DD`
 */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * formatIsoDayCompact — преобразует ISO-день в компактную подпись ДД.ММ.ГГ.
 * При неразбираемой строке возвращает исходное значение без изменений.
 *
 * @param isoDay день в формате ISO
 * @returns компактная дата для подписи в триггере
 */
export function formatIsoDayCompact(isoDay: string): string {
  const parts = parseIsoDay(isoDay);

  if (parts == null) {
    return isoDay;
  }

  const day = String(parts.day).padStart(2, '0');
  const month = String(parts.month).padStart(2, '0');
  const year = String(parts.year).slice(2);

  return `${day}.${month}.${year}`;
}

/**
 * parseIsoDay — принимает строку ISO и возвращает разобранный день или `null`.
 *
 * @param isoDay день в формате `YYYY-MM-DD`
 * @returns части дня или `null` при неверном формате
 */
function parseIsoDay(isoDay: string): IsoDayParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDay);

  if (match == null) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return { day, month, year };
}

/**
 * toIsoDay — принимает части дня и возвращает строку в формате ISO.
 *
 * @param parts разобранный календарный день
 * @returns день в формате `YYYY-MM-DD`
 */
function toIsoDay(parts: IsoDayParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');

  return `${parts.year}-${month}-${day}`;
}

/**
 * compareIsoDays — возвращает результат лексикографического сравнения двух ISO-дней.
 *
 * @param left левый день в формате ISO
 * @param right правый день в формате ISO
 * @returns отрицательное число, ноль или положительное число как у `localeCompare`
 */
function compareIsoDays(left: string, right: string): number {
  return left.localeCompare(right);
}

/**
 * isIsoDayBefore — возвращает признак, что левый день строго раньше правого.
 *
 * @param left левый день в формате ISO
 * @param right правый день в формате ISO
 * @returns `true`, когда `left` раньше `right`
 */
function isIsoDayBefore(left: string, right: string): boolean {
  return compareIsoDays(left, right) < 0;
}

/**
 * isIsoDayAfter — возвращает признак, что левый день строго позже правого.
 *
 * @param left левый день в формате ISO
 * @param right правый день в формате ISO
 * @returns `true`, когда `left` позже `right`
 */
export function isIsoDayAfter(left: string, right: string): boolean {
  return compareIsoDays(left, right) > 0;
}

/**
 * isIsoDayBetweenRange — возвращает признак, что день лежит строго внутри диапазона.
 * Границы `rangeStart` и `rangeEnd` в результат не входят. Порядок границ не важен.
 *
 * @param isoDay проверяемый день в формате ISO
 * @param rangeStart одна граница диапазона
 * @param rangeEnd другая граница диапазона
 * @returns `true`, когда день строго между границами
 */
export function isIsoDayBetweenRange(
  isoDay: string,
  rangeStart: string,
  rangeEnd: string
): boolean {
  const rangeStartDay =
    compareIsoDays(rangeStart, rangeEnd) <= 0 ? rangeStart : rangeEnd;
  const rangeEndDay = compareIsoDays(rangeStart, rangeEnd) <= 0 ? rangeEnd : rangeStart;

  return (
    compareIsoDays(isoDay, rangeStartDay) > 0 && compareIsoDays(isoDay, rangeEndDay) < 0
  );
}

/**
 * isIsoDayInBounds — возвращает признак, что день входит в необязательные границы.
 * Пустая или отсутствующая граница не ограничивает день с этой стороны.
 *
 * @param isoDay проверяемый день в формате ISO
 * @param minDay нижняя граница включительно
 * @param maxDay верхняя граница включительно
 * @returns `true`, когда день допустим
 */
export function isIsoDayInBounds(
  isoDay: string,
  minDay?: string,
  maxDay?: string
): boolean {
  if (minDay != null && minDay !== '' && isIsoDayBefore(isoDay, minDay)) {
    return false;
  }

  if (maxDay != null && maxDay !== '' && isIsoDayAfter(isoDay, maxDay)) {
    return false;
  }

  return true;
}

/**
 * monthViewFromIsoDay — возвращает вид месяца по ISO-дню или `null`.
 *
 * @param isoDay день в формате ISO
 * @returns вид месяца или `null` при неразбираемой строке
 */
function monthViewFromIsoDay(isoDay: string): MonthView | null {
  const parts = parseIsoDay(isoDay);

  if (parts == null) {
    return null;
  }

  return { month: parts.month, year: parts.year };
}

/**
 * monthViewFromIsoDayOrToday — возвращает вид месяца по ISO-дню с запасными вариантами.
 *
 * Как работает:
 * 1. Без валидного `isoDay` выбирает запасной день: при заданном `maxDay`, если
 *    сегодня UTC выходит за эту границу — берёт `maxDay`, иначе сегодня UTC
 * 2. Разбирает выбранный день в вид месяца
 * 3. При ошибке разбора повторяет разбор запасного дня и при неудаче отдаёт
 *    `FALLBACK_MONTH_VIEW`
 *
 * @param isoDay день в формате ISO или пустое значение
 * @param maxDay верхняя граница для выбора запасного дня
 * @returns вид месяца для открытия панели
 */
export function monthViewFromIsoDayOrToday(
  isoDay: string | undefined,
  maxDay?: string
): MonthView {
  const fallbackDay =
    maxDay != null && maxDay !== '' && !isIsoDayInBounds(todayUtc(), undefined, maxDay)
      ? maxDay
      : todayUtc();
  const sourceDay = isoDay != null && isoDay !== '' ? isoDay : fallbackDay;
  const view = monthViewFromIsoDay(sourceDay);

  if (view != null) {
    return view;
  }

  return monthViewFromIsoDay(fallbackDay) ?? FALLBACK_MONTH_VIEW;
}

/**
 * addMonths — возвращает вид месяца со сдвигом на число месяцев.
 *
 * @param view исходный вид месяца
 * @param delta сдвиг в месяцах, отрицательный — назад
 * @returns новый вид месяца
 */
export function addMonths(view: MonthView, delta: number): MonthView {
  const date = new Date(Date.UTC(view.year, view.month - 1 + delta, 1));

  return {
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

/**
 * addYears — возвращает вид месяца со сдвигом на число лет.
 * Номер месяца сохраняется.
 *
 * @param view исходный вид месяца
 * @param delta сдвиг в годах, отрицательный — назад
 * @returns новый вид месяца
 */
export function addYears(view: MonthView, delta: number): MonthView {
  return {
    month: view.month,
    year: view.year + delta,
  };
}

/**
 * daysInMonth — возвращает число дней в месяце вида.
 *
 * @param view вид месяца
 * @returns число дней
 */
function daysInMonth(view: MonthView): number {
  return new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
}

/**
 * weekdayMondayFirst — возвращает индекс дня недели при старте недели с понедельника.
 * Понедельник — `0`, воскресенье — `6`.
 *
 * @param view вид месяца
 * @param day номер дня месяца
 * @returns индекс колонки сетки от `0` до `6`
 */
function weekdayMondayFirst(view: MonthView, day: number): number {
  const weekday = new Date(Date.UTC(view.year, view.month - 1, day)).getUTCDay();

  return weekday === 0 ? 6 : weekday - 1;
}

/**
 * formatMonthName — возвращает локализованное имя месяца для шапки панели.
 *
 * @param view вид месяца
 * @returns строка вида «июль» в локали `ru-RU`
 */
function formatMonthName(view: MonthView): string {
  const date = new Date(Date.UTC(view.year, view.month - 1, 1));

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * formatMonthTitle — возвращает локализованный заголовок месяца и года одной строкой.
 * Год без суффикса «г.»: в `ru-RU` он занимает место в узкой шапке, а из контекста
 * панели и так ясно, что число — год.
 *
 * @param view вид месяца
 * @returns строка вида «июль 2026» в локали `ru-RU`
 */
export function formatMonthTitle(view: MonthView): string {
  return `${formatMonthName(view)} ${view.year}`;
}

/**
 * WEEKDAY_LABELS — задаёт подписи дней недели для шапки сетки.
 * Порядок — с понедельника по воскресенье.
 */
export const WEEKDAY_LABELS = Object.freeze([
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Вс',
] as const);

/**
 * CalendarCell — представляет ячейку сетки месяца.
 *
 * @property day — номер дня месяца в ячейке
 * @property isoDay — день ячейки в формате ISO
 * @property kind — принадлежность к текущему или соседнему месяцу
 */
type CalendarCell =
  | {
      day: number;
      isoDay: string;
      kind: 'adjacent-month';
    }
  | {
      day: number;
      isoDay: string;
      kind: 'current-month';
    };

/**
 * buildMonthGrid — возвращает плоскую сетку дней месяца с соседними днями по краям.
 *
 * Как работает:
 * 1. Считает число дней месяца и число пустых ячеек до первого дня
 * 2. Заполняет ведущие ячейки днями предыдущего месяца
 * 3. Добавляет дни текущего месяца
 * 4. Добивает хвост днями следующего месяца до кратности семи
 *
 * @param view вид месяца
 * @returns ячейки сетки построчно слева направо
 */
export function buildMonthGrid(view: MonthView): CalendarCell[] {
  const totalDays = daysInMonth(view);
  const leadingEmpty = weekdayMondayFirst(view, 1);
  const cells: CalendarCell[] = [];

  if (leadingEmpty > 0) {
    const previousView = addMonths(view, -1);
    const previousMonthDays = daysInMonth(previousView);

    for (let index = leadingEmpty - 1; index >= 0; index -= 1) {
      const day = previousMonthDays - index;

      cells.push({
        day,
        isoDay: toIsoDay({ day, month: previousView.month, year: previousView.year }),
        kind: 'adjacent-month',
      });
    }
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({
      day,
      isoDay: toIsoDay({ day, month: view.month, year: view.year }),
      kind: 'current-month',
    });
  }

  let trailingDay = 1;
  const nextView = addMonths(view, 1);

  while (cells.length % 7 !== 0) {
    cells.push({
      day: trailingDay,
      isoDay: toIsoDay({ day: trailingDay, month: nextView.month, year: nextView.year }),
      kind: 'adjacent-month',
    });
    trailingDay += 1;
  }

  return cells;
}

/**
 * canNavigateMonthPrevious — возвращает признак, что переход на предыдущий месяц допустим.
 * Без `minDay` переход всегда разрешён.
 *
 * @param view текущий вид месяца
 * @param minDay нижняя граница допустимых дней
 * @returns `true`, когда предыдущий месяц ещё пересекается с допустимым диапазоном
 */
export function canNavigateMonthPrevious(view: MonthView, minDay?: string): boolean {
  if (minDay == null || minDay === '') {
    return true;
  }

  const previousView = addMonths(view, -1);
  const lastDay = daysInMonth(previousView);

  return !isIsoDayBefore(
    toIsoDay({ day: lastDay, month: previousView.month, year: previousView.year }),
    minDay
  );
}

/**
 * canNavigateMonthNext — возвращает признак, что переход на следующий месяц допустим.
 * Без `maxDay` переход всегда разрешён.
 *
 * @param view текущий вид месяца
 * @param maxDay верхняя граница допустимых дней
 * @returns `true`, когда следующий месяц ещё пересекается с допустимым диапазоном
 */
export function canNavigateMonthNext(view: MonthView, maxDay?: string): boolean {
  if (maxDay == null || maxDay === '') {
    return true;
  }

  const nextView = addMonths(view, 1);

  return !isIsoDayAfter(
    toIsoDay({ day: 1, month: nextView.month, year: nextView.year }),
    maxDay
  );
}

/**
 * canNavigateYearPrevious — возвращает признак, что переход на предыдущий год допустим.
 * Без `minDay` переход всегда разрешён. Номер месяца сохраняется.
 *
 * @param view текущий вид месяца
 * @param minDay нижняя граница допустимых дней
 * @returns `true`, когда предыдущий год ещё пересекается с допустимым диапазоном
 */
export function canNavigateYearPrevious(view: MonthView, minDay?: string): boolean {
  if (minDay == null || minDay === '') {
    return true;
  }

  const previousView = addYears(view, -1);
  const lastDay = daysInMonth(previousView);

  return !isIsoDayBefore(
    toIsoDay({ day: lastDay, month: previousView.month, year: previousView.year }),
    minDay
  );
}

/**
 * canNavigateYearNext — возвращает признак, что переход на следующий год допустим.
 * Без `maxDay` переход всегда разрешён. Номер месяца сохраняется.
 *
 * @param view текущий вид месяца
 * @param maxDay верхняя граница допустимых дней
 * @returns `true`, когда следующий год ещё пересекается с допустимым диапазоном
 */
export function canNavigateYearNext(view: MonthView, maxDay?: string): boolean {
  if (maxDay == null || maxDay === '') {
    return true;
  }

  const nextView = addYears(view, 1);

  return !isIsoDayAfter(
    toIsoDay({ day: 1, month: nextView.month, year: nextView.year }),
    maxDay
  );
}
