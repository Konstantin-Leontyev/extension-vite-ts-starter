/**
 * Файл: `src/ui/locale-picker/index.tsx`
 * Предоставляет компонент LocalePicker для отображения выбора языка.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - форму через проп `shape`
 *  - вид триггера через проп `appearance`
 *  - рамку вида `icon` через проп `showBorder`
 *  - тень вида `icon` через проп `showShadow`
 *  - запасной глиф через проп `icon`. Без пропа вид `icon` показывает землю.
 *    У вида `field` не рисуется
 *  - тон рамки через проп `borderTone`
 *  - тон глифа шеврона через проп `iconFill`. Только у вида `field`
 *  - позицию шеврона через проп `iconPosition`. Только у вида `field`
 *  - тон секции шеврона через проп `iconTone`. Только у вида `field`
 *  - начальное значение через проп `defaultValue`
 *  - недоступное состояние через проп `disabled`
 *  - текст пустого результата поиска через проп `emptyMessage`
 *  - подпись над триггером через проп `label`
 *  - обработчик изменения значения через проп `onChange`
 *  - опции списка через проп `options`. Без пропа — полный перечень iso-639-1
 *  - плейсхолдер пустого триггера через проп `placeholder`
 *  - плейсхолдер поля поиска через проп `searchPlaceholder`. Без пропа поле ставит
 *    `Search…`, пустая строка перебивает
 *  - контролируемое значение через проп `value`
 *  - опциональный сброс выбора через проп `showClearButton`. Только у вида `field`.
 *    Базовая логика — шеврон. Кнопка сброса появляется при выборе, только когда
 *    проп включён
 *  - доступное имя кнопки сброса через проп `clearAriaLabel`. Без пропа имя —
 *    `resolveClearAriaLabel`
 *
 * Основные задачи:
 * 1. Экспортировать компонент LocalePicker
 * 2. Типизировать пропсы через `LocalePickerProps`
 * 3. Реэкспортировать `getLocaleOptions`
 * 4. Всегда включать поиск в Listbox и не отдавать `multiple` и `inlineCheckbox`
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 *  - `src/pages/showcase/locale-slice.ts` — собирает срез опций через `getLocaleOptions`
 */

import { type ComponentProps } from 'react';

import { EarthIcon } from '@icons';
import { Listbox, type ListboxAppearanceProps, type ListboxOption } from '@ui/listbox';
import { type DistributiveOmit } from '@ui/type-utils';

import { getLocaleOptions } from './locales';

/**
 * DEFAULT_LOCALE_PICKER_OPTIONS — задаёт перечень языков по умолчанию.
 * Используется, когда вызывающий код не передал проп `options`.
 */
const DEFAULT_LOCALE_PICKER_OPTIONS = getLocaleOptions();

/**
 * LocalePickerProps — представляет пропсы компонента LocalePicker.
 *
 * @property options — опции списка. Без пропа — полный перечень iso-639-1
 */
type LocalePickerProps = DistributiveOmit<
  ComponentProps<typeof Listbox>,
  | 'appearance'
  | 'clearAriaLabel'
  | 'icon'
  | 'iconFill'
  | 'iconPosition'
  | 'iconTone'
  | 'inlineCheckbox'
  | 'multiple'
  | 'options'
  | 'showBorder'
  | 'showClearButton'
  | 'showSearch'
  | 'showShadow'
> &
  ListboxAppearanceProps & {
    options?: readonly ListboxOption[];
  };

/**
 * LocalePicker — отображает выбор языка.
 *
 * @example
 * <LocalePicker value={locale} onChange={setLocale} />
 * <LocalePicker appearance="icon" options={LOCALE_SLICE_OPTIONS} />
 */
export function LocalePicker({
  icon,
  options = DEFAULT_LOCALE_PICKER_OPTIONS,
  ...rest
}: LocalePickerProps) {
  if (rest.appearance === 'icon') {
    return (
      <Listbox
        {...rest}
        appearance="icon"
        icon={icon ?? <EarthIcon />}
        options={options}
        showSearch
      />
    );
  }

  return <Listbox {...rest} options={options} showSearch />;
}

/* eslint-disable react-refresh/only-export-components -- перечень опций для вызывающего кода */
export { getLocaleOptions };
