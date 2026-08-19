/**
 * Файл: `e2e/a11y/icon.spec.ts`
 * Снимает дерево доступности компонента Icon в режиме кнопки.
 * Корень слепка — кнопка Icon, не карточка витрины.
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

test.describe('Icon', () => {
  test('snapshot is the Icon button', async ({ page }) => {
    await openShowcase(page);

    const icon = getShowcaseSection(page, 'Icon').getByRole('button', {
      name: 'Demo icon',
    });

    await expect(icon).toBeVisible();

    const tree = await snapshotA11yTree(icon);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('icon.json');

    expect(tree.role).toBe('button');
    expect(tree.name).toBe('Demo icon');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, icon);
  });
});
