/**
 * Файл: `e2e/a11y/range-input.spec.ts`
 * Снимает дерево доступности открытой панели RangeInput.
 * Корень слепка — диалог панели, не карточка витрины.
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

test.describe('RangeInput', () => {
  test('snapshot is the open RangeInput panel', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Range input');
    const trigger = section.getByRole('button', { name: 'Label:' });
    const panel = page.getByRole('dialog', { name: 'Custom range:' });

    await trigger.click();
    await expect(panel).toBeVisible();

    const tree = await snapshotA11yTree(panel);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('range-input-open.json');

    expect(tree.role).toBe('dialog');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, panel);
  });
});
