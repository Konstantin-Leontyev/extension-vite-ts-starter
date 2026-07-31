/**
 * Файл: `src/pages/showcase/tone-listbox/index.tsx`
 * Предоставляет компонент ToneListbox для выбора семантического тона в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - исключение тона из опций через проп `excludeTone`
 *  - подпись через проп `label`
 *  - обработчик изменения выбранного тона через проп `onChange`
 *  - перечень тонов через проп `tones`
 *  - выбранный тон через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ToneListbox
 * 2. Типизировать пропсы через `ToneListboxProps`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают семантический тон:
 *     - `src/pages/showcase/border-group/index.tsx`
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/fieldset-settings/index.tsx`
 *     - `src/pages/showcase/icon-group/index.tsx`
 *     - `src/pages/showcase/progress-bar-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/spinner-settings/index.tsx`
 *     - `src/pages/showcase/switch-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/text-group/index.tsx`
 *     - `src/pages/showcase/title-group/index.tsx`
 *     - `src/pages/showcase/toast-settings/index.tsx`
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

/**
 * resolveAvailableTones — возвращает перечень допустимых тонов из переданного списка.
 * При переданном `excludeTone` исключает совпадающий тон.
 * Значение `neutral` остаётся всегда.
 *
 * Как работает:
 * 1. Без `excludeTone` возвращает копию исходного перечня
 * 2. Иначе оставляет тона, не совпадающие с `excludeTone`, либо равные
 *    `DEFAULT_TONE` — `neutral` из списка не выпадает
 *
 * @param tones исходный перечень тонов
 * @param excludeTone тон, исключаемый из результата
 * @returns отфильтрованный перечень тонов
 */
function resolveAvailableTones<Tone extends string>(
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
 * @param tones исходный перечень тонов
 * @returns опции для Listbox
 */
function getToneListboxOptions<Tone extends string>(
  tones: readonly Tone[]
): ListboxOption[] {
  return tones.map((tone) => ({
    label: tone,
    value: tone,
  }));
}

/**
 * resolveToneListboxValue — возвращает выбранный тон, если он есть в допустимом перечне.
 * Иначе возвращает `neutral`, если тон выпал из списка после смены `excludeTone`.
 *
 * Как работает:
 * 1. Если `value` есть в `availableTones`, возвращает его
 * 2. Иначе возвращает `DEFAULT_TONE` — тон выпал после смены `excludeTone`
 *
 * @param value текущий выбранный тон
 * @param availableTones допустимый перечень тонов
 * @returns тон для значения Listbox
 */
function resolveToneListboxValue<Tone extends string>(
  value: Tone,
  availableTones: readonly Tone[]
): Tone {
  return availableTones.includes(value) ? value : (DEFAULT_TONE as Tone);
}

/**
 * ToneListboxProps — представляет пропсы компонента ToneListbox.
 *
 * @property excludeTone — тон, исключаемый из списка опций, чтобы вторичный выбор
 *   не совпадал с уже выбранным тоном. Значение `neutral` остаётся всегда
 * @property label — текст подписи над листбоксом
 * @property onChange — обработчик изменения выбранного тона
 * @property tones — перечень допустимых тонов из настраиваемого компонента,
 *   например `TONE_PRESET_KEYS` или `TEXT_TONE_KEYS`
 * @property value — текущий выбранный тон, по умолчанию `neutral`.
 *   Панели передают состояние как есть, не дублируя это умолчание запасными значениями
 */
type ToneListboxProps<Tone extends string> = {
  excludeTone?: Tone;
  label: string;
  onChange: (tone: Tone) => void;
  tones: readonly Tone[];
  value?: Tone;
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
  onChange,
  tones,
  value = DEFAULT_TONE as Tone,
}: ToneListboxProps<Tone>) {
  const availableTones = resolveAvailableTones(tones, excludeTone);

  return (
    <Listbox
      label={label}
      options={getToneListboxOptions(availableTones)}
      value={resolveToneListboxValue(value, availableTones)}
      onChange={(nextTone) => onChange(nextTone as Tone)}
    />
  );
}
