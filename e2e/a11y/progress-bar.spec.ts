/**
 * Файл: `e2e/a11y/progress-bar.spec.ts`
 * Снимает дерево доступности компонента ProgressBar.
 * Корень слепка — индикатор, не карточка витрины.
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

test.describe('ProgressBar', () => {
  test('snapshot is the ProgressBar indicator', async ({ page }) => {
    await openShowcase(page);

    const bar = getShowcaseSection(page, 'ProgressBar').getByRole('progressbar');

    await expect(bar).toBeVisible();

    const tree = await snapshotA11yTree(bar);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('progress-bar.json');

    expect(tree.role).toBe('progressbar');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, bar);
  });
});
