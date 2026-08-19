/**
 * Файл: `e2e/a11y/fieldset.spec.ts`
 * Снимает дерево доступности компонента Fieldset.
 * Корень слепка — группа с легендой, не карточка витрины.
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

test.describe('Fieldset', () => {
  test('snapshot is the Fieldset group', async ({ page }) => {
    await openShowcase(page);

    const group = getShowcaseSection(page, 'Fieldset').getByRole('group', {
      name: 'Legend',
    });

    await expect(group).toBeVisible();

    const tree = await snapshotA11yTree(group);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('fieldset.json');

    expect(tree.role).toBe('group');
    expect(tree.name).toBe('Legend');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, group);
  });
});
