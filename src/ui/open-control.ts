/**
 * Файл: `src/ui/open-control.ts`
 * Содержит общий хром open-контролов: корень с подъёмом слоя при открытии,
 * ряд-триггер, кнопку-триггер с каналом шеврона, поверхность выбираемой строки
 * и именованные константы панели.
 *
 * Основные задачи:
 * 1. Типизировать пропсы поверхности через `OpenControlSurfaceStyleProps`
 *    и вариант clear через `OpenControlTriggerRowClearLayout`
 * 2. Задать константы панели и шкалы: `OPEN_CONTROL_PANEL_MAX_OPTION_ROWS`,
 *    `OPEN_CONTROL_PANEL_MIN_OPTION_ROWS`, `OPEN_CONTROL_SELECTABLE_INSET`,
 *    `OPEN_CONTROL_ROW_GAP`, `OPEN_CONTROL_PANEL_PADDING`
 * 3. Предоставить `resolveOpenControlBlockRadius`, `getOpenControlRootStyles`,
 *    `getOpenControlTriggerRowStyles`, `getOpenControlTriggerStyles` и
 *    `getOpenControlSelectableRowSurfaceStyles`
 *
 * Потребители:
 *  - styles-файлы open-контролов — подставляют генераторы корня, ряда-триггера,
 *    кнопки-триггера и поверхности строки:
 *     - `src/ui/listbox/listbox.styles.ts`
 *     - `src/ui/combobox/combobox.styles.ts`
 *     - `src/ui/range-input/range-input.styles.ts`
 *     - `src/ui/date-range-input/date-range-input.styles.ts`
 *  - `src/ui/combobox/index.tsx` — читает `OPEN_CONTROL_PANEL_MIN_OPTION_ROWS`
 */

import { getBorderStyles } from '@ui/border';
import { getIconPositionStyles, resolveIconStateBackground } from '@ui/icon';
import { MOTION_CONTROL_DURATION, getTransitionStyles } from '@ui/motion';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { STACKING_OPEN_CONTROL } from '@ui/stacking';
import { getSurfaceBackgroundColor } from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

/**
 * OpenControlTriggerRowClearLayout — представляет вариант колонок clear в ряде-триггере.
 * `both-branches` — trailing clear и ветка `[data-slot='clear']:first-child`.
 * `trailing-only` — только trailing clear без first-child ветки.
 */
export type OpenControlTriggerRowClearLayout = 'both-branches' | 'trailing-only';

/**
 * OpenControlSurfaceStyleProps — представляет пропсы стилизации поверхности open-control.
 *
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
export type OpenControlSurfaceStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * OpenControlSelectableHighlight — представляет режим подсветки подложки
 * выбираемой строки: акцентный `primary` или вуаль `veil`.
 */
type OpenControlSelectableHighlight = 'primary' | 'veil';

/**
 * OpenControlSelectableRowSurfaceOptions — представляет настройки поверхности
 * выбираемой строки open-control.
 *
 * @property display — режим раскладки строки
 * @property gap — зазор между слотами строки
 * @property highlight — режим цвета подложки наведения
 * @property highlightWhen — селектор записи цвета в `::before`. Без значения —
 *   наведение и `:focus-visible`
 */
type OpenControlSelectableRowSurfaceOptions = {
  display: 'flex' | 'grid';
  gap?: SpacingValue;
  highlight: OpenControlSelectableHighlight;
  highlightWhen?: string;
};

/**
 * OPEN_CONTROL_PANEL_MAX_OPTION_ROWS — задаёт максимум видимых строк опций в панели.
 * Используется в `getListboxPanelStyles` и `getComboboxListStyles` для
 * `max-block-size`.
 */
export const OPEN_CONTROL_PANEL_MAX_OPTION_ROWS = 6;

/**
 * OPEN_CONTROL_PANEL_MIN_OPTION_ROWS — задаёт минимум резервируемых строк опций в панели.
 * Используется в `applyComboboxPanelPosition` из `src/ui/combobox/index.tsx`
 * при расчёте минимальной высоты.
 */
export const OPEN_CONTROL_PANEL_MIN_OPTION_ROWS = 4;

/**
 * OPEN_CONTROL_SELECTABLE_INSET — задаёт отступ подложки выбираемой строки от края.
 * Используется в `getOpenControlSelectableRowSurfaceStyles` и как
 * `padding-block` списка Combobox.
 */
export const OPEN_CONTROL_SELECTABLE_INSET: SpacingValue = 4;

/**
 * OPEN_CONTROL_ROW_GAP — задаёт зазор между элементами ряда open-control.
 * Используется в поверхностях опций и панелях RangeInput и DateRangeInput.
 */
export const OPEN_CONTROL_ROW_GAP: SpacingValue = 12;

/**
 * OPEN_CONTROL_PANEL_PADDING — задаёт внутренний отступ панели open-control.
 * Используется в панелях RangeInput и DateRangeInput.
 */
export const OPEN_CONTROL_PANEL_PADDING: SpacingValue = 16;

/**
 * DEFAULT_SELECTABLE_HIGHLIGHT_WHEN — задаёт селектор подсветки подложки по умолчанию.
 * Используется, когда вызывающий код не передал `highlightWhen`.
 */
const DEFAULT_SELECTABLE_HIGHLIGHT_WHEN = `&:not(:disabled):hover::before,
    &:focus-visible::before`;

/**
 * resolveOpenControlBlockRadius — возвращает значение для CSS-свойства
 * `border-radius` поверхности open-control по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
export function resolveOpenControlBlockRadius(
  shape: ShapePreset,
  sizePreset: SizePreset
): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * getOpenControlRootStyles — возвращает CSS-правила корня open-control:
 * раскладку, зазор, ширину и подъём слоя при открытой панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlRootStyles(): string {
  return `
    position: relative;
    display: grid;
    gap: ${getSpacingValue(8)};
    inline-size: 100%;
    min-inline-size: 0;
    &[data-open='true'] { z-index: ${STACKING_OPEN_CONTROL}; }
  `;
}

/**
 * getOpenControlTriggerRowStyles — возвращает CSS-правила ряда-триггера open-control:
 * габариты, заливку, рамку с тенью и `outline` фокуса.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает сетку ряда: колонки под trailing clear и при `clearLayout`
 *    `both-branches` докладывает ветку `[data-slot='clear']:first-child`
 * 3. Задаёт габариты, заливку `surface` через `getSurfaceBackgroundColor`,
 *    скругление через `resolveBorderRadius`, рамку с тенью через
 *    `getBorderStyles` и фокус-контур через `getOutlineStyles`
 * 4. При `data-open='true'` скрывает ряд через `visibility: hidden`, чтобы панель
 *    наследовала ширину якоря без двойного отображения триггера
 *
 * @param props пропсы поверхности и тема
 * @param resolveBorderRadius функция скругления по `shape` и `sizePreset`
 * @param clearLayout вариант колонок clear, по умолчанию `both-branches`
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlTriggerRowStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme },
  resolveBorderRadius: (shape: ShapePreset, sizePreset: SizePreset) => string,
  clearLayout: OpenControlTriggerRowClearLayout = 'both-branches'
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    '&[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }',
  ];

  if (clearLayout === 'both-branches') {
    styles.push(`&[data-has-clear]:has(> [data-slot='clear']:first-child) {
      grid-template-columns: auto minmax(0, 1fr);
    }`);
  }

  styles.push(
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'overflow: hidden;',
    `background-color: ${getSurfaceBackgroundColor(theme, 'surface')};`,
    `border-radius: ${resolveBorderRadius(shape, sizePreset)};`,
    getBorderStyles(theme),
    "&[data-open='true'] { visibility: hidden; }",
    `&:focus-within {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }`
  );

  return styles.join('\n');
}

/**
 * getOpenControlTriggerStyles — возвращает CSS-правила кнопки-триггера open-control:
 * раскладку позиции иконки и канал `--icon-state-background`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `iconTone`
 * 2. Считает заливку канала через `resolveIconStateBackground`
 * 3. Собирает сетку, раскладку позиции через `getIconPositionStyles`,
 *    выравнивание текста и запись канала на `:not(:disabled):hover` и
 *    `:focus-visible`. На фокусе снимает `outline`
 *
 * @param props тон секции иконки и тема
 * @param textAlign выравнивание текста триггера, по умолчанию `start`
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlTriggerStyles(
  props: { iconTone?: TonePreset; theme: AppTheme },
  textAlign: 'center' | 'start' = 'start'
): string {
  const theme = getTheme(props);
  const { iconTone = DEFAULT_TONE } = props;
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  return `
    display: grid;
    ${getIconPositionStyles()}
    align-items: center;
    min-inline-size: 0;
    text-align: ${textAlign};
    &:not(:disabled):hover {
      --icon-state-background: ${stateBackground};
    }
    &:focus-visible {
      outline: none;
      --icon-state-background: ${stateBackground};
    }
  `;
}

/**
 * getOpenControlSelectableRowSurfaceStyles — возвращает CSS-правила поверхности
 * выбираемой строки open-control: раскладку, габариты, заливку и подложку
 * наведения через `::before`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты `shape` и `sizePreset`
 * 2. Считает отступ подложки, скругление через `resolveOpenControlBlockRadius`
 *    и цвет подсветки по `highlight`
 * 3. Собирает раскладку, габариты и заливку `surface` через
 *    `getSurfaceBackgroundColor`
 * 4. Кладёт абсолютный `::before` с отступом от края, скруглением и переходом
 *    `background-color`
 * 5. Красит подложку по селектору `highlightWhen` или дефолтному наведению и фокусу
 *
 * @param props пропсы поверхности и тема
 * @param options раскладка, зазор, режим и селектор подсветки
 * @returns CSS-правила, каждое с новой строки
 */
export function getOpenControlSelectableRowSurfaceStyles(
  props: OpenControlSurfaceStyleProps & { theme: AppTheme },
  options: OpenControlSelectableRowSurfaceOptions
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;
  const inset = getSpacingValue(OPEN_CONTROL_SELECTABLE_INSET);
  const borderRadius = resolveOpenControlBlockRadius(shape, sizePreset);
  const highlightColor =
    options.highlight === 'primary' ? theme.colors.primary : theme.colors.veil;
  const highlightWhen = options.highlightWhen ?? DEFAULT_SELECTABLE_HIGHLIGHT_WHEN;
  const styles = ['position: relative;', 'z-index: 0;', `display: ${options.display};`];

  if (options.gap !== undefined) {
    styles.push(`gap: ${getSpacingValue(options.gap)};`);
  }

  styles.push(
    'align-items: center;',
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'text-align: start;',
    `background-color: ${getSurfaceBackgroundColor(theme, 'surface')};`,
    `&::before {
      position: absolute;
      inset: ${inset};
      z-index: -1;
      pointer-events: none;
      content: '';
      border-radius: calc(${borderRadius} - ${inset});
      ${getTransitionStyles('background-color', MOTION_CONTROL_DURATION)}
    }`,
    '&:focus { outline: none; }',
    `${highlightWhen} {
      background-color: ${highlightColor};
    }`
  );

  return styles.join('\n');
}
