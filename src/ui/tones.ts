/**
 * Файл: `src/ui/tones.ts`
 * Определяет канонический набор семантических тонов и утилиты для работы с цветами темы.
 * Тон задаёт цветовую роль без привязки к конкретным hex-значениям.
 *
 * Основные задачи:
 * 1. Определить тип `TonePreset`
 * 2. Связать тоны с ключами цвета через `TONE_PRESETS`
 * 3. Задать значение по умолчанию через `DEFAULT_TONE`
 * 4. Предоставить перечень тонов через `TONE_PRESET_KEYS`
 * 5. Предоставить утилиты `getToneKey` и `getToneColor`
 *
 * Потребители:
 *  - `@ui/button`, `@ui/tag`, `@ui/toast`, `@ui/text`, `@ui/progress-bar`, `@ui/spinner` —
 *    задают цвет контролов через тон
 *  - `@ui/fieldset` — расширяет канонический набор тонов
 *  - `src/pages/design-system/tone-listbox` — опции витрины дизайн-системы
 */

import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * TonePreset — представляет все доступные канонические тона.
 * Используется как основной тип для пропсов, связанных с цветовыми ролями.
 */
export type TonePreset = 'danger' | 'default' | 'primary' | 'success' | 'warning';

/**
 * TONE_PRESETS — связывает канонические тона с ключами цвета в теме.
 * Значение `undefined` для тона по умолчанию означает отсутствие собственного цвета.
 *
 * Канон включает основные семантические роли:
 *  - `default` — нейтральный тон, цвет наследуется от родителя
 *  - `danger`, `success`, `warning` — статусные цвета
 *  - `primary` — акцентный цвет
 *
 * Ключи задают тип `TonePreset`. Соответствие экспортируется для расширения
 * спредом в `@ui/text` и `@ui/fieldset` и заморожено `Object.freeze`:
 * `as const` закрепляет readonly-типы на этапе компиляции, заморозка защищает
 * рантайм — попытка изменить значение бросит ошибку в месте записи.
 * Чтение цвета — через `getToneKey` и `getToneColor`.
 */
export const TONE_PRESETS = Object.freeze({
  danger: 'danger',
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<TonePreset, keyof ThemeColors | undefined>);

/**
 * DEFAULT_TONE — задаёт тон по умолчанию для пропа `tone`.
 * Используется в контролах, где тон опционален.
 */
export const DEFAULT_TONE: TonePreset = 'default';

/**
 * TONE_PRESET_KEYS — формирует перечень канонических тонов из ключей `TONE_PRESETS`.
 * Используется в опциях витрины дизайн-системы.
 * Создаётся из `Object.keys(TONE_PRESETS)`, чтобы при добавлении нового тона
 * не требовалось обновлять перечень вручную.
 */
export const TONE_PRESET_KEYS = Object.keys(TONE_PRESETS) as TonePreset[];

/**
 * getToneKey — возвращает ключ цвета в теме для указанного тона.
 * Для тона по умолчанию возвращает `undefined`.
 *
 * @param tone — тон из канона
 * @returns ключ цвета темы или `undefined`
 */
export function getToneKey(tone: TonePreset): keyof ThemeColors | undefined {
  return TONE_PRESETS[tone];
}

/**
 * getToneColor — возвращает цвет темы для указанного тона.
 * Для тона с собственным цветом в теме возвращает этот цвет,
 * для тона по умолчанию — запасной цвет из `fallbackColor`.
 *
 * @param theme — текущая тема
 * @param tone — тон из канона
 * @param fallbackColor — цвет, который подставляется для тона по умолчанию
 * @returns цвет темы или `fallbackColor`
 */
export function getToneColor(
  theme: AppTheme,
  tone: TonePreset,
  fallbackColor: string
): string {
  const colorKey = getToneKey(tone);

  return colorKey ? theme.colors[colorKey] : fallbackColor;
}
