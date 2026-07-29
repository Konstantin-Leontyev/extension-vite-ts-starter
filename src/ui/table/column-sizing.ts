// TODO: ручное ревью — ui/table/column-sizing.ts
import { getTextSize, padding, type SizePreset } from '@ui/presets';
import { textSizePresets, type TextSizePreset } from '@ui/text';

const TABLE_FONT_FAMILY =
  "'Inter', -apple-system, system-ui, blinkmacsystemfont, 'Helvetica Neue', sans-serif";

export type TableColumnSizeSpec = {
  /** Доп. ширина контента в ячейке (иконка, точка KD и т.п.). */
  extraContentPx?: number;
  header: string;
  samples: readonly string[];
};

type TextMeasurePreset = (typeof textSizePresets)[TextSizePreset];

let measureContext: CanvasRenderingContext2D | null = null;
let measureFontKey: null | string = null;

function measureTextWidth(text: string, textPreset: TextMeasurePreset): number {
  if (text === '') {
    return 0;
  }

  if (typeof document === 'undefined') {
    return text.length * 8;
  }

  if (measureContext === null) {
    const canvas = document.createElement('canvas');

    measureContext = canvas.getContext('2d');
  }

  if (measureContext === null) {
    return text.length * 8;
  }

  const fontKey = `${textPreset.fontWeight} ${textPreset.fontSize} ${TABLE_FONT_FAMILY}`;

  if (measureFontKey !== fontKey) {
    measureContext.font = fontKey;
    measureFontKey = fontKey;
  }

  return measureContext.measureText(text).width;
}

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

/** Ширина колонки: max(заголовок, samples) + padding ячейки + extraContentPx. */
export function computeTableColumnInlineSize(
  spec: TableColumnSizeSpec,
  sizePreset: SizePreset = 'normal'
): string {
  const cellPaddingInlinePx = padding[sizePreset].inline;
  const textPreset = textSizePresets[getTextSize(sizePreset)];
  const extraContentPx = spec.extraContentPx ?? 0;

  let maxText = spec.header;

  for (const sample of spec.samples) {
    maxText = widerText(maxText, sample, textPreset);
  }

  const contentWidth = Math.ceil(measureTextWidth(maxText, textPreset));

  return `${contentWidth + extraContentPx + cellPaddingInlinePx * 2}px`;
}

/** Набор inlineSize по ключам колонок (текстовая колонка без inlineSize забирает остаток). */
export function computeTableColumnInlineSizes<Key extends string>(
  specs: Record<Key, TableColumnSizeSpec>,
  sizePreset: SizePreset = 'normal'
): Record<Key, string> {
  const sizes = {} as Record<Key, string>;

  for (const key of Object.keys(specs) as Key[]) {
    sizes[key] = computeTableColumnInlineSize(specs[key], sizePreset);
  }

  return sizes;
}
