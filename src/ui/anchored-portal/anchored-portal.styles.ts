/**
 * Файл: `src/ui/anchored-portal/anchored-portal.styles.ts`
 * Содержит генераторы хрома панели AnchoredPortal и CSS-привязки к неявному якорю.
 *
 * Основные задачи:
 * 1. Предоставить функции `getCssAnchorBindingStyles`,
 *    `getCssAnchorPlacementStyles` и `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/anchored-portal/index.tsx` — реэкспортирует `getCssAnchorBindingStyles`,
 *    `getCssAnchorPlacementStyles` и `getPortalPanelStyles` в публичное API
 *  - `src/ui/open-control.ts` — собирает хром portal-панели open-контролов через
 *    `getOpenControlPortalPanelStyles`
 *  - `src/ui/table/table.styles.ts` — подставляет хром add- и edit-панели строк
 *    и `getCssAnchorBindingStyles`
 *  - `@ui/combobox`, `@ui/date-range-input` и `@ui/range-input` — подставляют
 *    `getCssAnchorPlacementStyles`
 *  - `@ui/listbox` и `src/components/profile-menu` — подставляют
 *    `getCssAnchorBindingStyles`
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { type AppTheme } from '@ui/theme';
import { PORTAL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  ANCHORED_PORTAL_POSITION_TRY_ABOVE,
  ANCHORED_PORTAL_POSITION_TRY_VIEWPORT,
} from './position-try';

/**
 * getCssAnchorBindingStyles — возвращает CSS-правила привязки панели к неявному якорю
 * из `source` показа `showPopover`.
 * `position-anchor: auto` объявляет связь с неявным якорем. Без него действует
 * начальное `normal`, которое без `position-area` ведёт себя как `none`: панель
 * не связана с якорем, и `anchor()` с `anchor-size()` недействительны.
 * `position-visibility: always` оставляет панель видимой, когда триггер скрыт
 * через `visibility: hidden`. Начальное `anchors-visible` прячет панель вместе
 * с триггером.
 * Используется в `getCssAnchorPlacementStyles`, `@ui/listbox`, `@ui/table` и
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
 * getCssAnchorPlacementStyles — возвращает CSS-правила размещения панели:
 * привязку к неявному якорю, верх, ширину, `margin-block-end` и запасные
 * позиции `@position-try`.
 * `viewport-edge` ограничивает `inset-inline-start` через `clamp`, чтобы
 * панель не выходила за отступ края вьюпорта. `trigger-start` ставит
 * `inset-inline-start: anchor(start)`.
 * Используется в `@ui/combobox` и `@ui/date-range-input` с `viewport-edge`,
 * в `@ui/range-input` с `trigger-start`.
 *
 * @param inlinePlacement режим горизонтального размещения панели
 * @returns CSS-правила, каждое с новой строки
 */
export function getCssAnchorPlacementStyles(
  inlinePlacement: 'trigger-start' | 'viewport-edge'
): string {
  return `
    ${getCssAnchorBindingStyles()}
    inset-block-start: anchor(start);
    inset-inline-start: ${
      inlinePlacement === 'viewport-edge'
        ? `clamp(
      ${PORTAL_VIEWPORT_EDGE_INSET}px,
      anchor(start),
      calc(100% - ${PORTAL_VIEWPORT_EDGE_INSET}px - anchor-size(width))
    )`
        : 'anchor(start)'
    };
    inline-size: anchor-size(width);
    margin-block-end: ${PORTAL_VIEWPORT_EDGE_INSET}px;
    position-try-fallbacks: ${ANCHORED_PORTAL_POSITION_TRY_ABOVE}, ${ANCHORED_PORTAL_POSITION_TRY_VIEWPORT};
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
