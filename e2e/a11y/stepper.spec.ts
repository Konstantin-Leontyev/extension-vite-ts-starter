/**
 * Файл: `e2e/a11y/stepper.spec.ts`
 * Снимает дерево доступности компонента Stepper.
 * Корень слепка — поле-счётчик, не карточка витрины.
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

test.describe('Stepper', () => {
  test('snapshot is the Stepper spinbutton', async ({ page }) => {
    await openShowcase(page);

    const field = getShowcaseSection(page, 'Stepper').getByRole('spinbutton', {
      name: 'Label:',
    });

    await expect(field).toBeVisible();

    const tree = await snapshotA11yTree(field);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('stepper.json');

    expect(tree.role).toBe('spinbutton');
    expect(tree.name).toBe('Label:');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, field);
  });
});
