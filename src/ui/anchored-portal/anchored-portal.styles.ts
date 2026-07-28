/**
 * Файл: `src/ui/anchored-portal/anchored-portal.styles.ts`
 * Содержит генератор хрома панели AnchoredPortal в `document.body`.
 * Объединяет позицию, слой, заливку, рамку, тень, радиус и постоянное фокус-кольцо.
 * Собственных styled-узлов у AnchoredPortal нет — панель-узел объявляет
 * вызывающий код и зовёт генератор в своём styles-файле.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/listbox/listbox.styles.ts` — панель опций
 *  - `src/ui/combobox/combobox.styles.ts` — панель поиска и опций
 *  - `src/ui/range-input/range-input.styles.ts` — панель пресетов и полей
 *  - `src/ui/date-range-input/date-range-input.styles.ts` — панель календаря диапазона
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import { STACKING_PORTAL } from '@ui/stacking';
import { type AppTheme } from '@ui/theme';

/**
 * getPortalPanelStyles — возвращает CSS-правила хрома панели портала:
 * fixed-позицию у угла, слой `STACKING_PORTAL`, поверхность, рамку, тень,
 * радиус и постоянное фокус-кольцо. Опционально — `padding`.
 *
 * @param options тема, радиус и опциональный отступ
 * @returns CSS-правила, каждое с новой строки
 */
export function getPortalPanelStyles(options: {
  borderRadius: string;
  padding?: string;
  theme: AppTheme;
}): string {
  const { borderRadius, padding, theme } = options;

  const styles = [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    `z-index: ${STACKING_PORTAL};`,
    `background-color: ${theme.colors.surface};`,
    getBorderStyles(theme),
    `border-radius: ${borderRadius};`,
    getOutlineStyles(theme.colors.focusOutline),
  ];

  if (padding !== undefined) {
    styles.push(`padding: ${padding};`);
  }

  return styles.join('\n');
}
