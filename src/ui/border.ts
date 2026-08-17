/**
 * Файл: `src/ui/border.ts`
 * Содержит управляемую рамку и тень вне layout-box: обводка `0 0 0 1px` и
 * опционально `shadow.surface` одним `box-shadow`, плюс два пакета пропсов
 * для локального opt-in у потребителей. `BorderProps` — когда дефолт
 * потребителя «рамка есть»; `ShowBorderProps` — когда дефолт «рамки нет».
 *
 * Основные задачи:
 * 1. Типизировать пропсы рамки через `BorderProps`, `ShowBorderProps`
 *    и перечень `BORDER_PROP_NAMES`
 * 2. Предоставить функцию `getBorderStyles` — рамка и тень вне layout-box
 * 3. Предоставить функцию `resolveBorderProps` — пакет рамки по флагу показа
 * 4. Задать дефолты пропов `showBorder` и `showShadow` через
 *    `DEFAULT_SHOW_BORDER` и `DEFAULT_SHOW_SHADOW`
 *
 * Потребители:
 *  - styles-файлы с рамкой и тенью и дефолтом «рамка есть», например Card,
 *    Input, SearchField, Tag и Toolbar — подключают `BorderProps` /
 *    `BORDER_PROP_NAMES` и подставляют рамку через `getBorderStyles`
 *  - styles-файлы и оболочки с дефолтом «рамки нет», например Icon и Modal —
 *    подключают `ShowBorderProps` / `BORDER_PROP_NAMES`
 *  - `src/pages/showcase` и `@ui/modal` — собирают пакет рамки через
 *    `resolveBorderProps`
 *  - styles-файлы с постоянной рамкой без публичных пропсов, например Button,
 *    Listbox, Checkbox, RadioButton, AnchoredPanel, SegmentButton и Toast —
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
 * Поля тона и тени допустимы, пока `showBorder` не выключен: дефолт флага — рамка есть.
 * Для потребителя с дефолтом «рамки нет» берётся `ShowBorderProps`.
 * Подключается локально через `& BorderProps` и `...BORDER_PROP_NAMES`
 * у потребителей, которым нужна рамка; в `LayoutProps` не входит.
 *
 * @property borderTone — тон цвета рамки при включённом `showBorder`
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 */
export type BorderProps =
  | {
      borderTone?: never;
      showBorder: false;
      showShadow?: never;
    }
  | {
      borderTone?: TonePreset;
      showBorder?: true;
      showShadow?: boolean;
    };

/**
 * ShowBorderProps — представляет пропсы управления рамкой и тенью.
 * Поля тона и тени допустимы только при явном `showBorder: true`: дефолт флага — рамки нет.
 * Для потребителя с дефолтом «рамка есть» берётся `BorderProps`.
 * Подключается локально через `& ShowBorderProps` и `...BORDER_PROP_NAMES`
 * у потребителей, которым нужна рамка; в `LayoutProps` не входит.
 *
 * @property borderTone — тон цвета рамки при включённом `showBorder`
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 */
export type ShowBorderProps =
  | {
      borderTone?: never;
      showBorder?: false;
      showShadow?: never;
    }
  | {
      borderTone?: TonePreset;
      showBorder: true;
      showShadow?: boolean;
    };

/**
 * BORDER_PROP_NAMES — хранит имена пропсов пакетов `BorderProps` и `ShowBorderProps`.
 * Компоненты подключают набор спредом в свой `*_PROP_NAMES` вместе с
 * layout-пропами и остальными пропами стилизации.
 */
export const BORDER_PROP_NAMES = new Set(['borderTone', 'showBorder', 'showShadow']);

/**
 * resolveBorderProps — возвращает пакет пропсов рамки по флагу показа.
 * При включённой рамке отдаёт `showBorder` вместе с тоном и тенью, иначе гасит
 * зависимые поля. Результат подходит и к `BorderProps`, и к `ShowBorderProps`.
 * Используется в `src/pages/showcase` и `@ui/modal`.
 *
 * @param showBorder включает рамку
 * @param borderTone тон цвета рамки при включённой рамке
 * @param showShadow включает тень при включённой рамке
 * @returns пакет пропсов рамки для передачи в потребитель
 */
export function resolveBorderProps(
  showBorder: boolean,
  borderTone?: TonePreset,
  showShadow?: boolean
):
  | {
      borderTone?: TonePreset;
      showBorder: true;
      showShadow?: boolean;
    }
  | {
      showBorder: false;
    } {
  return showBorder
    ? { borderTone, showBorder: true, showShadow }
    : { showBorder: false };
}

/**
 * getBorderColor — возвращает цвет рамки по `borderTone`.
 * Используется внутри `getBorderStyles`.
 *
 * @param theme текущая тема
 * @param borderTone тон рамки
 * @returns цвет рамки. Для тона по умолчанию — `theme.colors.border`
 */
function getBorderColor(theme: AppTheme, borderTone: TonePreset = DEFAULT_TONE): string {
  return getToneColor(theme, borderTone, theme.colors.border);
}

/**
 * getBorderStyles — возвращает CSS-правило рамки вне layout-box: обводку
 * `0 0 0 1px` и опционально тень `shadow.surface` одним `box-shadow`.
 * Рамочный и безрамочный режимы дают один `content-box` и одно окно `Icon`,
 * без резерва `border: 1px solid transparent`.
 * Пропсы `showBorder` и `showShadow` подключает потребитель осознанно: эталоны
 * Icon, Card, Input, SearchField, Tag и Toolbar. Составные триггеры, например
 * Listbox, Combobox, Stepper и RangeInput, пропсы не получают без отдельного
 * кейса и вызывают хелпер с дефолтами. Оболочка композита и поверхность с
 * постоянной рамкой, например Checkbox, RadioButton и Toast, вызывают функцию
 * без флагов.
 * При `showBorder` — обводка цвета рамки по `borderTone` и при `showShadow` —
 * тень `shadow.surface`. Без рамки — `box-shadow: none`: тени без рамки нет.
 * `border: none` вызывающий код пишет только там, где layout-рамку даёт
 * UA-стиль тега, например `<input>` и `<dialog>`: у `<button>` её снял reset,
 * у `<div>` рамки нет — повтор запрещён.
 *
 * @param theme текущая тема
 * @param showBorder включает рамку
 * @param showShadow включает тень при включённой рамке
 * @param borderTone тон цвета рамки
 * @returns CSS-правило `box-shadow`
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

  return showShadow
    ? `box-shadow: ${border}, ${theme.shadow.surface};`
    : `box-shadow: ${border};`;
}
