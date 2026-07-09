/**
 * Файл: pages/design-system/tone-listbox/index.tsx
 * Сателлит витрины дизайн-системы: листбокс для выбора семантического тона.
 * Не переносить в продуктовый код и в ui/ — только для ДС.
 *
 * Основные задачи:
 * 1. Предоставить список тонов для выбора в настройках компонентов
 * 2. Поддерживать фильтрацию тона, совпадающего с заливкой (`excludeTone`)
 * 3. Поддерживать расширенные оси тонов (например, Text с `muted`)
 *
 * Потребители: страницы дизайн-системы (настройки Button, Tag, Toast и т.д.)
 *
 * Подбор допустимых опций («не предлагать тон заливки») — UX настроек ДС,
 * не поведение примитива: примитив красит то, что ему передали, а контраст
 * по умолчанию обеспечивает CSS контрола. В реальном проекте call site просто
 * не передаёт тон, совпадающий с заливкой.
 */

import { Listbox, type ListboxOption } from '@ui/listbox';
import { DEFAULT_TONE, TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

type ToneListboxProps<Tone extends string> = {
  /**
   * `excludeTone` — тон заливки контрола, исключается из опций, чтобы выбор не сливался с фоном.
   * `default` остаётся всегда: это наследование цвета с контрола, не дубль заливки.
   */
  excludeTone?: Tone;
  /** `label` — текст лейбла над листбоксом. */
  label: string;
  /**
   * `tones` — значения оси; по умолчанию — канонический ряд `TONE_PRESET_KEYS`.
   * Для расширенной оси примитива — ключи его списка (например `TEXT_TONE_KEYS`).
   */
  tones?: readonly Tone[];
  /** `value` — текущий выбранный тон. */
  value: Tone;
  /** `onChange` — колбэк при изменении тона. */
  onChange: (tone: Tone) => void;
};

/**
 * ToneListbox — листбокс для выбора семантического тона в витрине дизайн-системы.
 * Поддерживает фильтрацию тона заливки и расширенные оси тонов.
 *
 * @example
 * <ToneListbox label="Tone:" value={tone} onChange={setTone} />
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
  // Дефолт валиден только для канона. Расширенная ось передаёт свои ключи явно.
  const toneList = tones ?? (TONE_PRESET_KEYS as readonly string[] as readonly Tone[]);
  const availableTones = excludeTone
    ? toneList.filter((tone) => tone !== excludeTone || tone === DEFAULT_TONE)
    : toneList;
  const options: ListboxOption[] = availableTones.map((tone) => ({
    label: tone,
    value: tone,
  }));

  return (
    <Listbox
      label={label}
      options={options}
      reserveErrorSpace={false}
      value={availableTones.includes(value) ? value : DEFAULT_TONE}
      onChange={(nextTone) => onChange(nextTone as Tone)}
    />
  );
}
