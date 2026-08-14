/**
 * Файл: `src/ui/anchored-portal/anchored-portal.styles.ts`
 * Содержит генераторы хрома панели AnchoredPortal и CSS-привязки к неявному якорю.
 *
 * Основные задачи:
 * 1. Предоставить функции `getCssAnchorBindingStyles` и `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/anchored-portal/index.tsx` — реэкспортирует `getCssAnchorBindingStyles`
 *    и `getPortalPanelStyles` в публичное API
 *  - `src/ui/open-control.ts` — собирает хром portal-панели open-контролов через
 *    `getOpenControlPortalPanelStyles`
 *  - `src/ui/table/table.styles.ts` — подставляет хром add- и edit-панели строк
 *  - `@ui/range-input`, `@ui/date-range-input` и `src/components/profile-menu` —
 *    подставляют `getCssAnchorBindingStyles`
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { type AppTheme } from '@ui/theme';

/**
 * getCssAnchorBindingStyles — возвращает CSS-правила привязки панели к неявному якорю
 * из `source` показа `showPopover`.
 * `position-anchor: auto` объявляет связь с неявным якорем. Без него действует
 * начальное `normal`, которое без `position-area` ведёт себя как `none`: панель
 * не связана с якорем, и `anchor()` с `anchor-size()` недействительны.
 * `position-visibility: always` оставляет панель видимой, когда триггер скрыт
 * через `visibility: hidden`. Начальное `anchors-visible` прячет панель вместе
 * с триггером.
 * Используется в `@ui/range-input`, `@ui/date-range-input` и
 * `src/components/profile-menu`.
 *
 * @returns CSS-правила, каждое с новой строки
 */
export function getCssAnchorBindingStyles(): string {
  return `
    position-anchor: auto;
    position-visibility: always;
  `;
}

/**
 * getPortalPanelStyles — возвращает CSS-правила хрома панели портала:
 * `position: fixed`, опциональный отступ через `padding`, опциональный цвет
 * обводки через `outlineColor`, заливку `surface` через
 * `getSurfaceBackgroundColor`, рамку с тенью, радиус и постоянный `outline`.
 * `padding`, `overflow` и `background-color` остаются моделью панели.
 * Собственных styled-узлов у AnchoredPortal нет — вызывающий код объявляет
 * панель-узел и подставляет генератор в своём styles-файле.
 *
 * Как работает:
 * 1. Задаёт `position: fixed`
 * 2. Добавляет `padding`, если отступ передан, иначе `0` против UA, и
 *    `overflow: visible`
 * 3. Добавляет заливку `surface` через `getSurfaceBackgroundColor`, рамку с тенью
 *    через `getBorderStyles`, радиус и постоянный `outline` через `getOutlineStyles`.
 *    Цвет обводки берёт из `outlineColor`, иначе из `theme.colors.focusOutline`
 *
 * @param options тема, радиус, опциональный отступ и опциональный цвет обводки
 * @returns CSS-правила, каждое с новой строки
 */
export function getPortalPanelStyles(options: {
  borderRadius: string;
  outlineColor?: string;
  padding?: string;
  theme: AppTheme;
}): string {
  const { borderRadius, padding, theme } = options;
  const outlineColor = options.outlineColor ?? theme.colors.focusOutline;

  return `
    position: fixed;
    padding: ${padding ?? '0'};
    overflow: visible;
    background-color: ${getSurfaceBackgroundColor(theme, 'surface')};
    ${getBorderStyles(theme)}
    border-radius: ${borderRadius};
    ${getOutlineStyles(outlineColor)}
  `;
}
