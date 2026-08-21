/**
 * Файл: `e2e/a11y/listbox.spec.ts`
 * Снимает дерево доступности компонента Listbox.
 * Берёт корнем слепка кнопку-триггер и открытую панель, не карточку витрины.
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

test.describe('Listbox', () => {
  test('snapshot is the Listbox control, ArrowDown opens options', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Listbox');
    const trigger = section.getByRole('button', { name: 'Label: Select…' });
    const panel = page.getByRole('listbox');

    await expect(trigger).toBeVisible();
    await expect(panel).toBeHidden();

    const closedTree = await snapshotA11yTree(trigger);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'listbox-closed.json'
    );

    expect(closedTree.role).toBe('button');
    expect(closedTree.name).toBe('Label: Select…');
    expect(closedTree.role).not.toBe('article');

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(panel).toBeVisible();

    const openTree = await snapshotA11yTree(panel);
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot(
      'listbox-open.json'
    );

    expect(openTree.role).toBe('listbox');
    expect(openTree.name).toBe('Label:');
    expect(openTree.role).not.toBe('article');

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('option');
    expect(opened.name).toBe('Add-circle');

    await page.keyboard.press('ArrowDown');
    expect((await getFocusedAnnouncement(page)).name).toBe('Caption');

    const axe = await runAxeAudit(page, panel);

    if (axe.outside.length > 0) {
      console.log(`Axe outside Listbox panel:\n${formatAxeViolations(axe.outside)}`);
    }
  });
});
