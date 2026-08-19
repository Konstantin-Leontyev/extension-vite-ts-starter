/**
 * Файл: `e2e/a11y/date-range-input.spec.ts`
 * Содержит клавиатурный сценарий DateRangeInput на витрине.
 * Сверяет, что `ArrowDown` открывает панель с тремя остановками Tab и roving-сеткой дней.
 *
 * Потребители:
 *  - команда `test:a11y` из `package.json` — запускает сценарий
 */
import { expect } from '@playwright/test';

import {
  formatAxeViolations,
  getFocusedAnnouncement,
  getShowcaseSection,
  openShowcase,
  runAxeAudit,
  snapshotA11yTree,
  test,
  type A11yNodeSnapshot,
} from './helpers';

/**
 * ACCESSIBLE_DAY_NAME — задаёт шаблон доступного имени дня сетки.
 * Используется в `stabilizeDateTree`.
 */
const ACCESSIBLE_DAY_NAME = /^[A-Z][a-z]+, [A-Z][a-z]+ \d{1,2}, \d{4}$/;

/**
 * MONTH_TITLE — задаёт шаблон заголовка месяца сетки.
 * Используется в `stabilizeDateTree`.
 */
const MONTH_TITLE = /^[A-Z][a-z]+ \d{4}$/;

/**
 * formatUtcDayAccessible — возвращает доступное имя дня в формате сетки CalendarPanel.
 *
 * @param isoDay календарный день в ISO `YYYY-MM-DD`
 * @returns длинная дата в локали `en-US` и зоне UTC
 */
function formatUtcDayAccessible(isoDay: string): string {
  const [year, month, day] = isoDay.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
    weekday: 'long',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

/**
 * todayUtcIso — возвращает сегодняшний календарный день в UTC.
 *
 * @returns строка `YYYY-MM-DD`
 */
function todayUtcIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * stabilizeDateTree — преобразует слепок в стабильный: имена дней и месяца
 * заменяет маркерами, чтобы JSON-слепок не плыл от даты прогона.
 *
 * @param node узел слепка
 * @returns тот же узел с именами дней и месяца, заменёнными на маркеры
 */
function stabilizeDateTree(node: A11yNodeSnapshot): A11yNodeSnapshot {
  let { name } = node;

  if (ACCESSIBLE_DAY_NAME.test(name)) {
    name = '[date]';
  } else if (MONTH_TITLE.test(name)) {
    name = '[month]';
  }

  return {
    children: node.children.map(stabilizeDateTree),
    name,
    role: node.role,
    states: node.states,
  };
}

test.describe('DateRangeInput showcase', () => {
  test('ArrowDown opens panel with three tab stops and a roving day grid', async ({
    page,
  }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Date range');
    const group = section.getByRole('group', { name: 'Label:' });
    const startSegment = group.getByRole('button', { name: 'DD.MM.YY' }).first();
    const panel = page.getByRole('dialog', { name: 'Date range calendar' });
    const todayName = formatUtcDayAccessible(todayUtcIso());

    await expect(group).toBeVisible();
    await expect(panel).toBeHidden();

    const closedTree = stabilizeDateTree(await snapshotA11yTree(group));
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'date-range-closed.json'
    );

    await startSegment.focus();
    await page.keyboard.press('ArrowDown');
    await expect(panel).toBeVisible();

    const openTree = stabilizeDateTree(await snapshotA11yTree(panel));
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot(
      'date-range-open.json'
    );

    expect(openTree.role).toBe('dialog');
    expect(openTree.name).toBe('Date range calendar');

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('button');
    expect(opened.name).toBe(todayName);

    const todayCell = panel.getByRole('gridcell', { name: todayName });
    await expect(todayCell).toHaveAttribute('aria-current', 'date');

    await page.keyboard.press('Tab');
    expect((await getFocusedAnnouncement(page)).name).toBe('Set');

    await page.keyboard.press('Tab');
    expect((await getFocusedAnnouncement(page)).name).toBe('Previous year');

    await page.keyboard.press('Tab');
    expect((await getFocusedAnnouncement(page)).name).toBe(todayName);

    await page.keyboard.press('ArrowLeft');
    const movedDay = await getFocusedAnnouncement(page);
    expect(movedDay.role).toBe('button');
    expect(movedDay.name).not.toBe(todayName);
    expect(movedDay.name).not.toBe('Set');
    expect(ACCESSIBLE_DAY_NAME.test(movedDay.name)).toBe(true);

    await page.keyboard.press('Tab');
    expect((await getFocusedAnnouncement(page)).name).toBe('Set');

    const axe = await runAxeAudit(page, panel);

    if (axe.outside.length > 0) {
      console.log(
        `Axe outside DateRangeInput panel:\n${formatAxeViolations(axe.outside)}`
      );
    }
  });
});
