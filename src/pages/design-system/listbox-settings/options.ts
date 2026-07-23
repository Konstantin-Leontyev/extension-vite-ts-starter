/**
 * Файл: `src/pages/design-system/listbox-settings/options.ts`
 * Содержит демо-опции Listbox для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить опции `LISTBOX_DEMO_OPTIONS` для превью и панели настроек Listbox
 *
 * Потребители:
 *  - `src/pages/design-system/listbox-settings/index.tsx` — передаёт опции в контрол Value панели
 *  - `src/pages/design-system/index.tsx` — передаёт опции в превью виджета Listbox
 */

import { type ListboxOption } from '@ui/listbox';

/**
 * LISTBOX_DEMO_OPTIONS — задаёт опции листбокса в демо витрины.
 * Используется в панели настроек и превью Listbox витрины дизайн-системы.
 */
export const LISTBOX_DEMO_OPTIONS: ListboxOption[] = [
  { label: 'default', value: 'default' },
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
];
