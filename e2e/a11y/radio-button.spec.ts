/**
 * Файл: `e2e/a11y/radio-button.spec.ts`
 * Снимает дерево доступности компонента RadioButton.
 * Корень слепка — переключатель Option A, не карточка витрины.
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

test.describe('RadioButton', () => {
  test('snapshot is the RadioButton control', async ({ page }) => {
    await openShowcase(page);

    const radio = getShowcaseSection(page, 'Radio button').getByRole('radio', {
      name: 'Option A',
    });

    await expect(radio).toBeVisible();

    const tree = await snapshotA11yTree(radio);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('radio-button.json');

    expect(tree.role).toBe('radio');
    expect(tree.name).toBe('Option A');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, radio);
  });
});
