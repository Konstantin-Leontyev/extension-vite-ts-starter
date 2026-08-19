/**
 * Файл: `e2e/a11y/table.spec.ts`
 * Содержит клавиатурный сценарий Table на витрине.
 * Сверяет, что `ArrowDown` на кнопке добавления открывает панель на первое текстовое поле.
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

test.describe('Table showcase', () => {
  test('ArrowDown on add opens the panel onto the first text field', async ({
    page,
  }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Table');
    const table = section.getByRole('table', { name: 'Catalog table demo' });
    const addButton = section.getByRole('button', { name: 'Add row' }).first();
    const panel = page.getByRole('dialog', { name: 'Add row' });

    await expect(table).toBeVisible();
    await expect(addButton).toBeVisible();
    await expect(panel).toBeHidden();

    const closedTree = await snapshotA11yTree(table);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'table-closed.json'
    );

    await addButton.focus();
    await page.keyboard.press('ArrowDown');
    await expect(panel).toBeVisible();

    const openTree = await snapshotA11yTree(panel);
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot(
      'table-add-open.json'
    );

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('textbox');
    expect(opened.name).toBe('Product');
    expect(opened.name).not.toBe('Add row');
    expect(opened.role).not.toBe('checkbox');
    await expect(panel.getByRole('textbox', { name: 'Product' })).toBeFocused();
    await expect(addButton).not.toBeFocused();

    const axe = await runAxeAudit(page, panel);

    if (axe.outside.length > 0) {
      console.log(`Axe outside Table add panel:\n${formatAxeViolations(axe.outside)}`);
    }
  });
});
