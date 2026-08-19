/**
 * Файл: `e2e/a11y/text.spec.ts`
 * Снимает дерево доступности компонента Text на витрине.
 * Корень слепка — сам текстовый узел, не карточка витрины.
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

/**
 * SAMPLE_TEXT — задаёт демо-строку компонента Text на витрине.
 * Используется, чтобы взять корень компонента, а не заголовок карточки.
 */
const SAMPLE_TEXT = 'Sample text line long enough to show ellipsis in the demo';

test.describe('Text', () => {
  test('snapshot is the Text component root', async ({ page }) => {
    await openShowcase(page);

    const section = getShowcaseSection(page, 'Text');
    const sample = section.getByText(SAMPLE_TEXT, { exact: true });

    await expect(sample).toBeVisible();

    const tree = await snapshotA11yTree(sample);
    expect(`${JSON.stringify(tree, null, 2)}\n`).toMatchSnapshot('text.json');

    expect(tree.name).toBe(SAMPLE_TEXT);
    expect(tree.role).not.toBe('article');

    await runAxeAudit(page, sample);
  });
});
