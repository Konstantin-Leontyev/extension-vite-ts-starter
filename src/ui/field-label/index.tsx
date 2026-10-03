/**
 * Файл: `src/ui/field-label/index.tsx`
 * Предоставляет компонент FieldLabel для отображения подписи поля.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - курсивное начертание через проп `italic`
 *  - выравнивание через проп `align`
 *  - перенос строк через проп `whiteSpace`
 *  - обрезку с многоточием через проп `ellipsis`
 *  - переопределение цвета через проп `color`
 *  - переопределение размера шрифта через проп `fontSize`
 *  - переопределение насыщенности через проп `fontWeight`
 *  - переопределение высоты строки через проп `lineHeight`
 *  - содержимое через `children`. Без `children` подпись не отображается
 *  - связь с контролом через проп `htmlFor`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldLabel
 * 2. Типизировать пропсы через `FieldLabelProps`
 * 3. Фиксировать типографику подписи и корневой элемент `label`
 * 4. Экспортировать генератор `getFieldLabelRootStyles`
 *
 * Потребители:
 *  - контролы, например Input, Listbox, RangeInput, Button, SegmentButton,
 *    DateRangeInput и Stepper — рендерят подпись поля
 *  - styles-файлы Button, Input, SearchField, SegmentButton и Stepper —
 *    подключают `getFieldLabelRootStyles`:
 *     - `src/ui/button/button.styles.ts`
 *     - `src/ui/input/input.styles.ts`
 *     - `src/ui/search-field/search-field.styles.ts`
 *     - `src/ui/segment-button/segment-button.styles.ts`
 *     - `src/ui/stepper/stepper.styles.ts`
 */

import {
  Text,
  type TextProps,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';

import { getFieldLabelRootStyles } from './field-label.styles';

/**
 * FIELD_LABEL_SIZE_PRESET — задаёт типографический пресет подписи поля.
 * Размер вшит в FieldLabel, вызывающий код его не переопределяет.
 */
const FIELD_LABEL_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * FIELD_LABEL_TEXT_TONE — задаёт тон текста подписи поля.
 * Подпись поля — вторичный текст, поэтому `muted`.
 */
const FIELD_LABEL_TEXT_TONE: TextTonePreset = 'muted';

/**
 * FieldLabelProps — представляет пропсы компонента FieldLabel.
 *
 * @property htmlFor — id связанного контрола
 */
type FieldLabelProps = {
  htmlFor?: string;
} & Omit<TextProps<'label'>, 'as' | 'className' | 'htmlFor' | 'size' | 'style' | 'tone'>;

/**
 * FieldLabel — отображает подпись поля.
 *
 * @example
 * <FieldLabel htmlFor={buttonId}>{label}</FieldLabel>
 * <FieldLabel id={labelId}>{label}</FieldLabel>
 */
function FieldLabel({ children, htmlFor, ...rest }: FieldLabelProps) {
  if (!children) {
    return null;
  }

  return (
    <Text
      as="label"
      htmlFor={htmlFor}
      size={FIELD_LABEL_SIZE_PRESET}
      tone={FIELD_LABEL_TEXT_TONE}
      {...rest}
    >
      {children}
    </Text>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт генератора корня поля */
export { FieldLabel, getFieldLabelRootStyles };
