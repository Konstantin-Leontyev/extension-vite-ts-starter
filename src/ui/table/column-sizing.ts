/**
 * Файл: `src/ui/table/column-sizing.ts`
 * Содержит расчёт inline-размеров колонок таблицы по заголовку и образцам текста.
 *
 * Основные задачи:
 * 1. Типизировать вход замера через `TableColumnSizeConfig`
 * 2. Предоставить функцию `computeTableColumnInlineSizes`
 *
 * Потребители:
 *  - `src/ui/table/table.styles.ts` — реэкспортирует публичное API для barrel `@ui/table`
 *  - `src/pages/showcase/table-demo/index.tsx` — задаёт `inlineSize` колонок демо-таблицы
 */

import { getTextSize, padding, type SizePreset } from '@ui/presets';
import { textSizePresets, type TextSizePreset } from '@ui/text';

/**
 * TABLE_FONT_FAMILY — задаёт семейство шрифта для замера ширины текста на canvas.
 * Совпадает со стеком Inter из глобальных стилей темы.
 */
const TABLE_FONT_FAMILY =
  "'Inter', -apple-system, system-ui, blinkmacsystemfont, 'Helvetica Neue', sans-serif";

/**
 * FALLBACK_CHAR_WIDTH_PX — задаёт запасную ширину символа в px без DOM.
 * Не совпадает с метриками Inter и нужна только как запасной путь без `document`.
 * Используется в `measureTextWidth`, когда нет `document` или контекста canvas.
 */
const FALLBACK_CHAR_WIDTH_PX = 8;

/**
 * TableColumnSizeConfig — представляет вход замера inline-размера колонки.
 *
 * @property extraContentPx — дополнительная ширина содержимого в ячейке, например иконка или точка
 * @property header — текст заголовка колонки
 * @property samples — образцы значений ячеек для выбора максимальной ширины
 */
export type TableColumnSizeConfig = {
  extraContentPx?: number;
  header: string;
  samples: readonly string[];
};

/**
 * TextMeasurePreset — представляет пресет типографики из `textSizePresets` для замера ширины.
 */
type TextMeasurePreset = (typeof textSizePresets)[TextSizePreset];

/**
 * measureContext — хранит переиспользуемый контекст canvas для замера текста.
 */
let measureContext: CanvasRenderingContext2D | null = null;

/**
 * measureFontKey — хранит ключ текущего шрифта контекста, чтобы не переназначать `font` без нужды.
 */
let measureFontKey: null | string = null;

/**
 * measureTextWidth — возвращает ширину строки в px по пресету типографики.
 * Без `document` или контекста canvas использует `FALLBACK_CHAR_WIDTH_PX`.
 *
 * @param text измеряемая строка
 * @param textPreset пресет типографики из `textSizePresets`
 * @returns ширина в px
 */
function measureTextWidth(text: string, textPreset: TextMeasurePreset): number {
  if (text === '') {
    return 0;
  }

  if (typeof document === 'undefined') {
    return text.length * FALLBACK_CHAR_WIDTH_PX;
  }

  if (measureContext === null) {
    const canvas = document.createElement('canvas');

    measureContext = canvas.getContext('2d');
  }

  if (measureContext === null) {
    return text.length * FALLBACK_CHAR_WIDTH_PX;
  }

  const fontKey = `${textPreset.fontWeight} ${textPreset.fontSize} ${TABLE_FONT_FAMILY}`;

  if (measureFontKey !== fontKey) {
    measureContext.font = fontKey;
    measureFontKey = fontKey;
  }

  return measureContext.measureText(text).width;
}

/**
 * widerText — возвращает более широкую из двух строк по замеру.
 *
 * @param current текущий максимум
 * @param candidate кандидат на более широкую строку
 * @param textPreset пресет типографики из `textSizePresets`
 * @returns строка с большей шириной
 */
function widerText(
  current: string,
  candidate: string,
  textPreset: TextMeasurePreset
): string {
  if (candidate === '') {
    return current;
  }

  if (current === '') {
    return candidate;
  }

  return measureTextWidth(candidate, textPreset) > measureTextWidth(current, textPreset)
    ? candidate
    : current;
}

/**
 * computeTableColumnInlineSize — вычисляет значение для CSS-свойства `inline-size` одной колонки.
 * Берёт максимум ширины заголовка и образцов, добавляет горизонтальные отступы ячейки
 * и `extraContentPx`.
 *
 * @param config вход замера колонки
 * @param sizePreset размерный ряд таблицы
 * @returns CSS-длина в px
 */
function computeTableColumnInlineSize(
  config: TableColumnSizeConfig,
  sizePreset: SizePreset = 'normal'
): string {
  const cellPaddingInlinePx = padding[sizePreset].inline;
  const textPreset = textSizePresets[getTextSize(sizePreset)];
  const extraContentPx = config.extraContentPx ?? 0;

  let maxText = config.header;

  for (const sample of config.samples) {
    maxText = widerText(maxText, sample, textPreset);
  }

  const contentWidth = Math.ceil(measureTextWidth(maxText, textPreset));

  return `${contentWidth + extraContentPx + cellPaddingInlinePx * 2}px`;
}

/**
 * computeTableColumnInlineSizes — вычисляет значения `inline-size` для набора колонок.
 * Вызывающий код подставляет результат в `inlineSize` колонок Table.
 *
 * @param configs соответствие ключа колонки и входа замера
 * @param sizePreset размерный ряд таблицы
 * @returns соответствие ключа колонки и CSS-длины в px
 */
export function computeTableColumnInlineSizes<Key extends string>(
  configs: Record<Key, TableColumnSizeConfig>,
  sizePreset: SizePreset = 'normal'
): Record<Key, string> {
  const sizes = {} as Record<Key, string>;

  for (const key of Object.keys(configs) as Key[]) {
    sizes[key] = computeTableColumnInlineSize(configs[key], sizePreset);
  }

  return sizes;
}
