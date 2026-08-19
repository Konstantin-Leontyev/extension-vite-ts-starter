/**
 * Файл: `e2e/a11y/toast.spec.ts`
 * Снимает дерево доступности компонента Toast.
 * Корень слепка — уведомление, не карточка витрины и не кнопка Show toast.
 *
 * Потребители:
 *  - команда `test:a11y` из `package.json` — запускает сценарий
 */
import { expect } from '@playwright/test';

import {
  getShowcaseSection,
  openShowcase,
  runAxeAudit,
  snapshotA11yTree,
  test,
} from './helpers';

test.describe('Toast', () => {
  test('snapshot is the Toast status', async ({ page }) => {
    await openShowcase(page);

    const message = getShowcaseSection(page, 'Toast').getByText(
      'Very important message',
      { exact: true }
    );

    await expect(message).toBeVisible();

    const toast = message.locator('xpath=ancestor::*[@role="status"][1]');
    const tree = await snapshotA11yTree(toast);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('toast.json');

    expect(tree.role).toBe('status');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, toast);
  });
});
