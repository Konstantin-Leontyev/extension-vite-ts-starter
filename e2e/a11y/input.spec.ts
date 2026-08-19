/**
 * Файл: `e2e/a11y/input.spec.ts`
 * Снимает дерево доступности компонента Input.
 * Корень слепка — поле, не карточка витрины.
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

test.describe('Input', () => {
  test('snapshot is the Input field', async ({ page }) => {
    await openShowcase(page);

    const field = getShowcaseSection(page, 'Input').getByRole('textbox', {
      name: 'Label:',
    });

    await expect(field).toBeVisible();

    const tree = await snapshotA11yTree(field);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('input.json');

    expect(tree.role).toBe('textbox');
    expect(tree.name).toBe('Label:');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, field);
  });
});
