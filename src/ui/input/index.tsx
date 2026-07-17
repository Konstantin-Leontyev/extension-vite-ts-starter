/**
 * Файл: `src/ui/input/index.tsx`
 * Предоставляет компонент Input для отображения однострочного текстового поля.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму строки-поля через проп `shape`
 *  - горизонтальное выравнивание значения через проп `textAlign`
 *  - подпись над полем через проп `label`
 *  - встроенную строку ошибки через проп `error`
 *  - выравнивание строки ошибки через проп `errorAlign`
 *  - кольцо ошибки без текста через проп `invalid`
 *  - резерв высоты под строку ошибки через проп `reserveErrorSpace`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Input
 * 2. Типизировать пропсы через `InputProps`
 * 3. Связывать подпись, поле и строку ошибки для доступности
 *
 * Потребители:
 *  - контролы и панели настроек витрины дизайн-системы, например TextGroup и InputSettings —
 *    рендерят поля ввода настроек
 *  - страницы и виджеты приложения — собирают формы и фильтры
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { useId, type CSSProperties, type ComponentPropsWithRef } from 'react';

import { Text, getTextLineHeight, type TextSizePreset, type TextTone } from '@ui/text';

import {
  StyledInputControl,
  StyledInputRoot,
  splitLayoutProps,
  type InputStyleProps,
} from './input.styles';

/**
 * DEFAULT_INPUT_ERROR_ALIGN — задаёт горизонтальное выравнивание строки ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `errorAlign`.
 */
const DEFAULT_INPUT_ERROR_ALIGN: CSSProperties['textAlign'] = 'center';

/**
 * INPUT_ERROR_TEXT_SIZE_PRESET — задаёт типографический пресет строки ошибки.
 * Используется для текста ошибки и расчёта резерва высоты.
 */
const INPUT_ERROR_TEXT_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * INPUT_ERROR_TONE — задаёт тон строки ошибки.
 * Сообщение об ошибке выделяется семантическим тоном `danger`.
 */
const INPUT_ERROR_TONE: TextTone = 'danger';

/**
 * DEFAULT_INPUT_INVALID — задаёт состояние кольца ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `invalid`.
 */
const DEFAULT_INPUT_INVALID = false;

/**
 * INPUT_LABEL_SIZE_PRESET — задаёт размер подписи над полем.
 * Используется для текста в `label`.
 */
const INPUT_LABEL_SIZE_PRESET: TextSizePreset = 'medium';

/**
 * INPUT_LABEL_TEXT_TONE — задаёт тон подписи.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const INPUT_LABEL_TEXT_TONE: TextTone = 'muted';

/**
 * DEFAULT_INPUT_RESERVE_ERROR_SPACE — задаёт резерв высоты под строку ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveErrorSpace`.
 */
const DEFAULT_INPUT_RESERVE_ERROR_SPACE = true;

/**
 * InputProps — представляет пропсы компонента Input.
 *
 * @property error — текст ошибки под полем
 * @property errorAlign — горизонтальное выравнивание строки ошибки
 * @property invalid — включает кольцо ошибки без текста, если проп `error` не передан
 * @property label — подпись над полем
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки, чтобы появление текста не сдвигало соседей
 */
type InputProps = InputStyleProps & {
  error?: string;
  errorAlign?: CSSProperties['textAlign'];
  invalid?: boolean;
  label?: string;
  reserveErrorSpace?: boolean;
} & Omit<ComponentPropsWithRef<'input'>, 'className' | 'style' | keyof InputStyleProps>;

/**
 * Input — отображает однострочное текстовое поле с подписью и строкой ошибки.
 *
 * @example
 * <Input label="Email" placeholder="name@example.com" />
 * <Input error="Required field" reserveErrorSpace />
 */
export function Input({
  error,
  errorAlign = DEFAULT_INPUT_ERROR_ALIGN,
  invalid = DEFAULT_INPUT_INVALID,
  label,
  reserveErrorSpace = DEFAULT_INPUT_RESERVE_ERROR_SPACE,
  shape,
  sizePreset,
  textAlign,
  ...rest
}: InputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { 'aria-describedby': ariaDescribedBy, ...inputControl } = restProps;
  const fallbackId = useId();
  const id = inputControl.id ?? fallbackId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error?.trim());
  const isInvalid = hasError || invalid;
  const showError = hasError || reserveErrorSpace;
  const describedBy =
    [hasError ? errorId : null, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <StyledInputRoot {...layoutProps}>
      {Boolean(label) && (
        <Text
          as="label"
          htmlFor={id}
          sizePreset={INPUT_LABEL_SIZE_PRESET}
          tone={INPUT_LABEL_TEXT_TONE}
        >
          {label}
        </Text>
      )}
      <StyledInputControl
        type="text"
        {...inputControl}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        id={id}
        shape={shape}
        sizePreset={sizePreset}
        textAlign={textAlign}
      />
      {showError && (
        <Text
          align={errorAlign}
          aria-live="polite"
          as="p"
          id={errorId}
          minBlockSize={
            reserveErrorSpace
              ? getTextLineHeight(INPUT_ERROR_TEXT_SIZE_PRESET)
              : undefined
          }
          sizePreset={INPUT_ERROR_TEXT_SIZE_PRESET}
          tone={INPUT_ERROR_TONE}
        >
          {hasError && error}
        </Text>
      )}
    </StyledInputRoot>
  );
}
