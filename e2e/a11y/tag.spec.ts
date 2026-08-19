/**
 * Файл: `e2e/a11y/tag.spec.ts`
 * Снимает дерево доступности компонента Tag.
 * Корень слепка — метка, не карточка витрины.
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

test.describe('Tag', () => {
  test('snapshot is the Tag label', async ({ page }) => {
    await openShowcase(page);

    const tag = getShowcaseSection(page, 'Tag')
      .locator('header ~ *')
      .getByText('Tag', { exact: true });

    await expect(tag).toBeVisible();

    const tree = await snapshotA11yTree(tag);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('tag.json');

    expect(tree.name).toBe('Tag');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, tag);
  });
});
