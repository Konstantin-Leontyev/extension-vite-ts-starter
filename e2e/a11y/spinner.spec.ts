/**
 * Файл: `e2e/a11y/spinner.spec.ts`
 * Снимает дерево доступности компонента Spinner.
 * Корень слепка — индикатор загрузки, не карточка витрины.
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

test.describe('Spinner', () => {
  test('snapshot is the Spinner status', async ({ page }) => {
    await openShowcase(page);

    const status = getShowcaseSection(page, 'Spinner').getByRole('status');

    await expect(status).toBeVisible();

    const tree = await snapshotA11yTree(status);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('spinner.json');

    expect(tree.role).toBe('status');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, status);
  });
});
