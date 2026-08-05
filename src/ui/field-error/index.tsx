/**
 * Файл: `src/ui/field-error/index.tsx`
 * Предоставляет компонент FieldError для отображения строки ошибки или подсказки поля.
 * Вид строки вшит: размер `thin`, выравнивание `center`, ошибка — тон `danger`,
 * подсказка — тон `muted`. Вызывающий код тон, выравнивание и курсив не переопределяет.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - резерв высоты под строку через проп `reserveErrorSpace`
 *  - серую подсказку через проп `placeholder`, пока нет ошибки
 *  - текст ошибки через `children`. Пустая строка не считается ошибкой
 *  - связь с контролом через проп `id`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldError
 * 2. Типизировать пропсы через `FieldErrorProps`
 * 3. Фиксировать типографику строки и корневой элемент `p`
 * 4. Выставлять `aria-live="polite"`
 *
 * Потребители:
 *  - контролы Input и RangeInput — рендерят строку ошибки поля и резерв высоты под неё
 *  - `src/ui/table` — полоска ошибки или подсказки в панелях добавления и редактирования
 *    строки
 */

import { type CSSProperties, type ComponentProps } from 'react';

import { Text, getTextLineHeight, type TextSizePreset, type TextTone } from '@ui/text';

/**
 * DEFAULT_FIELD_ERROR_RESERVE_ERROR_SPACE — задаёт резерв высоты строки по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveErrorSpace`.
 */
const DEFAULT_FIELD_ERROR_RESERVE_ERROR_SPACE = false;

/**
 * FIELD_ERROR_ALIGN — задаёт горизонтальное выравнивание строки.
 * Выравнивание вшито в FieldError, вызывающий код его не переопределяет.
 */
const FIELD_ERROR_ALIGN: CSSProperties['textAlign'] = 'center';

/**
 * FIELD_ERROR_SIZE_PRESET — задаёт типографический пресет строки.
 * Размер вшит в FieldError, вызывающий код его не переопределяет.
 */
const FIELD_ERROR_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * FIELD_ERROR_TEXT_TONE — задаёт тон текста ошибки.
 * Сообщение об ошибке выделяется семантическим тоном `danger`.
 */
const FIELD_ERROR_TEXT_TONE: TextTone = 'danger';

/**
 * FIELD_ERROR_PLACEHOLDER_TEXT_TONE — задаёт тон текста подсказки.
 * Подсказка — вторичный текст, поэтому `muted`.
 */
const FIELD_ERROR_PLACEHOLDER_TEXT_TONE: TextTone = 'muted';

/**
 * FieldErrorProps — представляет пропсы компонента FieldError.
 *
 * @property children — текст ошибки. Пустая или пробельная строка не отображается как ошибка
 * @property id — id строки для связи с контролом
 * @property placeholder — серая подсказка в той же полоске, пока нет ошибки
 * @property reserveErrorSpace — включает резерв высоты под строку
 */
type FieldErrorProps = {
  children?: string;
  id?: string;
  placeholder?: string;
  reserveErrorSpace?: boolean;
} & Omit<
  ComponentProps<typeof Text>,
  | 'align'
  | 'as'
  | 'children'
  | 'className'
  | 'color'
  | 'ellipsis'
  | 'fontSize'
  | 'fontWeight'
  | 'id'
  | 'italic'
  | 'lineHeight'
  | 'sizePreset'
  | 'style'
  | 'tone'
  | 'whiteSpace'
>;

/**
 * FieldError — отображает строку ошибки или подсказки поля.
 *
 * @example
 * <FieldError id={errorId}>{error}</FieldError>
 * <FieldError id={errorId} placeholder="Press Esc to cancel.">
 *   {error}
 * </FieldError>
 * <FieldError id={errorId} reserveErrorSpace>
 *   {error}
 * </FieldError>
 */
export function FieldError({
  children,
  id,
  placeholder,
  reserveErrorSpace = DEFAULT_FIELD_ERROR_RESERVE_ERROR_SPACE,
  ...rest
}: FieldErrorProps) {
  const errorText = children?.trim() ?? '';
  const placeholderText = placeholder?.trim() ?? '';
  const hasError = errorText.length > 0;
  const hasPlaceholder = placeholderText.length > 0;
  const showRow = hasError || hasPlaceholder || reserveErrorSpace;

  if (!showRow) {
    return null;
  }

  return (
    <Text
      align={FIELD_ERROR_ALIGN}
      aria-live="polite"
      as="p"
      id={id}
      minBlockSize={
        reserveErrorSpace ? getTextLineHeight(FIELD_ERROR_SIZE_PRESET) : undefined
      }
      sizePreset={FIELD_ERROR_SIZE_PRESET}
      tone={hasError ? FIELD_ERROR_TEXT_TONE : FIELD_ERROR_PLACEHOLDER_TEXT_TONE}
      {...rest}
    >
      {hasError ? errorText : hasPlaceholder ? placeholderText : null}
    </Text>
  );
}
