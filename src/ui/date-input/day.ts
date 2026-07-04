/** Плейсхолдер пустого поля даты в формате ДД.ММ.ГГ. */
export const DATE_PLACEHOLDER = 'ДД.ММ.ГГ';

export type IsoDayParts = {
  day: number;
  month: number;
  year: number;
};

export type MonthView = {
  month: number;
  year: number;
};

/** Сегодняшняя дата UTC в формате YYYY-MM-DD. */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** ISO YYYY-MM-DD → ДД.ММ.ГГ для подписи в триггере. */
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

export function parseIsoDay(isoDay: string): IsoDayParts | null {
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

export function toIsoDay(parts: IsoDayParts): string {
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');

  return `${parts.year}-${month}-${day}`;
}

export function compareIsoDays(left: string, right: string): number {
  return left.localeCompare(right);
}

export function isIsoDayBefore(left: string, right: string): boolean {
  return compareIsoDays(left, right) < 0;
}

export function isIsoDayAfter(left: string, right: string): boolean {
  return compareIsoDays(left, right) > 0;
}

/** День строго между start и end (границы не входят). */
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

export function monthViewFromIsoDay(isoDay: string): MonthView | null {
  const parts = parseIsoDay(isoDay);

  if (parts == null) {
    return null;
  }

  return { month: parts.month, year: parts.year };
}

export function monthViewFromIsoDayOrToday(
  isoDay: string | undefined,
  maxDay?: string
): MonthView {
  const fallbackDay =
    maxDay != null && maxDay !== '' && isIsoDayInBounds(todayUtc(), undefined, maxDay)
      ? maxDay
      : todayUtc();
  const sourceDay = isoDay != null && isoDay !== '' ? isoDay : fallbackDay;
  const view = monthViewFromIsoDay(sourceDay);

  if (view != null) {
    return view;
  }

  return monthViewFromIsoDay(fallbackDay) ?? { month: 1, year: 1970 };
}

export function addMonths(view: MonthView, delta: number): MonthView {
  const date = new Date(Date.UTC(view.year, view.month - 1 + delta, 1));

  return {
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear(),
  };
}

export function daysInMonth(view: MonthView): number {
  return new Date(Date.UTC(view.year, view.month, 0)).getUTCDate();
}

/** Понедельник = 0 … воскресенье = 6. */
export function weekdayMondayFirst(view: MonthView, day: number): number {
  const weekday = new Date(Date.UTC(view.year, view.month - 1, day)).getUTCDay();

  return weekday === 0 ? 6 : weekday - 1;
}

export function formatMonthTitle(view: MonthView): string {
  const date = new Date(Date.UTC(view.year, view.month - 1, 1));

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(date);
}

export const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

export type CalendarCell =
  | {
      day: number;
      isoDay: string;
      kind: 'current-month';
    }
  | {
      day: number;
      isoDay: string;
      kind: 'adjacent-month';
    };

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
