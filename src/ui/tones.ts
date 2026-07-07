/**
 * Файл: tones.ts
 * Этот файл содержит утилиты для работы с семантическими тонами (цветовыми ролями).
 * Тон — это абстракция над цветами темы, которая позволяет компонентам
 * использовать единую систему цветовых ролей (primary, danger, success, warning)
 * без привязки к конкретным hex-значениям.
 *
 * Основные задачи:
 * 1. Определить канонический набор тонов (TonePreset)
 * 2. Предоставить утилиты для получения цвета темы по тону
 */

import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * TONE_PRESETS — каноническая карта соответствия тонов и ключей цвета в теме.
 * Для тона 'default' цвет не задан (undefined), так как он использует
 * контекстный цвет (наследование от родителя).
 *
 * Канон включает только основные семантические роли:
 * - danger, success, warning — статусные цвета
 * - primary — акцентный цвет
 * - default — нейтральный (без собственного цвета)
 *
 * Используется как единый источник истины для:
 * - типа TonePreset (ключи карты)
 * - получения ключа цвета темы для тона
 *
 * Экспортируется для расширения спредом в примитивах, которым нужен свой тон
 * сверх канона (Text: muted). Прямое чтение карты на call site запрещено —
 * снаружи только getToneKey / getToneColor.
 */
export const TONE_PRESETS = {
  danger: 'danger',
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
} as const satisfies Record<string, keyof ThemeColors | undefined>;

/**
 * TonePreset — тип, представляющий все доступные канонические тона.
 * Используется как основной тип для пропсов, связанных с цветовыми ролями.
 */
export type TonePreset = keyof typeof TONE_PRESETS;

/**
 * DEFAULT_TONE — значение по умолчанию для тона.
 * 'default' означает нейтральный тон без собственного цвета.
 */
export const DEFAULT_TONE: TonePreset = 'default';

/**
 * TONE_PRESET_KEYS — все ключи канонической карты TONE_PRESETS.
 * Единый источник перечня TonePreset (например, для опций в настройках витрины).
 */
export const TONE_PRESET_KEYS = Object.keys(TONE_PRESETS) as TonePreset[];

/**
 * getToneKey — возвращает ключ цвета в теме для указанного тона.
 * Для 'default' возвращает undefined (цвет не задан).
 *
 * @param tone — тон из канона
 * @returns ключ цвета темы или undefined
 */
export function getToneKey(tone: TonePreset): keyof ThemeColors | undefined {
  return TONE_PRESETS[tone];
}

/**
 * getToneColor — возвращает цвет темы для указанного тона.
 * Если тон имеет цвет в теме (не 'default'), возвращает его.
 * Иначе возвращает fallbackColor (цвет, переданный как запасной вариант).
 *
 * @param theme — текущая тема
 * @param tone — тон из канона
 * @param fallbackColor — цвет, который будет использован для 'default'
 * @returns цвет темы или fallbackColor
 */
export function getToneColor(
  theme: AppTheme,
  tone: TonePreset,
  fallbackColor: string
): string {
  const colorKey = getToneKey(tone);

  return colorKey ? theme.colors[colorKey] : fallbackColor;
}
