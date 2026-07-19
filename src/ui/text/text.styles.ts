/**
 * Файл: `src/ui/text/text.styles.ts`
 * Определяет внешний вид компонента Text.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TextStyleProps`, `TextTone` и `TextSizePreset`
 * 2. Хранить тоны текста в `TEXT_TONE_PRESETS` и пресеты типографики в `textSizePresets`
 * 3. Предоставить функции `getTextProperties` и `getTextLineHeight`,
 *    а также перечни `TEXT_TONE_KEYS`, `TEXT_SIZE_PRESET_KEYS` и `TEXT_ALIGN_PRESET_KEYS`
 * 4. Предоставить styled-узел `StyledText`
 *
 * Потребители:
 *  - `src/ui/text/index.tsx` — собирает компонент Text и реэкспортирует публичное API
 *  - `@ui/presets` — собирает типографику контрола через `getTextProperties`
 *  - `@ui/table/column-sizing` — замеряет ширину колонки по `textSizePresets`
 *  - `@ui/table/table-inline-field`, `@ui/stepper` — стилизуют нативные
 *    поля ввода через `getTextProperties`
 *  - `@ui/input`, `@ui/combobox`, `@ui/listbox`, `@ui/range-input`, `@ui/spinner`,
 *    `@ui/table` — резервируют место под однострочный текст через `getTextLineHeight`
 */

import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { getTheme, type AppTheme, type ThemeColors } from '@ui/theme';
import { TONE_PRESETS, type TonePreset } from '@ui/tones';

/**
 * textSizePresets — хранит типографические пресеты текста.
 * Каждый пресет содержит три свойства:
 *  - `fontSize` — размер шрифта в rem
 *  - `fontWeight` — насыщенность шрифта от 200 до 700
 *  - `lineHeight` — высота строки в rem
 *
 * Проп `sizePreset` у Text принимает `TextSizePreset` — собственный ряд,
 * отличный от `SizePreset` контролов. Контролы согласуют размер через
 * `getTextSize` из `@ui/presets`, Tag — через `getTagTextSize` с локальным рядом.
 *
 * Экспортируется для замера ширины колонок в `@ui/table/column-sizing`,
 * чтение стилей — через `getTextProperties`.
 */
export const textSizePresets = Object.freeze({
  extraBold: Object.freeze({
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '1.75rem',
  } as const),
  bold: Object.freeze({
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.5rem',
  } as const),
  medium: Object.freeze({
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1rem',
  } as const),
  normal: Object.freeze({
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.25rem',
  } as const),
  thin: Object.freeze({
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1rem',
  } as const),
  light: Object.freeze({
    fontSize: '0.75rem',
    fontWeight: '300',
    lineHeight: '1rem',
  } as const),
  extraLight: Object.freeze({
    fontSize: '0.75rem',
    fontWeight: '200',
    lineHeight: '1rem',
  } as const),
} as const);

/**
 * TextSizePreset — представляет доступные типографические пресеты текста.
 */
export type TextSizePreset = keyof typeof textSizePresets;

/**
 * TEXT_SIZE_PRESET_KEYS — формирует перечень типографических пресетов из ключей `textSizePresets`.
 * Используется в панелях настроек витрины дизайн-системы: `SizeListbox` принимает его пропом `sizes`.
 */
export const TEXT_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(textSizePresets) as TextSizePreset[]
);

/**
 * DEFAULT_TEXT_SIZE_PRESET — задаёт типографический пресет по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
const DEFAULT_TEXT_SIZE_PRESET: TextSizePreset = 'normal';

/**
 * getTextProperties — возвращает CSS-правила типографики: размер, насыщенность
 * и высоту строки.
 * Используется для нативных `<input>` и `<textarea>`, которые нельзя обернуть
 * в компонент Text.
 *
 * @param sizePreset типографический пресет
 * @returns значения для CSS-свойств `font-size`, `font-weight`, `line-height`
 */
export function getTextProperties(sizePreset: TextSizePreset): string {
  const preset = textSizePresets[sizePreset];

  const styles = [
    `font-size: ${preset.fontSize};`,
    `font-weight: ${preset.fontWeight};`,
    `line-height: ${preset.lineHeight};`,
  ];

  return styles.join('\n');
}

/**
 * getTextLineHeight — возвращает высоту строки для типографического пресета.
 * Используется для резерва места под однострочный Text без захардкоженных значений.
 *
 * @param sizePreset типографический пресет
 * @returns значение для CSS-свойства `line-height`
 */
export function getTextLineHeight(sizePreset: TextSizePreset): string {
  return textSizePresets[sizePreset].lineHeight;
}

/**
 * TextAlignPreset — представляет выравнивание текста в каноническом ряду проекта.
 */
export type TextAlignPreset = 'center' | 'end' | 'start';

/**
 * TEXT_ALIGN_PRESET_KEYS — задаёт перечень канонических выравниваний текста.
 * Используется в панелях настроек витрины дизайн-системы: `AlignListbox` принимает его пропом `aligns`.
 */
export const TEXT_ALIGN_PRESET_KEYS = Object.freeze([
  'start',
  'center',
  'end',
] as const satisfies readonly TextAlignPreset[]);

/**
 * TEXT_TONE_PRESETS — связывает тоны текста с ключами цвета в теме.
 * Расширяет канон `TONE_PRESETS` спредом, добавляя тон `muted` для вторичного текста.
 *
 * Соответствие приватно для модуля. Экспортируется только перечень `TEXT_TONE_KEYS`,
 * цвет подставляют приватные `getTextToneColorKey` и `getTextToneColor`.
 */
const TEXT_TONE_PRESETS = {
  ...TONE_PRESETS,
  muted: 'muted',
} as const satisfies Record<'muted' | TonePreset, keyof ThemeColors | undefined>;

/**
 * TextTone — представляет тоны текста.
 * Включает все канонические тона и дополнительный `muted` для вторичного текста.
 */
export type TextTone = keyof typeof TEXT_TONE_PRESETS;

/**
 * TEXT_TONE_KEYS — формирует перечень тонов текста из ключей `TEXT_TONE_PRESETS`.
 * Используется в панелях настроек витрины дизайн-системы: `ToneListbox` принимает его пропом `tones`.
 */
export const TEXT_TONE_KEYS = Object.freeze(
  Object.keys(TEXT_TONE_PRESETS) as TextTone[]
);

/**
 * getTextToneColorKey — возвращает ключ цвета в теме для указанного тона текста.
 * Для тона по умолчанию возвращает `undefined` — цвет наследуется от родителя.
 *
 * @param tone тон текста
 * @returns ключ цвета темы или `undefined`
 */
function getTextToneColorKey(tone: TextTone): keyof ThemeColors | undefined {
  return TEXT_TONE_PRESETS[tone];
}

/**
 * getTextToneColor — возвращает цвет темы для указанного тона текста.
 * Для тона по умолчанию возвращает `undefined` — цвет наследуется от родителя.
 *
 * @param theme текущая тема
 * @param tone тон текста
 * @returns CSS-цвет или `undefined`
 */
function getTextToneColor(theme: AppTheme, tone: TextTone): string | undefined {
  const colorKey = getTextToneColorKey(tone);

  return colorKey ? theme.colors[colorKey] : undefined;
}

/**
 * TextStyleProps — представляет пропсы стилизации Text и layout-пропсы.
 * Без `color` и `tone` цвет наследуется от родителя.
 *
 * @property align — выравнивание текста
 * @property color — прямое переопределение цвета, приоритетнее `tone`
 * @property fontSize — размер шрифта, переопределяет `sizePreset`
 * @property fontWeight — насыщенность шрифта, переопределяет `sizePreset`
 * @property italic — включает курсивное начертание
 * @property lineHeight — высота строки, переопределяет `sizePreset`
 * @property showEllipsis — включает однострочное обрезание с многоточием
 * @property sizePreset — типографический пресет
 * @property tone — цвет текста из темы
 * @property whiteSpace — управление переносами
 */
export type TextStyleProps = LayoutProps & {
  align?: CSSProperties['textAlign'];
  color?: string;
  fontSize?: string;
  fontWeight?: CSSProperties['fontWeight'];
  italic?: boolean;
  lineHeight?: CSSProperties['lineHeight'];
  showEllipsis?: boolean;
  sizePreset?: TextSizePreset;
  tone?: TextTone;
  whiteSpace?: CSSProperties['whiteSpace'];
};

/**
 * TEXT_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Text.
 */
const TEXT_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'align',
  'color',
  'fontSize',
  'fontWeight',
  'italic',
  'lineHeight',
  'showEllipsis',
  'sizePreset',
  'tone',
  'whiteSpace',
]);

/**
 * getTextStyles — преобразует текстовые пропсы в готовые CSS-правила.
 *
 * Как работает:
 * 1. Получает текущую тему через `getTheme`
 * 2. Выбирает пресет по `sizePreset`, по умолчанию `normal`, и применяет
 *    его типографику через `getTextProperties`
 * 3. Переопределяет типографику прямыми пропсами `fontSize`, `fontWeight`
 *    и `lineHeight`, если они переданы
 * 4. Добавляет `font-style: italic`, если передан проп `italic`
 * 5. Выбирает цвет: `color`, иначе цвет тона из темы. Без обоих правило
 *    `color` не добавляется — работает наследование через `color: inherit`
 *    у `StyledText`, типичное внутри цветного контрола
 * 6. Добавляет правила для `align` и `whiteSpace`
 * 7. Для `showEllipsis` добавляет `overflow: hidden`, `text-overflow: ellipsis`
 *    и `white-space: nowrap`
 *
 * @param props объект с текстовыми пропсами и темой
 * @returns CSS-правила, каждое с новой строки
 */
function getTextStyles(props: TextStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    align,
    color,
    fontSize,
    fontWeight,
    italic,
    lineHeight,
    showEllipsis,
    sizePreset = DEFAULT_TEXT_SIZE_PRESET,
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

  if (italic === true) {
    styles.push('font-style: italic;');
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

  if (showEllipsis === true) {
    styles.push('overflow: hidden;');
    styles.push('text-overflow: ellipsis;');
    styles.push('white-space: nowrap;');
  }

  return styles.join('\n');
}

/**
 * StyledText — задаёт корневой узел компонента Text.
 * Базируется на `<span>` и поддерживает все пропсы из `TextStyleProps`.
 *
 * Встроенные стили:
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `color: inherit` — без `tone` и `color` цвет текста наследуется от родителя
 *  - `overflow-wrap: break-word` — перенос длинных слов
 *
 * Генерация стилей:
 *  - `getTextStyles` — типографика, цвет, выравнивание
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
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
