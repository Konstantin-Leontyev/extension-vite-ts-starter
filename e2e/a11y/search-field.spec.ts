/**
 * Файл: `e2e/a11y/search-field.spec.ts`
 * Снимает дерево доступности компонента SearchField.
 * Корень слепка — поле поиска, не карточка витрины.
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

test.describe('SearchField', () => {
  test('snapshot is the SearchField input', async ({ page }) => {
    await openShowcase(page);

    const field = getShowcaseSection(page, 'SearchField').getByRole('searchbox', {
      name: 'Label:',
    });

    await expect(field).toBeVisible();

    const tree = await snapshotA11yTree(field);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('search-field.json');

    expect(tree.role).toBe('searchbox');
    expect(tree.name).toBe('Label:');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, field);
  });
});
