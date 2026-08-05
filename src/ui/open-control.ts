/**
 * Файл: `src/ui/open-control.ts`
 * Содержит общий хром open-контролов: корень с подъёмом слоя при открытии и
 * ряд-триггер с заливкой `surface`, рамкой с тенью, скруглением и фокус-контуром.
 *
 * Основные задачи:
 * 1. Типизировать пропсы поверхности через `OpenControlSurfaceStyleProps`
 *    и вариант clear через `OpenControlTriggerRowClearLayout`
 * 2. Предоставить функции `getOpenControlRootStyles` и `getOpenControlTriggerRowStyles`
 *
 * Потребители:
 *  - styles-файлы open-контролов — подставляют генераторы корня и ряда-триггера:
 *     - `src/ui/listbox/listbox.styles.ts`
 *     - `src/ui/combobox/combobox.styles.ts`
 *     - `src/ui/range-input/range-input.styles.ts`
 *     - `src/ui/date-range-input/date-range-input.styles.ts`
 */

import { getBorderStyles } from '@ui/border';
import { getOutlineStyles } from '@ui/outline';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { STACKING_OPEN_CONTROL } from '@ui/stacking';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * OpenControlTriggerRowClearLayout — представляет вариант колонок clear в ряде-триггере.
 * `both-branches` — trailing clear и ветка `[data-slot='clear']:first-child`.
 * `trailing-only` — только trailing clear без first-child ветки.
 */
export type OpenControlTriggerRowClearLayout = 'both-branches' | 'trailing-only';

/**
 * OpenControlSurfaceStyleProps — представляет пропсы поверхности ряда-триггера open-control.
 *
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
export type OpenControlSurfaceStyleProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

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
 * 2. Собирает сетку ряда: колонки под trailing clear и опционально first-child ветку
 *    по `clearLayout`
 * 3. Задаёт габариты, заливку `surface`, скругление через `resolveBorderRadius`,
 *    рамку с тенью через `getBorderStyles` и фокус-контур через `getOutlineStyles`
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
  const clearFirstChildBranch =
    clearLayout === 'both-branches'
      ? `
    &[data-has-clear]:has(> [data-slot='clear']:first-child) {
      grid-template-columns: auto minmax(0, 1fr);
    }
  `
      : '';

  return `
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    &[data-has-clear] { grid-template-columns: minmax(0, 1fr) auto; }
    ${clearFirstChildBranch}
    inline-size: 100%;
    min-block-size: ${getMinBlockSize(sizePreset)};
    overflow: hidden;
    background-color: ${theme.colors.surface};
    border-radius: ${resolveBorderRadius(shape, sizePreset)};
    ${getBorderStyles(theme)}
    &[data-open='true'] { visibility: hidden; }
    &:focus-within {
      ${getOutlineStyles(theme.colors.focusOutline)}
    }
  `;
}
