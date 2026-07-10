/**
 * Файл: `src/ui/tones.ts`
 * Этот файл содержит утилиты для работы с тонами.
 * Тон — семантическая цветовая роль из темы. Компоненты используют единый набор ролей
 * (`primary`, `danger`, `success`, `warning`) без привязки к конкретным hex-значениям.
 *
 * Основные задачи:
 * 1. Определить канонический набор тонов (`TonePreset`)
 * 2. Предоставить утилиты для получения цвета темы по тону
 *
 * Потребители: kit-контролы и примитивы (`@ui/button`, `@ui/tag`, `@ui/toast`,
 * `@ui/text`, `@ui/progress-bar`, `@ui/spinner`), витрина дизайн-системы (`src/pages/design-system/tone-listbox`).
 */

import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * TonePreset — тип, представляющий все доступные канонические тона.
 * Используется как основной тип для пропсов, связанных с цветовыми ролями.
 */
export type TonePreset = 'danger' | 'default' | 'primary' | 'success' | 'warning';

/**
 * TONE_PRESETS — приватная карта соответствия тонов и ключей цвета в теме.
 *
 * Канон включает основные семантические роли:
 *  - `default` — нейтральный тон без собственного цвета (наследуется от родителя).
 *  - `danger`, `success`, `warning` — статусные цвета
 *  - `primary` — акцентный цвет
 *
 * Карта используется как единый источник истины для типа `TonePreset`.
 *
 * Прямое обращение к карте из вызывающего кода запрещено, чтобы избежать случайных изменений.
 * Для работы с тонами используются геттеры `getToneKey` и `getToneColor` из публичного API модуля.
 */
export const TONE_PRESETS = {
  danger: 'danger',
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<TonePreset, keyof ThemeColors | undefined>;

/** DEFAULT_TONE — значение по умолчанию для оси `tone`. */
export const DEFAULT_TONE: TonePreset = 'default';

/**
 * TONE_PRESET_KEYS — массив ключей канонической карты `TONE_PRESETS`.
 * Единый источник перечня `TonePreset` (например, для опций в настройках витрины).
 */
export const TONE_PRESET_KEYS = Object.keys(TONE_PRESETS) as TonePreset[];

/**
 * getToneKey — возвращает ключ цвета в теме для указанного тона.
 * Для тона по умолчанию возвращает `undefined` (цвет не задан).
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
 * для тона по умолчанию — запасной `fallbackColor`.
 *
 * @param theme — текущая тема
 * @param tone — тон из канона
 * @param fallbackColor — цвет, который будет использован по умолчанию
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
