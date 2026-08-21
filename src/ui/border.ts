/**
 * Файл: `src/ui/border.ts`
 * Содержит управляемую рамку и тень вне layout-box: обводку `0 0 0 1px` и
 * опционально `shadow.surface` и `shadow.pressed` одним `box-shadow`, плюс
 * пакеты пропсов для локального opt-in у потребителей. Даёт пакет `BorderProps`
 * при дефолте потребителя «рамка есть», пакет `ShowBorderProps` при дефолте
 * «рамки нет» и пакет `ShowActionBorderProps` для рамки окон ряда действий.
 *
 * Основные задачи:
 * 1. Типизировать пропсы рамки через `BorderProps`, `ShowBorderProps` и
 *    `ShowActionBorderProps`
 * 2. Хранить имена пропсов рамки в `BORDER_PROP_NAMES`
 * 3. Предоставить функцию `getBorderStyles` — рамка и тень вне layout-box
 * 4. Предоставить функции `resolveBorderProps` и `resolveActionBorderProps`
 * 5. Задать дефолты пропов `showBorder` и `showShadow` через
 *    `DEFAULT_SHOW_BORDER` и `DEFAULT_SHOW_SHADOW`
 *
 * Потребители:
 *  - styles-файлы с рамкой и тенью и дефолтом «рамка есть», например Card,
 *    Input, SearchField, Tag, Toolbar и Listbox вида `icon` — подключают `BorderProps` /
 *    `BORDER_PROP_NAMES` и подставляют рамку с тенью через `getBorderStyles`
 *  - styles-файлы с дефолтом «рамки нет», например Icon — подключают
 *    `ShowBorderProps` / `BORDER_PROP_NAMES`
 *  - `@ui/icon-button-row` — подключает `ShowBorderProps` без тона
 *  - `@ui/card`, `@ui/toolbar`, `@ui/modal` и `@ui/sidebar` — подключают
 *    `ShowActionBorderProps`
 *  - `src/pages/showcase`, `@ui/modal`, `@ui/card`, `@ui/toolbar` и
 *    `@ui/icon-button-row` — собирают пакет рамки через `resolveBorderProps`
 *  - `src/pages/showcase` — собирает пакет рамки действий через
 *    `resolveActionBorderProps`
 *  - styles-файлы с постоянной рамкой без публичных пропсов, например Button,
 *    ряд-триггер Listbox вида `field`, Checkbox, RadioButton, AnchoredPanel, SegmentButton и Toast —
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
 * ShowActionBorderProps — представляет пропсы рамки окон ряда действий.
 * Тень допустима только при явном `showActionBorder: true`: дефолт флага — рамки нет.
 * Тона рамки у окон ряда нет. Для рамки поверхности берётся `BorderProps` или
 * `ShowBorderProps`. В `LayoutProps` не входит.
 * Подключается локально через `& ShowActionBorderProps` у хозяев ряда.
 *
 * @property showActionBorder — включает рамку окон ряда
 * @property showActionShadow — включает тень окон ряда при включённой рамке
 */
export type ShowActionBorderProps =
  | {
      showActionBorder: true;
      showActionShadow?: boolean;
    }
  | {
      showActionBorder?: false;
      showActionShadow?: never;
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
 * Используется в `src/pages/showcase`, `@ui/modal`, `@ui/card`, `@ui/toolbar`
 * и `@ui/icon-button-row`.
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
 * resolveActionBorderProps — возвращает пакет пропсов рамки окон ряда по флагу показа.
 * При включённой рамке отдаёт `showActionBorder` вместе с тенью, иначе гасит
 * зависимое поле. Результат подходит к `ShowActionBorderProps`.
 * Используется в `src/pages/showcase`.
 *
 * @param showActionBorder включает рамку окон ряда
 * @param showActionShadow включает тень окон ряда при включённой рамке
 * @returns пакет пропсов рамки действий для передачи в хозяина ряда
 */
export function resolveActionBorderProps(
  showActionBorder: boolean,
  showActionShadow?: boolean
):
  | {
      showActionBorder: false;
    }
  | {
      showActionBorder: true;
      showActionShadow?: boolean;
    } {
  return showActionBorder
    ? { showActionBorder: true, showActionShadow }
    : { showActionBorder: false };
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
 * Icon, Card, Input, SearchField, Tag, Toolbar и Listbox вида `icon`. Составные триггеры, например
 * ряд-триггер Listbox вида `field`, Stepper и RangeInput, пропсы не получают без отдельного
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
