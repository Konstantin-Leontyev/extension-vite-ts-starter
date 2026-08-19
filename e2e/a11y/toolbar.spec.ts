/**
 * Файл: `e2e/a11y/toolbar.spec.ts`
 * Содержит клавиатурный сценарий Toolbar на витрине.
 * Сверяет одну остановку Tab, обход стрелками и именованную роль `toolbar`.
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
 * TOOLBAR_ACTIONS — хранит доступные имена действий демо-ряда Toolbar на витрине.
 */
const TOOLBAR_ACTIONS = ['search', 'copy', 'download', 'settings', 'sign-out'] as const;

test.describe('Toolbar showcase', () => {
  test('one tab stop, arrows walk actions, named toolbar role', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Toolbar');
    const toolbar = section.getByRole('toolbar', { name: 'Toolbar' });
    const settings = section.getByRole('button', { name: 'Open settings' });

    await expect(toolbar).toBeVisible();

    const closedTree = await snapshotA11yTree(toolbar);
    expect(`${JSON.stringify(closedTree, null, 2)}\n`).toMatchSnapshot('toolbar.json');

    expect(closedTree.role).toBe('toolbar');
    expect(closedTree.name).toBe('Toolbar');

    await settings.focus();
    await expect(settings).toBeFocused();

    await page.keyboard.press('Tab');
    const firstStop = await getFocusedAnnouncement(page);
    expect(firstStop.role).toBe('button');
    expect(firstStop.name).toBe(TOOLBAR_ACTIONS[0]);
    await expect(
      toolbar.getByRole('button', { name: TOOLBAR_ACTIONS[0] })
    ).toBeFocused();

    await page.keyboard.press('Tab');
    const leftToolbar = await getFocusedAnnouncement(page);
    expect(leftToolbar.name).not.toBe(TOOLBAR_ACTIONS[1]);
    expect(
      TOOLBAR_ACTIONS.includes(leftToolbar.name as (typeof TOOLBAR_ACTIONS)[number])
    ).toBe(false);

    await toolbar.getByRole('button', { name: TOOLBAR_ACTIONS[0] }).focus();
    await page.keyboard.press('ArrowRight');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[1]);

    await page.keyboard.press('ArrowDown');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[2]);

    await page.keyboard.press('End');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[4]);

    await page.keyboard.press('Home');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[0]);

    await page.keyboard.press('ArrowLeft');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[4]);

    await page.keyboard.press('ArrowUp');
    expect((await getFocusedAnnouncement(page)).name).toBe(TOOLBAR_ACTIONS[3]);

    const axe = await runAxeAudit(page, toolbar);

    if (axe.outside.length > 0) {
      console.log(`Axe outside Toolbar root:\n${formatAxeViolations(axe.outside)}`);
    }
  });
});
