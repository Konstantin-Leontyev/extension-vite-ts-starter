import { type ComboboxOption } from '@ui/combobox';

import {
  SHOWCASE_ICON_COMBOBOX_OPTIONS,
  SHOWCASE_ICON_OPTIONS,
  formatShowcaseIconLabel,
  type ShowcaseIconKey,
} from '../showcase-icons';

/** Демо-набор Combobox в витрине: подписи без слота `icon` (включается чекбоксом Icon). */
export const COMBOBOX_DEMO_OPTIONS: ComboboxOption[] = SHOWCASE_ICON_OPTIONS.map(
  ({ value }) => ({
    label: formatShowcaseIconLabel(value as ShowcaseIconKey),
    value,
  })
);

export { SHOWCASE_ICON_COMBOBOX_OPTIONS };
