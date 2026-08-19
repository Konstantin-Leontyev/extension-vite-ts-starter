/**
 * Файл: `e2e/a11y/switch.spec.ts`
 * Снимает дерево доступности компонента Switch.
 * Корень слепка — тумблер, не карточка витрины.
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

test.describe('Switch', () => {
  test('snapshot is the Switch control', async ({ page }) => {
    await openShowcase(page);

    const toggle = getShowcaseSection(page, 'Switch').getByRole('switch', {
      name: 'Switch',
    });

    await expect(toggle).toBeVisible();

    const tree = await snapshotA11yTree(toggle);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('switch.json');

    expect(tree.role).toBe('switch');
    expect(tree.name).toBe('Switch');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, toggle);
  });
});
