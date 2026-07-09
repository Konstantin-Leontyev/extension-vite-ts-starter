import { Listbox, type ListboxOption } from '@ui/listbox';
import { DEFAULT_TONE, TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

/**
 * Сателит витрины: листбокс выбора тона. Не переносить в продуктовый код и в ui/.
 *
 * Подбор допустимых опций («не предлагать тон заливки») — UX настроек ДС,
 * не поведение примитива: примитив красит то, что ему передали, а контраст
 * по умолчанию обеспечивает CSS контрола. В реальном проекте call site просто
 * не передаёт тон, совпадающий с заливкой.
 */
type ToneListboxProps<Tone extends string> = {
  /**
   * Тон заливки контрола — исключается из опций, чтобы выбор не сливался с фоном.
   * `default` остаётся всегда: это наследование цвета с контрола, не дубль заливки.
   */
  excludeFill?: Tone;
  label: string;
  /**
   * Значения оси; по умолчанию — канонический ряд TONE_PRESET_KEYS.
   * Для расширенной оси примитива — ключи его списка (например TEXT_TONE_KEYS).
   */
  tones?: readonly Tone[];
  value: Tone;
  onChange: (tone: Tone) => void;
};

export function ToneListbox<Tone extends string = TonePreset>({
  excludeFill,
  label,
  tones,
  value,
  onChange,
}: ToneListboxProps<Tone>) {
  // Дефолт валиден только для оси-канона; расширенная ось передаёт свои ключи явно.
  const axisTones = tones ?? (TONE_PRESET_KEYS as readonly string[] as readonly Tone[]);
  const availableTones = excludeFill
    ? axisTones.filter((tone) => tone !== excludeFill || tone === DEFAULT_TONE)
    : axisTones;
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
