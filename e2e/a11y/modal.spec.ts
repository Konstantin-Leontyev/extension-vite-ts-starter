/**
 * Файл: `e2e/a11y/modal.spec.ts`
 * Снимает дерево доступности открытого компонента Modal.
 * Корень слепка — `<dialog>`, не карточка витрины.
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

test.describe('Modal', () => {
  test('open dialog snapshot is the component root', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Modal');
    const dialog = page.getByRole('dialog', { name: 'Modal title' });

    await section.getByRole('button', { name: 'Open modal' }).click();
    await expect(dialog).toBeVisible();

    const tree = await snapshotA11yTree(dialog);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('modal-open.json');

    expect(tree.role).toBe('dialog');
    expect(tree.name).toBe('Modal title');
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, dialog);
  });
});
