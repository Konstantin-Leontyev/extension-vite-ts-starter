/**
 * Файл: `e2e/a11y/helpers.ts`
 * Содержит общую оснастку Playwright-прохода доступности по витрине.
 *
 * Основные задачи:
 * 1. Типизировать слепок узла через `A11yNodeSnapshot`, результат axe через
 *    `AxeAuditResult`, объявление фокуса через `FocusedAnnouncement`
 *    и тему через `ShowcaseTheme`
 * 2. Хранить пороги axe в `BLOCKING_AXE_IMPACTS`, путь витрины в `SHOWCASE_HASH_PATH`
 *    и ключ темы в `THEME_STORAGE_KEY`
 * 3. Предоставить расширенный `test` с fixture темы и `baseURL`
 * 4. Предоставить функции `formatAxeViolations`, `getFocusedAnnouncement`,
 *    `getShowcaseSection`, `openShowcase`, `runAxeAudit` и `snapshotA11yTree`
 *
 * Потребители:
 *  - сценарии `e2e/a11y/*.spec.ts` — открывают витрину, сверяют дерево, фокус и axe
 */
import AxeBuilder from '@axe-core/playwright';
import { expect, test as base, type Locator, type Page } from '@playwright/test';
import { type Result } from 'axe-core';

/**
 * BLOCKING_AXE_IMPACTS — хранит уровни impact, на которых сценарий завершается ошибкой.
 * Используется в `runAxeAudit`.
 */
const BLOCKING_AXE_IMPACTS: ReadonlySet<string> = new Set([
  'blocker',
  'critical',
  'serious',
]);

/**
 * SHOWCASE_HASH_PATH — задаёт хэшевый путь витрины.
 * Используется в `openShowcase`.
 */
const SHOWCASE_HASH_PATH = '/#/showcase';

/**
 * THEME_STORAGE_KEY — задаёт ключ `localStorage` с темой приложения.
 * Используется в fixture `theme` расширенного `test`.
 */
const THEME_STORAGE_KEY = 'app-theme';

/**
 * A11yNodeSnapshot — представляет узел слепка дерева доступности.
 *
 * @property children — дочерние узлы в порядке чтения
 * @property name — доступное имя узла
 * @property role — роль узла в дереве доступности
 * @property states — ARIA-состояния узла
 */
export type A11yNodeSnapshot = {
  children: A11yNodeSnapshot[];
  name: string;
  role: string;
  states: Record<string, boolean | number | string>;
};

/**
 * AxeAuditResult — представляет результат axe, разложенный по границе корня.
 *
 * @property inside — нарушения, чьи узлы лежат внутри корня аудита
 * @property outside — нарушения, чьи узлы лежат вне корня аудита
 */
export type AxeAuditResult = {
  inside: Result[];
  outside: Result[];
};

/**
 * FocusedAnnouncement — представляет объявление текущего узла фокуса.
 *
 * @property name — доступное имя узла в фокусе
 * @property role — роль узла в фокусе
 * @property states — ARIA-состояния узла в фокусе
 */
export type FocusedAnnouncement = {
  name: string;
  role: string;
  states: Record<string, boolean | number | string>;
};

/**
 * ShowcaseTheme — представляет тему витрины для fixture Playwright.
 */
export type ShowcaseTheme = 'dark' | 'light';

/**
 * test — задаёт Playwright-тест витрины с fixture темы и `baseURL`.
 * `baseURL` читает `VITE_ORIGIN` из вывода Vite. Fixture `theme` пишет значение
 * в `localStorage` по ключу `THEME_STORAGE_KEY` до навигации.
 * Сценарии импортируют `test` отсюда, не из `@playwright/test`.
 */
export const test = base.extend<{ theme: ShowcaseTheme }>({
  baseURL: async ({}, use) => {
    const origin = process.env.VITE_ORIGIN;

    if (!origin) {
      throw new Error(
        'VITE_ORIGIN is missing. Run the suite with npm run test:a11y so Playwright can read the origin from Vite output.'
      );
    }

    await use(origin);
  },
  context: async ({ context, theme }, use) => {
    await context.addInitScript(
      ({ mode, storageKey }) => {
        window.localStorage.setItem(storageKey, mode);
      },
      { mode: theme, storageKey: THEME_STORAGE_KEY }
    );
    await use(context);
  },
  theme: ['light', { option: true }],
});

/**
 * formatAxeViolations — преобразует нарушения axe в многострочный текст для `expect`.
 *
 * @param violations перечень нарушений axe
 * @returns текст с одним нарушением на строку
 */
export function formatAxeViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ');
      return `${violation.id} [${violation.impact}] ${violation.help} → ${targets}`;
    })
    .join('\n');
}

/**
 * getFocusedAnnouncement — возвращает объявление узла в фокусе.
 *
 * @param page страница сценария
 * @returns имя, роль и состояния узла в фокусе
 */
export async function getFocusedAnnouncement(page: Page): Promise<FocusedAnnouncement> {
  const snapshot = await snapshotA11yTree(page.locator(':focus'));
  return {
    name: snapshot.name,
    role: snapshot.role,
    states: snapshot.states,
  };
}

/**
 * getShowcaseSection — возвращает карточку виджета витрины по доступному имени.
 *
 * @param page страница сценария
 * @param name доступное имя карточки `<article>`
 * @returns локатор секции витрины
 */
export function getShowcaseSection(page: Page, name: string): Locator {
  return page.getByRole('article', { exact: true, name });
}

/**
 * openShowcase — открывает витрину и ждёт карточку Card.
 *
 * @param page страница сценария
 */
export async function openShowcase(page: Page): Promise<void> {
  await page.goto(SHOWCASE_HASH_PATH);
  await expect(getShowcaseSection(page, 'Card')).toBeVisible({ timeout: 60_000 });
}

/**
 * runAxeAudit — прогоняет axe и завершает сценарий ошибкой на нарушениях
 * из `BLOCKING_AXE_IMPACTS` внутри корня.
 *
 * Как работает:
 * 1. Снимает нарушения axe со всей страницы
 * 2. Раскладывает узлы каждого нарушения на лежащие внутри корня и вне корня
 * 3. Завершает сценарий ошибкой, если внутри корня есть impact из `BLOCKING_AXE_IMPACTS`
 * 4. Возвращает обе группы для логирования внекорневых нарушений
 *
 * @param page страница сценария
 * @param root корень аудита
 * @returns нарушения внутри корня и вне его
 */
export async function runAxeAudit(page: Page, root: Locator): Promise<AxeAuditResult> {
  const results = await new AxeBuilder({ page }).analyze();
  const inside: Result[] = [];
  const outside: Result[] = [];

  for (const violation of results.violations) {
    const insideNodes = [];
    const outsideNodes = [];

    for (const node of violation.nodes) {
      const selector = node.target.map(String).join(' ');
      const contained = await root.evaluate((rootElement, target) => {
        try {
          const found = document.querySelector(target);
          return Boolean(found && rootElement.contains(found));
        } catch {
          return false;
        }
      }, selector);

      if (contained) {
        insideNodes.push(node);
      } else {
        outsideNodes.push(node);
      }
    }

    if (insideNodes.length > 0) {
      inside.push({ ...violation, nodes: insideNodes });
    }

    if (outsideNodes.length > 0) {
      outside.push({ ...violation, nodes: outsideNodes });
    }
  }

  const blocking = inside.filter((violation) => {
    const impact = violation.impact;
    return impact != null && BLOCKING_AXE_IMPACTS.has(impact);
  });

  expect(blocking, formatAxeViolations(blocking)).toEqual([]);

  return { inside, outside };
}

/**
 * snapshotA11yTree — возвращает слепок дерева доступности локатора.
 *
 * @param locator узел или поддерево для слепка
 * @returns разобранный слепок `ariaSnapshot`
 */
export async function snapshotA11yTree(locator: Locator): Promise<A11yNodeSnapshot> {
  const aria = await locator.ariaSnapshot();
  const parsed = parseAriaSnapshot(aria);

  if (!parsed) {
    throw new Error('Accessibility snapshot is empty');
  }

  return parsed;
}

/**
 * parseAriaSnapshot — преобразует текст `ariaSnapshot` в дерево `A11yNodeSnapshot`.
 *
 * @param aria многострочный слепок Playwright
 * @returns корневой узел или `null` при пустом слепке
 */
function parseAriaSnapshot(aria: string): A11yNodeSnapshot | null {
  const lines = aria.split('\n').filter((line) => line.length > 0);

  if (lines.length === 0) {
    return null;
  }

  const stack: { indent: number; node: A11yNodeSnapshot }[] = [];

  for (const line of lines) {
    const indent = line.length - line.trimStart().length;
    const node = parseAriaSnapshotLine(line.trim());

    while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ indent, node });
  }

  return stack[0]?.node ?? null;
}

/**
 * parseAriaSnapshotLine — преобразует одну строку `ariaSnapshot` в узел слепка.
 *
 * @param line строка слепка без учёта отступа
 * @returns роль, имя и состояния узла
 */
function parseAriaSnapshotLine(line: string): A11yNodeSnapshot {
  const match = /^- (?<role>[^\s:]+)(?<rest>.*)$/.exec(line);

  if (!match?.groups) {
    return { children: [], name: line, role: '', states: {} };
  }

  const rest = match.groups.rest;
  const nameMatch = /^ "(?<name>[^"]*)"/.exec(rest);
  const name = nameMatch?.groups?.name ?? '';
  const afterName = nameMatch ? rest.slice(nameMatch[0].length) : rest;
  const states: Record<string, boolean | number | string> = {};
  const statePattern = /\[(?<state>[^\]]+)\]/g;
  let stateMatch = statePattern.exec(afterName);

  while (stateMatch?.groups) {
    const [key, value] = stateMatch.groups.state.split('=');

    if (value === undefined) {
      states[key] = true;
    } else if (value === 'true' || value === 'false') {
      states[key] = value === 'true';
    } else if (Number.isFinite(Number(value))) {
      states[key] = Number(value);
    } else {
      states[key] = value;
    }

    stateMatch = statePattern.exec(afterName);
  }

  const textMatch = /: (?<text>.+)$/.exec(afterName);

  return {
    children: [],
    name: name || textMatch?.groups?.text || '',
    role: match.groups.role,
    states,
  };
}
