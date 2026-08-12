/**
 * Файл: `src/ui/surface.ts`
 * Определяет заливку поверхности и утилиту чтения её цвета из темы.
 *
 * Основные задачи:
 * 1. Типизировать заливку поверхности через `SurfaceBackground`
 * 2. Связать заливки с ключами цвета через `SURFACE_BACKGROUND_PRESETS`
 * 3. Задать значение по умолчанию через `DEFAULT_SURFACE_BACKGROUND`
 * 4. Предоставить перечень заливок через `SURFACE_BACKGROUND_KEYS`
 * 5. Предоставить утилиту `getSurfaceBackgroundColor`
 *
 * Потребители:
 *  - `@ui/card` и `@ui/toolbar` — читают цвет заливки через `getSurfaceBackgroundColor`
 *    и дефолт `DEFAULT_SURFACE_BACKGROUND`
 *  - `src/pages/showcase/background-listbox/index.tsx` — собирает опции Listbox из
 *    `SURFACE_BACKGROUND_KEYS`
 *  - панели настроек витрины дизайн-системы — типизируют заливку через `SurfaceBackground`:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/modal-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { type AppTheme, type ThemeColors } from '@ui/theme';

/**
 * SurfaceBackground — представляет заливку поверхности: поверхность, фон страницы
 * или прозрачную. Рамку и тень включают пропсы `showBorder` и `showShadow`, заливка
 * их не гасит.
 * Используется как тип пропа `background` у Card и Toolbar и в панелях настроек витрины.
 */
export type SurfaceBackground = 'background' | 'surface' | 'transparent';

/**
 * SURFACE_BACKGROUND_PRESETS — связывает заливки поверхности с ключами цвета в теме.
 * Ключ — заливка из `SurfaceBackground`, значение — ключ цвета темы или `undefined`
 * для прозрачной заливки.
 *
 * Соответствие приватно для модуля, доступ к цвету — только через `getSurfaceBackgroundColor`.
 */
const SURFACE_BACKGROUND_PRESETS = {
  surface: 'surface',
  background: 'background',
  transparent: undefined,
} as const satisfies Record<SurfaceBackground, keyof ThemeColors | undefined>;

/**
 * SURFACE_BACKGROUND_KEYS — формирует перечень заливок поверхности из ключей `SURFACE_BACKGROUND_PRESETS`.
 * Используется в панелях настроек витрины дизайн-системы: `BackgroundListbox` собирает
 * из него опции для `Listbox`.
 */
export const SURFACE_BACKGROUND_KEYS = Object.freeze(
  Object.keys(SURFACE_BACKGROUND_PRESETS) as SurfaceBackground[]
);

/**
 * DEFAULT_SURFACE_BACKGROUND — задаёт заливку поверхности по умолчанию.
 * Используется, когда вызывающий код не передал проп `background`.
 */
export const DEFAULT_SURFACE_BACKGROUND: SurfaceBackground = 'surface';

/**
 * getSurfaceBackgroundColor — возвращает значение для CSS-свойства `background-color`
 * по заливке поверхности.
 * Для прозрачной заливки возвращает `transparent`, иначе цвет из темы.
 *
 * @param theme текущая тема
 * @param background заливка поверхности
 * @returns значение для CSS-свойства `background-color`
 */
export function getSurfaceBackgroundColor(
  theme: AppTheme,
  background: SurfaceBackground
): string {
  const colorKey = SURFACE_BACKGROUND_PRESETS[background];

  return colorKey === undefined ? 'transparent' : theme.colors[colorKey];
}
