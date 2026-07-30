/**
 * Файл: `src/ui/border.ts`
 * Содержит управляемую рамку и тень вне layout-box: обводка `0 0 0 1px` и
 * опционально `shadow.surface` одним `box-shadow`, плюс пакет пропсов
 * `BorderProps` для локального opt-in у потребителей.
 *
 * Основные задачи:
 * 1. Типизировать пропсы рамки через `BorderProps` и перечень `BORDER_PROP_NAMES`
 * 2. Предоставить функцию `getBorderStyles` — рамка и тень вне layout-box
 * 3. Предоставить функцию `getBorderColor` — цвет рамки по `borderTone`
 * 4. Задать дефолты пропов `showBorder` и `showShadow` через
 *    `DEFAULT_SHOW_BORDER` и `DEFAULT_SHOW_SHADOW`
 *
 * Потребители:
 *  - styles-файлы с рамкой и тенью, например Card, Icon, Input, Toast и Tag —
 *    подключают `BorderProps` / `BORDER_PROP_NAMES` и подставляют рамку через
 *    `getBorderStyles`
 *  - styles-файлы с постоянной рамкой без публичных пропсов, например Button,
 *    Listbox, Checkbox, RadioButton, AnchoredPortal и SegmentButton —
 *    подставляют `getBorderStyles` с дефолтами
 */

import { type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, getToneColor, type TonePreset } from '@ui/tones';

/**
 * DEFAULT_SHOW_BORDER — задаёт показ рамки по умолчанию.
 * Используется, когда вызывающий код не передал проп `showBorder`.
 */
export const DEFAULT_SHOW_BORDER = true;

/**
 * DEFAULT_SHOW_SHADOW — задаёт показ тени по умолчанию.
 * Используется, когда вызывающий код не передал проп `showShadow`.
 * Тень без рамки в дизайн-системе не существует: при `showBorder={false}`
 * хелпер гасит и тень.
 */
export const DEFAULT_SHOW_SHADOW = true;

/**
 * BorderProps — представляет пропсы управления рамкой и тенью.
 * Подключается локально через `& BorderProps` и `...BORDER_PROP_NAMES`
 * у потребителей, которым нужна ось управления; в `LayoutProps` не входит.
 *
 * @property borderTone — тон цвета рамки при включённом `showBorder`
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 */
export type BorderProps = {
  borderTone?: TonePreset;
  showBorder?: boolean;
  showShadow?: boolean;
};

/**
 * BORDER_PROP_NAMES — хранит имена пропсов пакета `BorderProps`.
 * Компоненты подключают набор спредом в свой `*_PROP_NAMES` вместе с
 * layout-пропами и остальными пропами стилизации.
 */
export const BORDER_PROP_NAMES = new Set(['borderTone', 'showBorder', 'showShadow']);

/**
 * getBorderColor — возвращает цвет рамки по `borderTone`.
 *
 * @param theme текущая тема
 * @param borderTone тон рамки
 * @returns CSS-цвет. Для тона по умолчанию — `theme.colors.border`
 */
export function getBorderColor(
  theme: AppTheme,
  borderTone: TonePreset = DEFAULT_TONE
): string {
  return getToneColor(theme, borderTone, theme.colors.border);
}

/**
 * getBorderStyles — возвращает CSS-правило рамки вне layout-box: обводку
 * `0 0 0 1px` и опционально тень `shadow.surface` одним `box-shadow`.
 * Рамочный и безрамочный режимы дают один `content-box` и одно окно `Icon`,
 * без резерва `border: 1px solid transparent`.
 * Пропсы `showBorder` и `showShadow` подключает потребитель осознанно: эталоны
 * Icon, Card, Input, Toast и Tag. Составные триггеры, например Listbox,
 * Combobox, Stepper и RangeInput, пропсы не получают без отдельного кейса и
 * вызывают хелпер с дефолтами. Оболочка композита и поверхность с постоянной
 * рамкой, например Checkbox и RadioButton, вызывают функцию без флагов.
 * При `showBorder` — обводка цвета из `getBorderColor` и при `showShadow` —
 * тень `shadow.surface`. Без рамки — `box-shadow: none`: тени без рамки нет.
 * `border: none` вызывающий код пишет только там, где layout-рамку даёт
 * UA-стиль тега, например `<input>` и `<dialog>`: у `<button>` её снял reset,
 * у `<div>` рамки нет — повтор запрещён.
 *
 * @param theme текущая тема
 * @param showBorder включает рамку
 * @param showShadow включает тень при включённой рамке
 * @param borderTone тон цвета рамки
 * @returns CSS-правила, каждое с новой строки
 */
export function getBorderStyles(
  theme: AppTheme,
  showBorder: boolean = DEFAULT_SHOW_BORDER,
  showShadow: boolean = DEFAULT_SHOW_SHADOW,
  borderTone: TonePreset = DEFAULT_TONE
): string {
  if (!showBorder) {
    return 'box-shadow: none;';
  }

  const border = `0 0 0 1px ${getBorderColor(theme, borderTone)}`;
  const shadow = showShadow ? `, ${theme.shadow.surface}` : '';

  return `box-shadow: ${border}${shadow};`;
}
