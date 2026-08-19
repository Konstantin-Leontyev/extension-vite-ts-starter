/**
 * Файл: `e2e/a11y/segment-button.spec.ts`
 * Снимает дерево доступности компонента SegmentButton.
 * Корень слепка — группа сегментов, не карточка витрины.
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

test.describe('SegmentButton', () => {
  test('snapshot is the SegmentButton group', async ({ page }) => {
    await openShowcase(page);

    const group = getShowcaseSection(page, 'Segment button').getByRole('group', {
      name: 'Label:',
    });

    await expect(group).toBeVisible();

    const tree = await snapshotA11yTree(group);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('segment-button.json');

    expect(tree.role).toBe('group');
    expect(tree.name).toBe('Label:');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, group);
  });
});
