/**
 * Файл: `src/pages/design-system/tone-listbox/index.tsx`
 * Предоставляет листбокс выбора семантического тона для витрины дизайн-системы.
 * Ограничивает использование только витриной, не для продуктового кода и `@ui/`.
 *
 * Основные задачи:
 * 1. Предоставить выбор семантического тона в панелях настроек компонентов витрины
 * 2. Отфильтровать переданный перечень тонов через `excludeTone`
 * 3. Экспортировать компонент `ToneListbox`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают семантический тон:
 *     - `src/pages/design-system/button-settings/index.tsx`
 *     - `src/pages/design-system/tag-settings/index.tsx`
 *     - `src/pages/design-system/range-input-settings/index.tsx`
 *     - `src/pages/design-system/segment-button-settings/index.tsx`
 *     - `src/pages/design-system/card-settings/index.tsx`
 *     - `src/pages/design-system/fieldset-settings/index.tsx`
 *     - `src/pages/design-system/toast-settings/index.tsx`
 *     - `src/pages/design-system/text-settings/index.tsx`
 *     - `src/pages/design-system/progress-bar-settings/index.tsx`
 *     - `src/pages/design-system/spinner-settings/index.tsx`
 *     - `src/pages/design-system/switch-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

/**
 * getAvailableTones — возвращает перечень допустимых тонов из переданного списка.
 * При переданном `excludeTone` исключает совпадающий тон.
 * Значение `default` остаётся всегда.
 *
 * @param tones — исходный перечень тонов
 * @param excludeTone — тон, исключаемый из результата
 * @returns отфильтрованный перечень тонов
 */
function getAvailableTones<Tone extends string>(
  tones: readonly Tone[],
  excludeTone?: Tone
): Tone[] {
  if (!excludeTone) {
    return [...tones];
  }

  return tones.filter((tone) => tone !== excludeTone || tone === DEFAULT_TONE);
}

/**
 * getToneListboxOptions — преобразует перечень тонов в опции Listbox.
 *
 * @param tones — исходный перечень тонов
 * @param excludeTone — тон, исключаемый из опций
 * @returns опции для Listbox
 */
function getToneListboxOptions<Tone extends string>(
  tones: readonly Tone[],
  excludeTone?: Tone
): ListboxOption[] {
  return getAvailableTones(tones, excludeTone).map((tone) => ({
    label: tone,
    value: tone,
  }));
}

/**
 * getToneListboxValue — возвращает выбранный тон, если он есть в допустимом перечне.
 * Иначе возвращает `default`, если тон выпал из списка после смены `excludeTone`.
 *
 * @param value — текущий выбранный тон
 * @param tones — исходный перечень тонов
 * @param excludeTone — тон, исключаемый из допустимого перечня
 * @returns тон для значения Listbox
 */
function getToneListboxValue<Tone extends string>(
  value: Tone,
  tones: readonly Tone[],
  excludeTone?: Tone
): Tone {
  return getAvailableTones(tones, excludeTone).includes(value)
    ? value
    : (DEFAULT_TONE as Tone);
}

/**
 * ToneListboxProps — представляет пропсы компонента ToneListbox.
 *
 * @property excludeTone — тон, исключаемый из списка опций, чтобы вторичный выбор
 *   не совпадал с уже выбранным тоном. Значение `default` остаётся всегда
 * @property label — текст подписи над листбоксом
 * @property tones — перечень допустимых тонов из настраиваемого компонента,
 *   например `TONE_PRESET_KEYS` или `TEXT_TONE_KEYS`
 * @property value — текущий выбранный тон
 * @property onChange — обработчик изменения выбранного тона
 */
type ToneListboxProps<Tone extends string> = {
  excludeTone?: Tone;
  label: string;
  tones: readonly Tone[];
  value: Tone;
  onChange: (tone: Tone) => void;
};

/**
 * ToneListbox — отображает листбокс выбора семантического тона в витрине дизайн-системы.
 *
 * @example
 * <ToneListbox
 *   label="Tone:"
 *   tones={TONE_PRESET_KEYS}
 *   value={tone}
 *   onChange={setTone}
 * />
 * <ToneListbox
 *   label="Text tone:"
 *   tones={TEXT_TONE_KEYS}
 *   excludeTone="primary"
 *   value={textTone}
 *   onChange={setTextTone}
 * />
 */
export function ToneListbox<Tone extends string = TonePreset>({
  excludeTone,
  label,
  tones,
  value,
  onChange,
}: ToneListboxProps<Tone>) {
  return (
    <Listbox
      label={label}
      options={getToneListboxOptions(tones, excludeTone)}
      reserveErrorSpace={false}
      value={getToneListboxValue(value, tones, excludeTone)}
      onChange={(nextTone) => onChange(nextTone as Tone)}
    />
  );
}
