/**
 * Файл: `src/ui/anchored-portal/anchored-portal.styles.ts`
 * Содержит генератор хрома панели AnchoredPortal.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/anchored-portal/index.tsx` — реэкспортирует `getPortalPanelStyles` в публичное API
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
 * fixed-позицию у угла, слой `STACKING_PORTAL`, опциональный отступ через `padding`,
 * поверхность, рамку с тенью, радиус и постоянное фокус-кольцо.
 * Собственных styled-узлов у AnchoredPortal нет — вызывающий код объявляет
 * панель-узел и подставляет генератор в своём styles-файле.
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
  ];

  if (padding !== undefined) {
    styles.push(`padding: ${padding};`);
  }

  styles.push(
    `background-color: ${theme.colors.surface};`,
    getBorderStyles(theme),
    `border-radius: ${borderRadius};`,
    getOutlineStyles(theme.colors.focusOutline)
  );

  return styles.join('\n');
}
