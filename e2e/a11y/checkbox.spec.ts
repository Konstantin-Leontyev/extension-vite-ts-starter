/**
 * Файл: `e2e/a11y/checkbox.spec.ts`
 * Снимает дерево доступности компонента Checkbox.
 * Корень слепка — чекбокс, не карточка витрины.
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

test.describe('Checkbox', () => {
  test('snapshot is the Checkbox control', async ({ page }) => {
    await openShowcase(page);

    const checkbox = getShowcaseSection(page, 'Checkbox').getByRole('checkbox', {
      name: 'Example',
    });

    await expect(checkbox).toBeVisible();

    const tree = await snapshotA11yTree(checkbox);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('checkbox.json');

    expect(tree.role).toBe('checkbox');
    expect(tree.name).toBe('Example');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, checkbox);
  });
});
