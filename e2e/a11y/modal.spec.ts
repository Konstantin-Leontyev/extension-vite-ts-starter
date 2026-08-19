/**
 * Файл: `e2e/a11y/modal.spec.ts`
 * Содержит клавиатурный сценарий Modal на витрине.
 * Сверяет, что открытие ставит фокус на `<dialog>`, а не на `Close`.
 * Фиксирует слепок открытого состояния как грязное дерево.
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

test.describe('Modal showcase', () => {
  test('opens onto the dialog, title names it, Esc and Close dismiss', async ({
    page,
  }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Modal');
    const openButton = section.getByRole('button', { name: 'Open modal' });
    const dialog = page.getByRole('dialog', { name: 'Modal title' });
    const close = dialog.getByRole('button', { name: 'Close' });

    await expect(openButton).toBeVisible();
    await expect(dialog).toBeHidden();

    const closedTree = await snapshotA11yTree(section);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'modal-closed.json'
    );

    await openButton.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();

    const openTree = await snapshotA11yTree(dialog);
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot('modal-open.json');

    expect(openTree.role).toBe('dialog');
    expect(openTree.name).toBe('Modal title');

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('dialog');
    expect(opened.name).toBe('Modal title');
    expect(opened.name).not.toBe('Close');
    await expect(dialog).toBeFocused();
    await expect(close).not.toBeFocused();

    const axe = await runAxeAudit(page, dialog);

    if (axe.outside.length > 0) {
      console.log(`Axe outside Modal dialog:\n${formatAxeViolations(axe.outside)}`);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();

    await openButton.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();

    await page.keyboard.press('Tab');
    expect((await getFocusedAnnouncement(page)).name).toBe('Close');
    await expect(close).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(dialog).toBeHidden();
  });
});
