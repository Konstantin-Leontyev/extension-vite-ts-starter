/**
 * Файл: `e2e/a11y/locale-picker.spec.ts`
 * Снимает дерево доступности компонента LocalePicker.
 * Берёт корнем слепка кнопку-триггер и открытый список среза, не карточку витрины.
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
} from './helpers';

/**
 * LOCALE_SLICE_COUNT — задаёт число опций среза витрины LocalePicker.
 * Используется в проверке открытой панели: полный iso-639-1 в снимок не кладётся.
 */
const LOCALE_SLICE_COUNT = 10;

test.describe('LocalePicker', () => {
  test('snapshot is the LocalePicker control, open list is the 10-code slice', async ({
    page,
  }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'LocalePicker');
    const trigger = section.getByRole('button', { name: 'Label: Select…' });
    const panel = page.getByRole('listbox');

    await expect(trigger).toBeVisible();
    await expect(panel).toBeHidden();

    const closedTree = await snapshotA11yTree(trigger);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'locale-picker-closed.json'
    );

    expect(closedTree.role).toBe('button');
    expect(closedTree.name).toBe('Label: Select…');
    expect(closedTree.role).not.toBe('article');

    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();

    const openTree = await snapshotA11yTree(panel);
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot(
      'locale-picker-open.json'
    );

    expect(openTree.role).toBe('listbox');
    expect(openTree.name).toBe('Label:');
    expect(openTree.role).not.toBe('article');
    await expect(panel.getByRole('option')).toHaveCount(LOCALE_SLICE_COUNT);

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('combobox');
    expect(opened.name).toBe('Label:');

    const axe = await runAxeAudit(page, panel);

    if (axe.outside.length > 0) {
      console.log(
        `Axe outside LocalePicker panel:\n${formatAxeViolations(axe.outside)}`
      );
    }
  });
});
