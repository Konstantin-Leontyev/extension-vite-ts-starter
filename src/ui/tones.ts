/**
 * Файл: `src/ui/tones.ts`
 * Определяет канонический набор семантических тонов и утилиты для работы с цветами темы.
 * Задаёт цветовую роль без привязки к конкретным hex-значениям.
 *
 * Основные задачи:
 * 1. Типизировать канонические тоны через `TonePreset`
 * 2. Связать тоны с ключами цвета через `TONE_PRESETS`
 * 3. Задать значение по умолчанию через `DEFAULT_TONE`
 * 4. Предоставить перечень тонов через `TONE_PRESET_KEYS`
 * 5. Задать доли смешения `BORDER_SURFACE_MIX_PERCENT` и `VARIANT_SURFACE_MIX_PERCENT`
 * 6. Предоставить утилиты `getToneColorKey`, `getToneColor`, `resolveColorMix`
 *    и `resolveVeilBackground`
 *
 * Потребители:
 *  - контролы, например Button, Tag и Toast — задают цвет через тон
 *  - контролы, например Button, Tag, Icon и Table — смешивают цвета темы через
 *    `resolveColorMix`
 *  - контролы, например Button и Icon — читают доли смешения
 *    `BORDER_SURFACE_MIX_PERCENT` и `VARIANT_SURFACE_MIX_PERCENT`
 *  - контролы, например Button и Icon — кладут вуаль поверх непрозрачной нейтральной
 *    заливки через `resolveVeilBackground`
 *  - `@ui/fieldset` — расширяет канонический набор тонов
 *  - панели настроек витрины дизайн-системы — передают `TONE_PRESET_KEYS` в `ToneListbox`
 *  - `src/pages/showcase/tone-listbox/index.tsx` — фильтрует тоны и подставляет
 *    запасной через `DEFAULT_TONE`
 */

import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * TonePreset — представляет все доступные канонические тона.
 * Используется как основной тип для пропсов, связанных с цветовыми ролями.
 */
export type TonePreset = 'danger' | 'default' | 'primary' | 'success' | 'warning';

/**
 * TONE_PRESETS — связывает канонические тона с ключами цвета в теме.
 *
 * Канон включает основные семантические роли:
 *  - `default` — нейтральный тон, цвет наследуется от родителя
 *  - `danger`, `success`, `warning` — статусные цвета
 *  - `primary` — акцентный цвет
 *
 * Ключи задают тип `TonePreset`. Соответствие экспортируется для расширения
 * спредом в `@ui/text` и `@ui/fieldset`, чтение цвета — через `getToneColorKey`
 * и `getToneColor`.
 */
export const TONE_PRESETS = Object.freeze({
  danger: 'danger',
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<TonePreset, keyof ThemeColors | undefined>);

/**
 * TONE_PRESET_KEYS — формирует перечень канонических тонов из ключей `TONE_PRESETS`.
 * Используется в панелях настроек витрины дизайн-системы: `ToneListbox` принимает его пропом `tones`.
 */
export const TONE_PRESET_KEYS = Object.freeze(Object.keys(TONE_PRESETS) as TonePreset[]);

/**
 * DEFAULT_TONE — задаёт тон по умолчанию.
 * Используется, когда вызывающий код не передал проп `tone`.
 */
export const DEFAULT_TONE: TonePreset = 'default';

/**
 * getToneColorKey — возвращает ключ цвета в теме для указанного тона.
 * Для тона по умолчанию возвращает `undefined`.
 *
 * @param tone семантический тон
 * @returns ключ цвета темы или `undefined`
 */
export function getToneColorKey(tone: TonePreset): keyof ThemeColors | undefined {
  return TONE_PRESETS[tone];
}

/**
 * getToneColor — возвращает цвет темы для указанного тона.
 * Для тона с собственным цветом в теме возвращает этот цвет,
 * для тона по умолчанию — запасной цвет из `fallbackColor`.
 *
 * @param theme текущая тема
 * @param tone семантический тон
 * @param fallbackColor цвет, который подставляется для тона по умолчанию
 * @returns цвет темы или `fallbackColor`
 */
export function getToneColor(
  theme: AppTheme,
  tone: TonePreset,
  fallbackColor: string
): string {
  const colorKey = getToneColorKey(tone);

  return colorKey ? theme.colors[colorKey] : fallbackColor;
}

/**
 * SHADE_KEEP_PERCENT — задаёт долю исходного цвета в `resolveColorMix` по умолчанию.
 * Используется, когда вызывающий код не передал `colorPercent`: сдвиг непрозрачной
 * цветной заливки к `shade` темы в состояниях `hover` и `active`.
 */
const SHADE_KEEP_PERCENT = 80;

/**
 * BORDER_SURFACE_MIX_PERCENT — задаёт долю `border` в смеси с `surface`.
 * Используется для `active`-заливки нейтральной непрозрачной секции, например лейбла Button.
 */
export const BORDER_SURFACE_MIX_PERCENT = 40;

/**
 * VARIANT_SURFACE_MIX_PERCENT — задаёт долю акцентного цвета в смеси с `surface`.
 * Используется для `active`-заливки нейтральной секции иконки.
 */
export const VARIANT_SURFACE_MIX_PERCENT = 12;

/**
 * resolveColorMix — возвращает смесь двух цветов через `color-mix` в пространстве `srgb`.
 * Единственный способ смешения цветов в компонентах: сдвиг заливки в состояниях —
 * база `theme.colors.shade`, размывка по поверхности — база `theme.colors.surface`,
 * тинт — база `transparent`.
 *
 * @param color исходный цвет
 * @param base цвет-база смеси
 * @param colorPercent доля исходного цвета в процентах, остаток — база.
 *   Умолчание `SHADE_KEEP_PERCENT` — сдвиг заливки состояния
 * @returns значение для CSS-свойств `background-color` и `color`
 */
export function resolveColorMix(
  color: string,
  base: string,
  colorPercent: number = SHADE_KEEP_PERCENT
): string {
  return `color-mix(in srgb, ${color} ${colorPercent}%, ${base})`;
}

/**
 * resolveVeilBackground — возвращает значение шортката `background`: вуаль
 * `theme.colors.veil` слоем `linear-gradient` поверх собственной заливки узла.
 * Полупрозрачная вуаль не выражается одним `background-color` поверх непрозрачной
 * заливки, поэтому композиция собирается из слоя-градиента и цвета подложки.
 *
 * @param theme текущая тема
 * @param backgroundColor собственная заливка узла под вуалью
 * @returns значение для CSS-свойства `background`
 */
export function resolveVeilBackground(theme: AppTheme, backgroundColor: string): string {
  return `linear-gradient(${theme.colors.veil}, ${theme.colors.veil}) ${backgroundColor}`;
}
