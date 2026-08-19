/**
 * Файл: `e2e/a11y/profile-menu.spec.ts`
 * Содержит клавиатурный сценарий ProfileMenu на витрине.
 * Сверяет, что `ArrowDown` на триггере ставит фокус на `Profile`, а не на `Close`.
 *
 * Потребители:
 *  - команда `test:a11y` из `package.json` — запускает сценарий
 */
import { expect } from '@playwright/test';

import {
  formatAxeViolations,
  getFocusedAnnouncement,
  openShowcase,
  runAxeAudit,
  snapshotA11yTree,
  test,
} from './helpers';

test.describe('ProfileMenu showcase', () => {
  test('ArrowDown on the trigger focuses Profile, not Close', async ({ page }) => {
    await openShowcase(page);

    const trigger = page.getByRole('button', { name: 'Profile menu for User' });
    const panel = page.getByRole('dialog', { name: 'Hello, User!' });
    const profile = panel.getByRole('button', { name: 'Profile', exact: true });
    const close = panel.getByRole('button', { name: 'Close profile menu' });

    await page.getByRole('banner').hover();
    await expect(trigger).toBeVisible();
    await expect(panel).toBeHidden();

    const closedTree = await snapshotA11yTree(trigger);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot(
      'profile-menu-closed.json'
    );

    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(panel).toBeVisible();

    const openTree = await snapshotA11yTree(panel);
    expect(`${JSON.stringify(openTree, null, 2)}\n`).toMatchSnapshot(
      'profile-menu-open.json'
    );

    expect(openTree.role).toBe('dialog');
    expect(openTree.name).toBe('Hello, User!');

    const opened = await getFocusedAnnouncement(page);
    expect(opened.role).toBe('button');
    expect(opened.name).toBe('Profile');
    expect(opened.name).not.toBe('Close profile menu');
    await expect(profile).toBeFocused();
    await expect(close).not.toBeFocused();

    const axe = await runAxeAudit(page, panel);

    if (axe.outside.length > 0) {
      console.log(`Axe outside ProfileMenu panel:\n${formatAxeViolations(axe.outside)}`);
    }
  });
});
