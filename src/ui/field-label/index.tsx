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
 *
 * Потребители:
 *  - контролы, например Input, Listbox, Combobox и RangeInput — рендерят подпись поля
 *  - `src/pages/showcase/stepper-settings/index.tsx` — рендерит подпись поля шага
 */

import { type ComponentProps, type ReactNode } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

/**
 * FIELD_LABEL_SIZE_PRESET — задаёт типографический пресет подписи поля.
 * Размер вшит в FieldLabel, вызывающий код его не переопределяет.
 */
const FIELD_LABEL_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * FIELD_LABEL_TEXT_TONE — задаёт тон текста подписи поля.
 * Подпись поля — вторичный текст, поэтому `muted`.
 */
const FIELD_LABEL_TEXT_TONE: TextTone = 'muted';

/**
 * FieldLabelProps — представляет пропсы компонента FieldLabel.
 *
 * @property children — содержимое подписи. Без `children` подпись не отображается
 * @property htmlFor — id связанного контрола
 */
type FieldLabelProps = {
  children?: ReactNode;
  htmlFor?: string;
} & Omit<
  ComponentProps<typeof Text>,
  'as' | 'children' | 'className' | 'htmlFor' | 'sizePreset' | 'style' | 'tone'
>;

/**
 * FieldLabel — отображает подпись поля.
 *
 * @example
 * <FieldLabel htmlFor={id}>{label}</FieldLabel>
 * <FieldLabel htmlFor={STEP_FIELD_ID} id={STEP_LABEL_ID}>
 *   Step:
 * </FieldLabel>
 */
export function FieldLabel({ children, htmlFor, ...rest }: FieldLabelProps) {
  if (!children) {
    return null;
  }

  return (
    <Text
      as="label"
      htmlFor={htmlFor}
      sizePreset={FIELD_LABEL_SIZE_PRESET}
      tone={FIELD_LABEL_TEXT_TONE}
      {...rest}
    >
      {children}
    </Text>
  );
}
