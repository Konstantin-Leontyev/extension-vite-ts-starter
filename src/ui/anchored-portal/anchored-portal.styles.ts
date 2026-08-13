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
import { getSurfaceBackgroundColor } from '@ui/surface';
import { type AppTheme } from '@ui/theme';

/**
 * getPortalPanelStyles — возвращает CSS-правила хрома панели портала:
 * fixed-позицию у угла, опциональный отступ через `padding`, опциональный цвет
 * обводки через `outlineColor`, заливку `surface` через
 * `getSurfaceBackgroundColor`, рамку с тенью, радиус и постоянный `outline`.
 * `padding`, `overflow` и `background-color` остаются моделью панели, а не
 * дублем сброса UA `[popover]` из `src/ui/reset.ts`. У селектора `[popover]` и
 * класса компонента равная специфичность, и перенос этих свойств в общий сброс
 * перекроет модель Card.
 * Собственных styled-узлов у AnchoredPortal нет — вызывающий код объявляет
 * панель-узел и подставляет генератор в своём styles-файле.
 *
 * Как работает:
 * 1. Задаёт fixed-позицию у угла
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
    inset-block-start: 0;
    inset-inline-start: 0;
    padding: ${padding ?? '0'};
    overflow: visible;
    background-color: ${getSurfaceBackgroundColor(theme, 'surface')};
    ${getBorderStyles(theme)}
    border-radius: ${borderRadius};
    ${getOutlineStyles(outlineColor)}
  `;
}
