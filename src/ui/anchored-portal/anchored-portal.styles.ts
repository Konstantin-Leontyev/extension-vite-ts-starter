/**
 * Файл: `src/ui/anchored-portal/anchored-portal.styles.ts`
 * Содержит генератор хрома панели AnchoredPortal.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/anchored-portal/index.tsx` — реэкспортирует `getPortalPanelStyles` в публичное API
 *  - `src/ui/open-control.ts` — собирает хром portal-панели open-контролов через
 *    `getOpenControlPortalPanelStyles`
 *  - `src/ui/table/table.styles.ts` — подставляет хром add- и edit-панели строк
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import { STACKING_PORTAL } from '@ui/stacking';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { type AppTheme } from '@ui/theme';

/**
 * getPortalPanelStyles — возвращает CSS-правила хрома панели портала:
 * fixed-позицию у угла, слой `STACKING_PORTAL`, опциональный отступ через `padding`,
 * опциональный цвет обводки через `outlineColor`, заливку `surface` через
 * `getSurfaceBackgroundColor`, рамку с тенью, радиус и постоянный `outline`.
 * Собственных styled-узлов у AnchoredPortal нет — вызывающий код объявляет
 * панель-узел и подставляет генератор в своём styles-файле.
 *
 * Как работает:
 * 1. Задаёт fixed-позицию у угла и слой `STACKING_PORTAL`
 * 2. Добавляет `padding`, если отступ передан
 * 3. Добавляет заливку `surface` через `getSurfaceBackgroundColor`, рамку с тенью
 *    через `getBorderStyles`, радиус и постоянный `outline` через `getOutlineStyles`.
 *    Цвет обводки берёт из `outlineColor`, иначе из `theme.colors.focusOutline`
 * 4. Склеивает правила через перенос строки
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

  const styles = [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    `z-index: ${STACKING_PORTAL};`,
  ];

  if (padding !== undefined) {
    styles.push(`padding: ${padding};`);
  }

  styles.push(
    `background-color: ${getSurfaceBackgroundColor(theme, 'surface')};`,
    getBorderStyles(theme),
    `border-radius: ${borderRadius};`,
    getOutlineStyles(outlineColor)
  );

  return styles.join('\n');
}
