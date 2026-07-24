/**
 * Файл: `src/ui/portal-panel.ts`
 * Содержит генератор хрома панели в `document.body` для anchored-портала.
 * Объединяет позицию, слой, заливку, рамку, тень, радиус и постоянное фокус-кольцо.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getPortalPanelStyles`
 *
 * Потребители:
 *  - `src/ui/listbox/listbox.styles.ts` — панель опций
 *  - `src/ui/combobox/combobox.styles.ts` — панель поиска и опций
 *  - `src/ui/range-input/range-input.styles.ts` — панель пресетов и полей
 *  - `src/ui/date-input/date-input.styles.ts` — панель календаря
 *  - `src/ui/date-range-input/date-range-input.styles.ts` — панель календаря диапазона
 */

import { getFocusRingStyles } from '@ui/presets';
import { STACKING_PORTAL } from '@ui/stacking';
import { type AppTheme } from '@ui/theme';

/**
 * getPortalPanelStyles — возвращает CSS-правила хрома панели портала:
 * fixed-позицию у угла, слой `STACKING_PORTAL`, поверхность, рамку, тень,
 * радиус и постоянное фокус-кольцо. Опционально — `padding`.
 *
 * @param args тема, радиус и опциональный padding
 * @returns CSS-правила, каждое с новой строки
 */
export function getPortalPanelStyles(args: {
  borderRadius: string;
  padding?: string;
  theme: AppTheme;
}): string {
  const { borderRadius, padding, theme } = args;

  const styles = [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    `z-index: ${STACKING_PORTAL};`,
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
    `border-radius: ${borderRadius};`,
    getFocusRingStyles(theme.colors.focusRing),
  ];

  if (padding !== undefined) {
    styles.push(`padding: ${padding};`);
  }

  return styles.join('\n');
}
