/**
 * Файл: `src/ui/field-error/index.tsx`
 * Предоставляет компонент FieldError для отображения строки ошибки поля.
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
 *  - резерв высоты под строку ошибки через проп `reserveErrorSpace`
 *  - содержимое через `children`. Без текста и без резерва строка не отображается
 *  - связь с контролом через проп `id`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldError
 * 2. Типизировать пропсы через `FieldErrorProps`
 * 3. Фиксировать типографику строки ошибки и корневой элемент `p`
 * 4. Выставлять `aria-live="polite"`
 *
 * Потребители:
 *  - контролы, например Input, Listbox, Combobox и RangeInput — рендерят строку
 *    ошибки поля и резерв высоты под неё
 */

import { type CSSProperties, type ComponentProps, type ReactNode } from 'react';

import { Text, getTextLineHeight, type TextSizePreset, type TextTone } from '@ui/text';

/**
 * DEFAULT_FIELD_ERROR_ALIGN — задаёт горизонтальное выравнивание строки ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `align`.
 */
const DEFAULT_FIELD_ERROR_ALIGN: CSSProperties['textAlign'] = 'center';

/**
 * FIELD_ERROR_SIZE_PRESET — задаёт типографический пресет строки ошибки.
 * Размер вшит в FieldError, вызывающий код его не переопределяет.
 */
const FIELD_ERROR_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * FIELD_ERROR_TEXT_TONE — задаёт тон текста строки ошибки.
 * Сообщение об ошибке выделяется семантическим тоном `danger`.
 */
const FIELD_ERROR_TEXT_TONE: TextTone = 'danger';

/**
 * FieldErrorProps — представляет пропсы компонента FieldError.
 *
 * @property align — горизонтальное выравнивание строки ошибки
 * @property children — текст ошибки. Пустая или пробельная строка не отображается как текст
 * @property id — id строки ошибки для связи с контролом
 * @property italic — включает курсив строки ошибки
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 */
type FieldErrorProps = {
  align?: CSSProperties['textAlign'];
  children?: ReactNode;
  id?: string;
  italic?: boolean;
  reserveErrorSpace?: boolean;
} & Omit<
  ComponentProps<typeof Text>,
  | 'align'
  | 'as'
  | 'children'
  | 'className'
  | 'id'
  | 'italic'
  | 'sizePreset'
  | 'style'
  | 'tone'
>;

/**
 * FieldError — отображает строку ошибки поля.
 *
 * @example
 * <FieldError id={errorId}>{error}</FieldError>
 * <FieldError id={errorId} reserveErrorSpace>
 *   {error}
 * </FieldError>
 */
export function FieldError({
  align = DEFAULT_FIELD_ERROR_ALIGN,
  children,
  id,
  italic,
  reserveErrorSpace,
  ...rest
}: FieldErrorProps) {
  const hasError =
    typeof children === 'string' ? Boolean(children.trim()) : Boolean(children);
  const showError = hasError || reserveErrorSpace;

  if (!showError) {
    return null;
  }

  return (
    <Text
      align={align}
      aria-live="polite"
      as="p"
      id={id}
      italic={italic}
      minBlockSize={
        reserveErrorSpace ? getTextLineHeight(FIELD_ERROR_SIZE_PRESET) : undefined
      }
      sizePreset={FIELD_ERROR_SIZE_PRESET}
      tone={FIELD_ERROR_TEXT_TONE}
      {...rest}
    >
      {hasError && children}
    </Text>
  );
}
