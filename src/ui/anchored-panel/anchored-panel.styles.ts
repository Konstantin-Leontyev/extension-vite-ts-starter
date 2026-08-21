/**
 * Файл: `src/ui/anchored-panel/anchored-panel.styles.ts`
 * Содержит генераторы хрома панели AnchoredPanel и CSS-привязки к неявному якорю.
 *
 * Основные задачи:
 * 1. Предоставить функции `getCssAnchorBindingStyles`,
 *    `getCssAnchorPlacementStyles` и `getAnchoredPanelStyles`
 *
 * Потребители:
 *  - `src/ui/anchored-panel/index.tsx` — реэкспортирует `getCssAnchorBindingStyles`,
 *    `getCssAnchorPlacementStyles` и `getAnchoredPanelStyles` в публичное API
 *  - `src/ui/open-control.ts` — собирает хром панели open-контролов через
 *    `getOpenControlPanelStyles`
 *  - `src/ui/table/table.styles.ts` — подставляет хром add- и edit-панели строк
 *    и `getCssAnchorBindingStyles`
 *  - `@ui/listbox`, `@ui/date-range-input` и `@ui/range-input` — подставляют
 *    `getCssAnchorPlacementStyles`
 *  - `src/components/profile-menu` — подставляет `getCssAnchorBindingStyles`
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { type AppTheme } from '@ui/theme';
import { PANEL_VIEWPORT_EDGE_INSET } from '@ui/viewport';

import {
  ANCHORED_PANEL_POSITION_TRY_ABOVE,
  ANCHORED_PANEL_POSITION_TRY_VIEWPORT,
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
 * Используется в `getCssAnchorPlacementStyles`, `@ui/table` и
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
 * панель не выходила за отступ края вьюпорта, и ставит ширину по якорю.
 * `trigger-start` ставит `inset-inline-start: anchor(start)` и ширину по якорю.
 * `content` ставит ширину по содержимому с потолком вьюпорта: формула
 * `viewport-edge` предполагает ширину панели равной якорю и для кнопки-иконки
 * не годится. При нехватке места по строке первой запасной позицией идёт
 * `flip-inline`.
 * Используется в `@ui/listbox` вида `field` и `@ui/date-range-input` с
 * `viewport-edge`, в `@ui/listbox` вида `icon` с `content`,
 * в `@ui/range-input` с `trigger-start`.
 *
 * @param placement режим размещения и ширины панели
 * @returns CSS-правила, каждое с новой строки
 */
export function getCssAnchorPlacementStyles(
  placement: 'content' | 'trigger-start' | 'viewport-edge'
): string {
  const styles = [getCssAnchorBindingStyles(), 'inset-block-start: anchor(start);'];

  if (placement === 'content') {
    styles.push(
      `inset-inline-start: max(${PANEL_VIEWPORT_EDGE_INSET}px, anchor(start));`,
      'inline-size: max-content;',
      `max-inline-size: calc(100% - ${PANEL_VIEWPORT_EDGE_INSET}px * 2);`
    );
  } else {
    styles.push(
      `inset-inline-start: ${
        placement === 'viewport-edge'
          ? `clamp(
      ${PANEL_VIEWPORT_EDGE_INSET}px,
      anchor(start),
      calc(100% - ${PANEL_VIEWPORT_EDGE_INSET}px - anchor-size(width))
    )`
          : 'anchor(start)'
      };`,
      'inline-size: anchor-size(width);'
    );
  }

  styles.push(
    `margin-block-end: ${PANEL_VIEWPORT_EDGE_INSET}px;`,
    `position-try-fallbacks: ${
      placement === 'content' ? 'flip-inline, ' : ''
    }${ANCHORED_PANEL_POSITION_TRY_ABOVE}, ${ANCHORED_PANEL_POSITION_TRY_VIEWPORT};`
  );

  return styles.join('\n');
}

/**
 * getAnchoredPanelStyles — возвращает CSS-правила хрома привязанной панели:
 * `position: fixed`, опциональный отступ через `padding`, опциональный цвет
 * обводки через `outlineColor`, заливку `surface` через
 * `getSurfaceBackgroundColor`, рамку с тенью, радиус и постоянный `outline`.
 * `padding`, `overflow` и `background-color` остаются моделью панели.
 * Собственных styled-узлов у AnchoredPanel нет — вызывающий код объявляет
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
export function getAnchoredPanelStyles(options: {
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
