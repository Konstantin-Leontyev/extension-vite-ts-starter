/**
 * Файл: `src/ui/border.ts`
 * Содержит управляемую рамку и тень вне layout-box: обводку `0 0 0 1px` и
 * опционально `shadow.surface` и `shadow.pressed` одним `box-shadow`, плюс два
 * пакета пропсов для локального opt-in у потребителей. Даёт пакет `BorderProps`
 * при дефолте потребителя «рамка есть» и пакет `ShowBorderProps` при дефолте
 * «рамки нет».
 *
 * Основные задачи:
 * 1. Типизировать пропсы рамки через `BorderProps` и `ShowBorderProps`
 * 2. Хранить имена пропсов рамки в `BORDER_PROP_NAMES`
 * 3. Предоставить функцию `getBorderStyles` — рамка и тень вне layout-box
 * 4. Предоставить функцию `resolveBorderProps` — пакет рамки по флагу показа
 * 5. Задать дефолты пропов `showBorder` и `showShadow` через
 *    `DEFAULT_SHOW_BORDER` и `DEFAULT_SHOW_SHADOW`
 *
 * Потребители:
 *  - styles-файлы с рамкой и тенью и дефолтом «рамка есть», например Card,
 *    Input, SearchField, Tag и Toolbar — подключают `BorderProps` /
 *    `BORDER_PROP_NAMES` и подставляют рамку с тенью через `getBorderStyles`
 *  - styles-файлы с дефолтом «рамки нет», например Icon — подключают
 *    `ShowBorderProps` / `BORDER_PROP_NAMES`
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
 */
export const DEFAULT_SHOW_SHADOW = true;

/**
 * BorderProps — представляет пропсы управления рамкой и тенью.
 * Поля тона и тени допустимы, пока `showBorder` не выключен: дефолт флага — рамка есть.
 * Для потребителя с дефолтом «рамки нет» берётся `ShowBorderProps`. В `LayoutProps` не входит.
 * Подключается локально через `& BorderProps` и `...BORDER_PROP_NAMES`
 * у потребителей, которым нужна рамка.
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
 * Для потребителя с дефолтом «рамка есть» берётся `BorderProps`. В `LayoutProps` не входит.
 * Подключается локально через `& ShowBorderProps` и `...BORDER_PROP_NAMES`
 * у потребителей, которым нужна рамка.
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
 * getBorderStyles — возвращает CSS-правила рамки с тенью вне layout-box: обводку
 * `0 0 0 1px` и опционально тени `shadow.surface` и `shadow.pressed` одним
 * `box-shadow`.
 * Рамочный и безрамочный режимы дают один `content-box` и одно окно Icon,
 * без резерва `border: 1px solid transparent`.
 * `border: none` вызывающий код пишет только там, где layout-рамку даёт
 * UA-стиль тега, например `<input>` и `<dialog>`: у `<button>` её снял reset,
 * у `<div>` рамки нет — повтор запрещён.
 * Пропсы `showBorder` и `showShadow` подключает потребитель осознанно: эталоны
 * Icon, Card, Input, SearchField, Tag и Toolbar. Составные триггеры, например
 * Listbox, Combobox, Stepper и RangeInput, пропсы не получают без отдельного
 * кейса и вызывают хелпер с дефолтами. Оболочка композита и поверхность с
 * постоянной рамкой, например Checkbox, RadioButton и Toast, вызывают функцию
 * без флагов.
 *
 * Как работает:
 * 1. Без рамки и без `pressed` отдаёт `box-shadow: none`
 * 2. С рамкой собирает обводку `0 0 0 1px` цвета по `borderTone`
 * 3. При рамке, `showShadow` и токене не `none` дописывает `shadow.surface`.
 *    Слой `none` в списке невалиден, браузер отбрасывает всё правило вместе с
 *    обводкой. В тёмной теме токен равен `none`
 * 4. При `pressed` дописывает `shadow.pressed` в тот же список, в том числе
 *    без рамки: вдавленность принадлежит кнопке, не обводке. Подъём
 *    не снимается
 *
 * @param theme текущая тема
 * @param showBorder включает рамку
 * @param showShadow включает тень при включённой рамке
 * @param borderTone тон цвета рамки
 * @param pressed включает тень нажатия
 * @returns CSS-правила, каждое с новой строки
 */
export function getBorderStyles(
  theme: AppTheme,
  showBorder: boolean = DEFAULT_SHOW_BORDER,
  showShadow: boolean = DEFAULT_SHOW_SHADOW,
  borderTone: TonePreset = DEFAULT_TONE,
  pressed: boolean = false
): string {
  const layers: string[] = [];

  if (showBorder) {
    layers.push(`0 0 0 1px ${getBorderColor(theme, borderTone)}`);
    const surfaceShadow = theme.shadow.surface;

    if (showShadow && surfaceShadow !== 'none') {
      layers.push(surfaceShadow);
    }
  }

  if (pressed) {
    layers.push(theme.shadow.pressed);
  }

  if (layers.length === 0) {
    return 'box-shadow: none;';
  }

  return `box-shadow: ${layers.join(', ')};`;
}
