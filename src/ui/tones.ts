import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * Каноническая ось семантического тона: ключ цвета в теме или нейтраль (`default`).
 * Источник union для tone/borderTone/textColor и т.п. у разных примитивов.
 */
const TONE_THEME_COLOR = {
  danger: 'danger',
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<string, keyof ThemeColors | undefined>;

export type TonePreset = keyof typeof TONE_THEME_COLOR;

export const DEFAULT_TONE_PRESET: TonePreset = 'default';

const ALL_TONE_PRESETS = Object.keys(TONE_THEME_COLOR) as TonePreset[];

const COLORED_TONE_PRESETS = ALL_TONE_PRESETS.filter(
  (tone) => TONE_THEME_COLOR[tone] !== undefined
);

export function toTonePresetOptions(
  tones: readonly TonePreset[]
): { label: string; value: string }[] {
  return tones.map((tone) => ({ label: tone, value: tone }));
}

/** Опции listbox/settings: все значения оси tone. */
export const TONE_PRESET_OPTIONS = toTonePresetOptions(ALL_TONE_PRESETS);

/** Ключ цвета темы для тона; для `default` — undefined. */
export function toneThemeColorKey(tone: TonePreset): keyof ThemeColors | undefined {
  return TONE_THEME_COLOR[tone];
}

/** Цвет темы для тона; для `default` — fallback (рамка, surface и т.д.). */
export function toneThemeColor(
  theme: AppTheme,
  tone: TonePreset,
  fallbackColor: string
): string {
  const colorKey = toneThemeColorKey(tone);

  return colorKey ? theme.colors[colorKey] : fallbackColor;
}

/** Тон текста/глифа: default + цветные, кроме совпадающего с заливкой (иначе сольётся). */
export function tonePresetsExcludingFill(fillTone: TonePreset): TonePreset[] {
  return [DEFAULT_TONE_PRESET, ...COLORED_TONE_PRESETS.filter((tone) => tone !== fillTone)];
}

/**
 * Канон локального расширения оси тона. Примитив, которому нужно значение вне
 * канона (Fieldset `inverted`, SegmentButton `muted`), описывает union
 * `TonePreset | Extra` и карту `Extra → ключ темы`. Резолв и опции — через хелперы
 * ниже, без собственной if-цепочки или ручной сборки списка опций.
 */
export type ExtendedTone<Extra extends string> = TonePreset | Extra;

/** Карта локальных значений тона на ключи темы (`{ inverted: 'inverse' }`). */
export type ToneExtraColors<Extra extends string> = Record<Extra, keyof ThemeColors>;

/** Опции listbox/settings для расширенной оси: канон + локальные значения. */
export function extendedToneOptions(
  extras: readonly string[]
): { label: string; value: string }[] {
  return [
    ...TONE_PRESET_OPTIONS,
    ...extras.map((extra) => ({ label: extra, value: extra })),
  ];
}

/**
 * Резолв расширенного тона в цвет: сначала локальная карта `extras`, затем канон,
 * иначе `fallbackColor`. `fallbackColor: undefined` → вернёт `undefined` для
 * нейтрального тона (наследование цвета родителя), `string` → всегда строка.
 */
export function resolveExtendedToneColor<Extra extends string>(
  theme: AppTheme,
  tone: ExtendedTone<Extra>,
  extras: ToneExtraColors<Extra>,
  fallbackColor: string
): string;
export function resolveExtendedToneColor<Extra extends string>(
  theme: AppTheme,
  tone: ExtendedTone<Extra>,
  extras: ToneExtraColors<Extra>,
  fallbackColor: undefined
): string | undefined;
export function resolveExtendedToneColor<Extra extends string>(
  theme: AppTheme,
  tone: ExtendedTone<Extra>,
  extras: ToneExtraColors<Extra>,
  fallbackColor: string | undefined
): string | undefined {
  const extraKey = (extras as Record<string, keyof ThemeColors | undefined>)[tone];

  if (extraKey) {
    return theme.colors[extraKey];
  }

  const canonicalKey = toneThemeColorKey(tone as TonePreset);

  return canonicalKey ? theme.colors[canonicalKey] : fallbackColor;
}
