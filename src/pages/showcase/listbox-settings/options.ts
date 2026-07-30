/**
 * Файл: `src/pages/showcase/listbox-settings/options.ts`
 * Содержит демо-опции Listbox для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить опции `LISTBOX_DEMO_OPTIONS` для превью Listbox
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — передаёт опции в превью виджета Listbox
 */

import { type ListboxOption } from '@ui/listbox';

/**
 * LISTBOX_DEMO_OPTIONS — задаёт опции Listbox в демо витрины.
 * Используется в превью Listbox витрины дизайн-системы.
 */
export const LISTBOX_DEMO_OPTIONS: ListboxOption[] = [
  { label: 'neutral', value: 'neutral' },
  { label: 'primary', value: 'primary' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'danger', value: 'danger' },
];
