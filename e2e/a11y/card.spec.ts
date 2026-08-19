/**
 * Файл: `e2e/a11y/card.spec.ts`
 * Содержит дымовой клавиатурный сценарий карточки Card на витрине.
 * Сверяет, что заголовок и подзаголовок есть в дереве доступности и не являются
 * остановками Tab.
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

test.describe('Card showcase smoke', () => {
  test('title and subtitle are in the tree and are not tab stops', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Card');
    const title = section.getByRole('heading', { name: 'Card title' });
    const subtitle = section.getByText('Subtitle text', { exact: true });
    const settings = section.getByRole('button', { name: 'Open settings' });
    const closeAction = section.getByRole('button', { name: 'close' });
    const demoCard = title.locator('xpath=ancestor::header/parent::*');

    await expect(title).toBeVisible();
    await expect(subtitle).toBeVisible();

    const titleNode = await snapshotA11yTree(title);
    expect(titleNode.role).toBe('heading');
    expect(titleNode.name).toBe('Card title');

    const subtitleNode = await snapshotA11yTree(subtitle);
    expect(subtitleNode.role).toBe('paragraph');
    await expect(subtitle).toHaveText('Subtitle text');

    const titleIsTabStop = await title.evaluate((element) => {
      return element instanceof HTMLElement && element.tabIndex >= 0;
    });
    const subtitleIsTabStop = await subtitle.evaluate((element) => {
      return element instanceof HTMLElement && element.tabIndex >= 0;
    });
    expect(titleIsTabStop).toBe(false);
    expect(subtitleIsTabStop).toBe(false);

    await settings.focus();
    await expect(settings).toBeFocused();

    await page.keyboard.press('Tab');
    const afterTab = await getFocusedAnnouncement(page);
    expect(afterTab.name).toBe('close');
    expect(afterTab.role).toBe('button');
    await expect(closeAction).toBeFocused();
    expect(afterTab.name).not.toBe('Card title');
    expect(afterTab.name).not.toBe('Subtitle text');

    await settings.focus();
    await page.keyboard.press('Shift+Tab');
    const afterShiftTab = await getFocusedAnnouncement(page);
    expect(afterShiftTab.name).not.toBe('Card title');
    expect(afterShiftTab.name).not.toBe('Subtitle text');
    expect(afterShiftTab.role).not.toBe('heading');

    const axe = await runAxeAudit(page, demoCard);

    if (axe.outside.length > 0) {
      console.log(`Axe outside Card root:\n${formatAxeViolations(axe.outside)}`);
    }
  });
});
