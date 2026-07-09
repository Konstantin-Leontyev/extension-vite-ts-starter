/**
 * Файл: text.styles.ts
 * Этот файл содержит стилизованный компонент Text и связанные с ним утилиты.
 * Определяет систему типографики для текстовых элементов.
 *
 * Основные задачи:
 * 1. Определить пресеты типографики (textSizePresets)
 * 2. Предоставить тип TextStyleProps со всеми текстовыми свойствами
 * 3. Предоставить функцию getTextStyles для генерации CSS-стилей текста
 * 4. Предоставить стилизованный компонент StyledText
 *
 * Потребители кроме самого Text:
 * - @ui/presets — `getTextSize` (согласование `SizePreset` контрола с `TextSizePreset`)
 * - @ui/table/column-sizing — замер ширины колонки по `textSizePresets`
 * - @ui/table/table-inline-field, @ui/input, @ui/stepper — `getTextProperties` на native input
 *
 * В отличие от layout (spacing/sizing/positioning), текстовые стили
 * генерируются отдельной функцией и не входят в LAYOUT_PROP_NAMES.
 */

import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getTheme, type AppTheme, type ThemeColors } from '@ui/theme';
import { TONE_PRESETS, type TonePreset } from '@ui/tones';

/**
 * TEXT_TONE_PRESETS — карта тонов текста: канон (TONE_PRESETS) плюс muted.
 * Приватна для модуля: снаружи только TEXT_TONE_KEYS, getTextToneKey, getTextToneColor.
 *
 * Тон текста задаётся пропом `tone` у компонента Text.
 * Компоненты-обёртки (Button, Tag, SegmentButton) принимают проп `textTone`
 * и пробрасывают его внутреннему Text как `tone`.
 */
const TEXT_TONE_PRESETS = {
  ...TONE_PRESETS,
  muted: 'muted',
} as const satisfies Record<TonePreset | 'muted', keyof ThemeColors | undefined>;

/**
 * TextTone — тип для тонов текста.
 * Включает все канонические тона (primary, danger, success, warning, default)
 * и дополнительный тон muted для вторичного текста.
 */
export type TextTone = keyof typeof TEXT_TONE_PRESETS;

/**
 * TEXT_TONE_KEYS — все ключи карты TEXT_TONE_PRESETS.
 * Для опций расширенной оси в настройках витрины (ToneListbox tones={...}).
 */
export const TEXT_TONE_KEYS = Object.keys(TEXT_TONE_PRESETS) as TextTone[];

/**
 * getTextToneKey — ключ цвета в теме для `TextTone`.
 * `default` → undefined (наследование цвета родителя).
 *
 * @param tone — тон текста
 * @returns ключ в `ThemeColors` или undefined
 */
export function getTextToneKey(tone: TextTone): keyof ThemeColors | undefined {
  return TEXT_TONE_PRESETS[tone];
}

/**
 * getTextToneColor — цвет темы для `TextTone`.
 * `default` → undefined (цвет не задаётся, inherit с родителя).
 *
 * @param theme — текущая тема
 * @param tone — тон текста
 * @returns CSS-цвет или undefined
 */
export function getTextToneColor(theme: AppTheme, tone: TextTone): string | undefined {
  const colorKey = getTextToneKey(tone);

  return colorKey ? theme.colors[colorKey] : undefined;
}

/**
 * textSizePresets — типографические пресеты для текста.
 * Каждый пресет содержит три параметра:
 * - fontSize — размер шрифта в rem
 * - fontWeight — насыщенность шрифта (200-700)
 * - lineHeight — высота строки в rem
 *
 * Ось sizePreset у Text — это TextSizePreset (свой ряд), не SizePreset контрола
 * (small/medium/large). Контролы согласуют размер через getTextSize(sizePreset)
 * из @ui/presets. Tag — через `getTagTextSize` (локальный ряд с `tiny`).
 *
 * Доступные пресеты (по нарастанию размера):
 * - extraLight, light, thin — мелкие (0.75rem) с разной насыщенностью
 * - medium — средний (0.75rem, 500)
 * - normal — обычный (1rem, 400)
 * - bold — жирный (1.25rem, 600)
 * - extraBold — крупный (1.5rem, 700)
 */
export const textSizePresets = {
  extraBold: {
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '1.75rem',
  },
  bold: {
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.5rem',
  },
  medium: {
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1rem',
  },
  normal: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.25rem',
  },
  thin: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1rem',
  },
  light: {
    fontSize: '0.75rem',
    fontWeight: '300',
    lineHeight: '1rem',
  },
  extraLight: {
    fontSize: '0.75rem',
    fontWeight: '200',
    lineHeight: '1rem',
  },
} as const;

/**
 * TextSizePreset — тип для выбора доступных типографических пресетов.
 */
export type TextSizePreset = keyof typeof textSizePresets;

/**
 * getTextProperties — CSS-свойства текста по `TextSizePreset`.
 * Для native input/textarea, где значение нельзя обернуть в `Text`.
 *
 * @param sizePreset — типографический пресет
 * @returns строка с font-size, font-weight, line-height
 */
export function getTextProperties(sizePreset: TextSizePreset): string {
  const preset = textSizePresets[sizePreset];

  return [
    `font-size: ${preset.fontSize};`,
    `font-weight: ${preset.fontWeight};`,
    `line-height: ${preset.lineHeight};`,
  ].join('\n');
}

/**
 * TextStyleProps — тип пропсов для стилизации текста.
 * Включает:
 * - Все layout-пропсы (отступы, позиционирование, размеры)
 * - Типографические пропсы (sizePreset, align, color, tone)
 * - Дополнительные стили (fontSize, fontWeight, lineHeight, whiteSpace)
 * - Утилитарный проп ellipsis для обрезания текста
 *
 * Приоритет переопределения:
 * 1. sizePreset — базовые стили (fontSize, fontWeight, lineHeight)
 * 2. Прямые пропсы (fontSize, fontWeight, lineHeight) — переопределяют пресет
 * 3. tone — цвет текста из темы (TextTone, включая muted)
 * 4. color — переопределяет tone (приоритет выше); в kit на Text напрямую не используется
 * 5. Без color и без tone с ключом в теме — color в CSS не задаётся, наследование от родителя
 */
export type TextStyleProps = LayoutProps & {
  align?: CSSProperties['textAlign'];
  /** Переопределение цвета текста перекрывает свойство tone. */
  color?: string;
  /** Однострочное обрезание: overflow + text-overflow + white-space одним пропом. */
  ellipsis?: boolean;
  fontSize?: string;
  fontWeight?: CSSProperties['fontWeight'];
  lineHeight?: CSSProperties['lineHeight'];
  sizePreset?: TextSizePreset;
  tone?: TextTone;
  whiteSpace?: CSSProperties['whiteSpace'];
};

/**
 * TEXT_PROP_NAMES — множество всех имён пропсов для текста.
 * Используется в shouldForwardProp, чтобы не передавать текстовые пропсы
 * на DOM-узел (они используются только для генерации стилей).
 *
 * Собирает:
 * - Все LAYOUT_PROP_NAMES (отступы, позиционирование, размеры)
 * - Текстовые пропсы (align, color, ellipsis, fontSize, fontWeight,
 *   lineHeight, sizePreset, tone, whiteSpace)
 */
const TEXT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'align',
  'color',
  'ellipsis',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'sizePreset',
  'tone',
  'whiteSpace',
]);

/**
 * getTextStyles — основная функция для генерации CSS-стилей текста.
 *
 * Алгоритм работы:
 * 1. Получает текущую тему через getTheme(props)
 * 2. Выбирает пресет по sizePreset (по умолчанию 'normal')
 * 3. Применяет базовые стили из пресета (fontSize, fontWeight, lineHeight)
 * 4. Переопределяет прямыми пропсами, если они переданы
 * 5. Резолвит цвет: color > tone с ключом в теме; иначе правило color не добавляется
 *    (наследование через color: inherit у StyledText — типично внутри цветного контрола)
 * 6. Добавляет стили для align, whiteSpace
 * 7. Если ellipsis === true, добавляет overflow: hidden, text-overflow: ellipsis,
 *    white-space: nowrap
 *
 * @param props — объект с текстовыми пропсами и темой
 * @returns строка CSS-стилей, каждая декларация с новой строки
 */
export function getTextStyles(props: TextStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    align,
    color,
    ellipsis,
    fontSize,
    fontWeight,
    lineHeight,
    sizePreset = 'normal',
    tone,
    whiteSpace,
  } = props;

  const styles: string[] = [getTextProperties(sizePreset)];

  if (fontSize !== undefined) {
    styles.push(`font-size: ${fontSize};`);
  }

  if (fontWeight !== undefined) {
    styles.push(`font-weight: ${fontWeight};`);
  }

  if (lineHeight !== undefined) {
    styles.push(`line-height: ${lineHeight};`);
  }

  const textColor =
    color ?? (tone !== undefined ? getTextToneColor(theme, tone) : undefined);

  if (textColor !== undefined) {
    styles.push(`color: ${textColor};`);
  }

  if (align !== undefined) {
    styles.push(`text-align: ${align};`);
  }

  if (whiteSpace !== undefined) {
    styles.push(`white-space: ${whiteSpace};`);
  }

  if (ellipsis === true) {
    styles.push('overflow: hidden;');
    styles.push('text-overflow: ellipsis;');
    styles.push('white-space: nowrap;');
  }

  return styles.join('\n');
}

/**
 * StyledText — стилизованный компонент для отображения текста.
 * Базируется на span и поддерживает все пропсы из TextStyleProps.
 *
 * Встроенные стили:
 * - min-inline-size: 0 — предотвращает переполнение в flex-контейнерах
 * - color: inherit — без tone/color у Text цвет берётся с родителя; Button задаёт цвет
 *   на обёртке, подпись наследует его без отдельного textTone
 * - overflow-wrap: break-word — перенос длинных слов
 *
 * Генерация стилей:
 * 1. getTextStyles — типографика, цвет, выравнивание
 * 2. getLayoutStyles — отступы, позиционирование, размеры
 *
 * shouldForwardProp предотвращает проброс текстовых и layout-пропсов на DOM-узел,
 * так как они используются только для генерации стилей.
 */
export const StyledText = styled.span.withConfig({
  shouldForwardProp: (prop) => !TEXT_PROP_NAMES.has(prop),
})<TextStyleProps>`
  min-inline-size: 0;
  color: inherit;
  overflow-wrap: break-word;
  ${(props) => getTextStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
