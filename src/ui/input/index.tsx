/**
 * Файл: `src/ui/input/index.tsx`
 * Предоставляет компонент Input для отображения однострочного текстового поля.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму строки-поля через проп `shape`
 *  - форму кнопки сброса через проп `clearShape`. Без `clearShape` форма
 *    выводится из `shape`
 *  - рамку контрола через проп `showBorder`
 *  - тень через проп `showShadow`
 *  - тон рамки через проп `borderTone`
 *  - контролируемое значение через проп `value`. Без `value` поле неконтролируемое
 *  - кнопку сброса через проп `showClear`. Дефолт — сброс есть; кнопка
 *    появляется при непустом значении
 *  - обработчик сброса через проп `onClear`
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

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
} from 'react';

import { resolveClearAriaLabel } from '@ui/a11y';
import { FieldClear } from '@ui/field-clear';
import { FieldError } from '@ui/field-error';
import { FieldLabel } from '@ui/field-label';
import { resolveIconShape, type IconShapePreset } from '@ui/icon';
import { assignRef } from '@ui/ref';

import {
  StyledInputControl,
  StyledInputRoot,
  StyledInputRow,
  splitLayoutProps,
  type InputStyleProps,
} from './input.styles';

/**
 * DEFAULT_INPUT_INVALID — задаёт состояние обводки ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `invalid`.
 */
const DEFAULT_INPUT_INVALID = false;

/**
 * DEFAULT_INPUT_SHOW_CLEAR — задаёт показ кнопки сброса по умолчанию.
 * Используется, когда вызывающий код не передал проп `showClear`.
 */
const DEFAULT_INPUT_SHOW_CLEAR = true;

/**
 * InputValueProps — представляет пропсы контролируемого значения Input.
 * При переданном `value` обработчик `onClear` обязателен.
 *
 * @property onClear — обработчик сброса значения
 * @property value — контролируемое значение
 */
type InputValueProps =
  | {
      onClear: () => void;
      value: number | readonly string[] | string;
    }
  | {
      onClear?: () => void;
      value?: never;
    };

/**
 * InputProps — представляет пропсы компонента Input.
 *
 * @property clearShape — форма кнопки сброса
 * @property error — текст ошибки под полем
 * @property errorPlaceholder — серая подсказка в полоске ошибки, пока нет ошибки
 * @property invalid — включает обводку ошибки без текста, если проп `error` не передан
 * @property label — подпись над полем
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки, чтобы появление текста не сдвигало соседей
 * @property showClear — включает кнопку сброса
 */
type InputProps = InputStyleProps &
  InputValueProps & {
    clearShape?: IconShapePreset;
    error?: string;
    errorPlaceholder?: string;
    invalid?: boolean;
    label?: string;
    reserveErrorSpace?: boolean;
    showClear?: boolean;
  } & Omit<
    ComponentPropsWithRef<'input'>,
    'className' | 'style' | 'value' | keyof InputStyleProps
  >;

/**
 * Input — отображает однострочное текстовое поле с подписью и строкой ошибки.
 *
 * @example
 * <Input label="Email" placeholder="name@example.com" />
 * <Input error="Required field" reserveErrorSpace />
 */
export function Input({
  borderTone,
  clearShape: clearShapeProp,
  error,
  errorPlaceholder,
  invalid = DEFAULT_INPUT_INVALID,
  label,
  onClear,
  reserveErrorSpace,
  shape,
  showBorder,
  showClear = DEFAULT_INPUT_SHOW_CLEAR,
  showShadow,
  sizePreset,
  value,
  ...rest
}: InputProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const { defaultValue, disabled, id: idProp, onChange, ref, ...inputProps } = restProps;
  const fallbackId = useId();
  const id = idProp ?? fallbackId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error?.trim());
  const isInvalid = hasError || invalid;
  const describedBy =
    [hasError ? errorId : null, restProps['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = value !== undefined;
  const [hasUncontrolledValue, setHasUncontrolledValue] = useState(
    () => String(defaultValue ?? '').length > 0
  );
  const hasValue = isControlled ? String(value).length > 0 : hasUncontrolledValue;
  const hasClear = showClear && hasValue;
  const clearShape = clearShapeProp ?? resolveIconShape(shape);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (!isControlled) {
      setHasUncontrolledValue(event.target.value.length > 0);
    }

    onChange?.(event);
  }

  function handleClear(): void {
    if (!isControlled) {
      const element = inputRef.current;

      if (element) {
        element.value = '';
      }

      setHasUncontrolledValue(false);
    }

    onClear?.();
    inputRef.current?.focus();
  }

  return (
    <StyledInputRoot {...layoutProps}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <StyledInputRow
        borderTone={borderTone}
        data-has-clear={hasClear ? '' : undefined}
        shape={shape}
        showBorder={showBorder}
        showShadow={showShadow}
        sizePreset={sizePreset}
      >
        <StyledInputControl
          type="text"
          {...inputProps}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : undefined}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          id={id}
          ref={(node) => {
            inputRef.current = node;
            assignRef(ref, node);
          }}
          sizePreset={sizePreset}
          value={isControlled ? value : undefined}
          onChange={handleChange}
        />
        {hasClear && (
          <FieldClear
            ariaLabel={resolveClearAriaLabel(label)}
            disabled={disabled}
            shape={clearShape}
            sizePreset={sizePreset}
            onClick={handleClear}
          />
        )}
      </StyledInputRow>
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
