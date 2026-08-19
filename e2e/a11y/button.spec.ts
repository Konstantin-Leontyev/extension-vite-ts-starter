/**
 * Файл: `e2e/a11y/button.spec.ts`
 * Снимает дерево доступности компонента Button.
 * Корень слепка — кнопка компонента, не карточка витрины.
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

test.describe('Button', () => {
  test('snapshot is the Button control', async ({ page }) => {
    await openShowcase(page);

    const button = getShowcaseSection(page, 'Button').getByRole('button', {
      name: 'Label:',
    });

    await expect(button).toBeVisible();

    const tree = await snapshotA11yTree(button);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('button.json');

    expect(tree.role).toBe('button');
    expect(tree.name).toBe('Label:');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, button);
  });
});
