/**
 * Файл: `src/ui/input/index.tsx`
 * Предоставляет компонент Input для отображения однострочного текстового поля.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму строки-поля через проп `shape`
 *  - рамку контрола через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - горизонтальное выравнивание значения через проп `textAlign`
 *  - курсив значения через проп `textItalic`
 *  - подпись над полем через проп `label`
 *  - встроенную строку ошибки через проп `error`
 *  - серую подсказку в полоске ошибки через проп `errorPlaceholder`
 *  - обводку ошибки без текста через проп `invalid`
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
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { useId, type ComponentPropsWithRef } from 'react';

import { FieldError } from '@ui/field-error';
import { FieldLabel } from '@ui/field-label';

import {
  StyledInputControl,
  StyledInputRoot,
  splitLayoutProps,
  type InputStyleProps,
} from './input.styles';

/**
 * DEFAULT_INPUT_INVALID — задаёт состояние обводки ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `invalid`.
 */
const DEFAULT_INPUT_INVALID = false;

/**
 * InputProps — представляет пропсы компонента Input.
 *
 * @property error — текст ошибки под полем
 * @property errorPlaceholder — серая подсказка в полоске ошибки, пока нет ошибки
 * @property invalid — включает обводку ошибки без текста, если проп `error` не передан
 * @property label — подпись над полем
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки, чтобы появление текста не сдвигало соседей
 */
type InputProps = InputStyleProps & {
  error?: string;
  errorPlaceholder?: string;
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
  errorPlaceholder,
  invalid = DEFAULT_INPUT_INVALID,
  label,
  reserveErrorSpace,
  ...rest
}: InputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const fallbackId = useId();
  const id = restProps.id ?? fallbackId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error?.trim());
  const isInvalid = hasError || invalid;
  const describedBy =
    [hasError ? errorId : null, restProps['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined;

  return (
    <StyledInputRoot {...layoutProps}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledInputControl
        type="text"
        {...restProps}
        aria-describedby={describedBy}
        aria-invalid={isInvalid ? true : undefined}
        id={id}
      />
      <FieldError
        id={errorId}
        placeholder={errorPlaceholder}
        reserveErrorSpace={reserveErrorSpace}
      >
        {error}
      </FieldError>
    </StyledInputRoot>
  );
}
