/**
 * Файл: `src/ui/range-input/index.tsx`
 * Предоставляет компонент RangeInput для выбора числового диапазона.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму через проп `shape`
 *  - тон глифа шеврона и кнопки сброса через проп `iconFill`
 *  - позицию шеврона и кнопки сброса через проп `iconPosition`
 *  - тон секции шеврона и кнопки сброса через проп `iconTone`
 *  - ширину кнопки применения через проп `buttonInlineSize`
 *  - горизонтальные отступы кнопки применения через проп `buttonPaddingInline`
 *  - форму кнопки применения через проп `buttonShape`
 *  - размер кнопки применения через проп `buttonSizePreset`
 *  - текст кнопки применения через проп `buttonText`
 *  - тон лейбла кнопки применения через проп `buttonTextTone`
 *  - семантический тон кнопки применения через проп `buttonTone`
 *  - начальное значение через проп `defaultValue`
 *  - недоступное состояние через проп `disabled`
 *  - формат активного лейбла триггера через проп `formatActiveLabel`
 *  - плейсхолдер поля `from` через проп `fromPlaceholder`
 *  - форму полей `from` и `to` через проп `inputShape`
 *  - размер полей `from` и `to` через проп `inputSizePreset`
 *  - подпись над триггером через проп `label`
 *  - обработчик изменения значения через проп `onChange`
 *  - обработчик сброса значения через проп `onClear`
 *  - плейсхолдер неактивного триггера через проп `placeholder`
 *  - пресеты диапазона через проп `presets`
 *  - резерв высоты под строку ошибки через проп `reserveErrorSpace`
 *  - заголовок панели через проп `title`
 *  - выравнивание заголовка панели через проп `titleAlign`
 *  - размер заголовка панели через проп `titleSizePreset`
 *  - тон заголовка панели через проп `titleTone`
 *  - плейсхолдер поля `to` через проп `toPlaceholder`
 *  - обработчик пользовательской валидации через проп `validate`
 *  - тексты встроенной валидации через проп `validationMessages`
 *  - контролируемое значение через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RangeInput
 * 2. Типизировать пропсы через `RangeInputProps`
 * 3. Экспортировать типы `RangeValue`, `RangePreset`, `RangeInputValidationMessages`
 *    и `ResolvedRangeInputValidationMessages`
 * 4. Экспортировать дефолты `DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES`
 * 5. Выставлять `role` и `aria`-атрибуты панели и триггера
 *
 * Потребители:
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { useAnchoredOpen } from '@hooks/use-anchored-open';
import { matchTriggerRect } from '@hooks/use-anchored-portal-position';
import { ChevronDownIcon, CloseIcon } from '@icons';
import { resolveClearAriaLabel } from '@ui/a11y';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Button } from '@ui/button';
import { FieldError } from '@ui/field-error';
import { FieldLabel } from '@ui/field-label';
import { DEFAULT_ICON_POSITION, Icon, type IconPosition } from '@ui/icon';
import { Input } from '@ui/input';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type SpacingValue } from '@ui/spacing';
import {
  Text,
  type TextAlignPreset,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  StyledRangeInputButtonRow,
  StyledRangeInputCustomSection,
  StyledRangeInputFields,
  StyledRangeInputPanel,
  StyledRangeInputPresetButton,
  StyledRangeInputPresetList,
  StyledRangeInputRoot,
  StyledRangeInputTrigger,
  StyledRangeInputTriggerRow,
  StyledRangeInputValue,
  getRangeInputTextSize,
  splitLayoutProps,
  type RangeInputStyleProps,
} from './range-input.styles';

/* eslint-disable react-refresh/only-export-components -- публичные дефолты validationMessages */

/**
 * DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES — задаёт тексты встроенной валидации по умолчанию.
 * Используется, когда вызывающий код не передал проп `validationMessages`.
 */
export const DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES = {
  emptyBounds: 'Enter at least one bound.',
  invalidFrom: 'From must be a whole number.',
  invalidTo: 'To must be a whole number.',
} as const;

/**
 * RangeInputValidationMessages — представляет частичные тексты встроенной валидации RangeInput.
 *
 * @property emptyBounds — текст ошибки, когда обе границы пустые при применении
 * @property invalidFrom — текст ошибки нецелого значения `from`
 * @property invalidTo — текст ошибки нецелого значения `to`
 */
export type RangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]?: string;
};

/**
 * ResolvedRangeInputValidationMessages — представляет полные тексты встроенной валидации RangeInput.
 *
 * @property emptyBounds — текст ошибки, когда обе границы пустые при применении
 * @property invalidFrom — текст ошибки нецелого значения `from`
 * @property invalidTo — текст ошибки нецелого значения `to`
 */
export type ResolvedRangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]: string;
};

/**
 * RangeValue — представляет границы числового диапазона.
 *
 * @property from — нижняя граница диапазона
 * @property to — верхняя граница диапазона
 */
export type RangeValue = {
  from: string;
  to: string;
};

/**
 * RangePreset — представляет пресет диапазона в панели RangeInput.
 *
 * @property id — стабильный ключ элемента списка. Без значения ключ собирается из `from` и `to`
 * @property label — лейбл пресета в списке
 * @property value — границы диапазона пресета
 */
export type RangePreset = {
  id?: string;
  label: ReactNode;
  value: RangeValue;
};

/**
 * EMPTY_RANGE_VALUE — задаёт пустое значение диапазона.
 * Используется как начальное значение и результат сброса.
 */
const EMPTY_RANGE_VALUE: RangeValue = { from: '', to: '' };

/**
 * DEFAULT_RANGE_INPUT_BUTTON_TONE — задаёт тон кнопки применения по умолчанию.
 * Используется, когда вызывающий код не передал проп `buttonTone`.
 */
const DEFAULT_RANGE_INPUT_BUTTON_TONE: TonePreset = 'primary';

/**
 * DEFAULT_RANGE_INPUT_DISABLED — задаёт недоступное состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `disabled`.
 */
const DEFAULT_RANGE_INPUT_DISABLED = false;

/**
 * DEFAULT_RANGE_INPUT_RESERVE_ERROR_SPACE — задаёт резерв высоты под строку ошибки по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveErrorSpace`.
 */
const DEFAULT_RANGE_INPUT_RESERVE_ERROR_SPACE = false;

/**
 * DEFAULT_RANGE_INPUT_TITLE_ALIGN — задаёт выравнивание заголовка панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleAlign`.
 */
const DEFAULT_RANGE_INPUT_TITLE_ALIGN: TextAlignPreset = 'center';

/**
 * RangeInputButtonProps — представляет пропсы кнопки применения RangeInput.
 *
 * @property buttonInlineSize — ширина кнопки применения
 * @property buttonPaddingInline — горизонтальные отступы кнопки применения
 * @property buttonShape — форма кнопки применения
 * @property buttonSizePreset — размер кнопки применения
 * @property buttonText — текст кнопки применения
 * @property buttonTextTone — тон лейбла кнопки применения
 * @property buttonTone — семантический тон кнопки применения
 */
type RangeInputButtonProps = {
  buttonInlineSize?: string;
  buttonPaddingInline?: SpacingValue;
  buttonShape?: ShapePreset;
  buttonSizePreset?: SizePreset;
  buttonText: string;
  buttonTextTone?: TonePreset;
  buttonTone?: TonePreset;
};

/**
 * RangeInputInputProps — представляет пропсы полей `from` и `to` RangeInput.
 *
 * @property inputShape — форма полей `from` и `to`
 * @property inputSizePreset — размер полей `from` и `to`
 */
type RangeInputInputProps = {
  inputShape?: ShapePreset;
  inputSizePreset?: SizePreset;
};

/**
 * RangeInputTitleProps — представляет пропсы заголовка панели RangeInput.
 *
 * @property titleAlign — выравнивание заголовка панели
 * @property titleSizePreset — размер заголовка панели
 * @property titleTone — тон заголовка панели
 */
type RangeInputTitleProps = {
  titleAlign?: TextAlignPreset;
  titleSizePreset?: TextSizePreset;
  titleTone?: TextTone;
};

/**
 * RangeInputProps — представляет пропсы компонента RangeInput.
 *
 * @property defaultValue — начальное значение в неконтролируемом режиме
 * @property disabled — включает недоступное состояние
 * @property formatActiveLabel — форматёр активного лейбла триггера по выбранному диапазону
 * @property fromPlaceholder — плейсхолдер поля `from`
 * @property iconFill — тон глифа шеврона и кнопки сброса при нейтральном `iconTone`
 * @property iconPosition — позиция шеврона и кнопки сброса относительно значения
 * @property label — подпись над триггером
 * @property onChange — обработчик изменения значения
 * @property onClear — обработчик сброса значения. Без обработчика кнопка сброса не показывается
 * @property placeholder — плейсхолдер неактивного триггера
 * @property presets — пресеты диапазона в панели
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property title — заголовок панели
 * @property toPlaceholder — плейсхолдер поля `to`
 * @property validate — обработчик пользовательской валидации диапазона
 * @property validationMessages — тексты встроенной валидации
 * @property value — контролируемое значение диапазона
 */
type RangeInputProps = RangeInputStyleProps &
  RangeInputButtonProps &
  RangeInputInputProps &
  RangeInputTitleProps & {
    defaultValue?: RangeValue;
    disabled?: boolean;
    formatActiveLabel: (value: RangeValue) => ReactNode;
    fromPlaceholder: string;
    iconFill?: TonePreset;
    iconPosition?: IconPosition;
    label?: string;
    onChange: (value: RangeValue) => void;
    onClear?: () => void;
    placeholder: string;
    presets?: RangePreset[];
    reserveErrorSpace?: boolean;
    title: string;
    toPlaceholder: string;
    validate?: (value: RangeValue) => null | string;
    validationMessages?: RangeInputValidationMessages;
    value?: RangeValue;
  };

/**
 * isEmptyRangeValue — возвращает признак пустого диапазона.
 *
 * @param value границы диапазона
 * @returns `true`, когда обе границы пустые после trim
 */
function isEmptyRangeValue(value: RangeValue): boolean {
  return value.from.trim() === '' && value.to.trim() === '';
}

/**
 * normalizeRangeValue — возвращает границы диапазона без краевых пробелов.
 *
 * @param value границы диапазона
 * @returns нормализованные границы
 */
function normalizeRangeValue(value: RangeValue): RangeValue {
  return {
    from: value.from.trim(),
    to: value.to.trim(),
  };
}

/**
 * validateNumericRangeValue — возвращает текст ошибки встроенной числовой валидации.
 * Проверяет целые числа не меньше нуля. Значение `inputMode` `numeric` не блокирует
 * буквы на десктопе.
 *
 * @param value границы диапазона
 * @param messages тексты встроенной валидации
 * @returns текст ошибки или `null`
 */
function validateNumericRangeValue(
  value: RangeValue,
  messages: ResolvedRangeInputValidationMessages
): null | string {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from !== '' && !/^\d+$/.test(from.replace(/,/g, ''))) {
    return messages.invalidFrom;
  }

  if (to !== '' && !/^\d+$/.test(to.replace(/,/g, ''))) {
    return messages.invalidTo;
  }

  return null;
}

/**
 * presetListKey — возвращает ключ элемента списка пресетов.
 *
 * @param preset пресет диапазона
 * @returns стабильный `id` или составной ключ из границ
 */
function presetListKey(preset: RangePreset): string {
  if (preset.id) {
    return preset.id;
  }

  return `${preset.value.from}\0${preset.value.to}`;
}

/**
 * RangeInput — отображает выбор числового диапазона с пресетами и ручным вводом границ.
 *
 * @example
 * <RangeInput
 *   buttonText="Apply"
 *   formatActiveLabel={(value) => `${value.from} – ${value.to}`}
 *   fromPlaceholder="From"
 *   placeholder="Select range"
 *   title="Custom range"
 *   toPlaceholder="To"
 *   value={range}
 *   onChange={setRange}
 *   onClear={() => setRange({ from: '', to: '' })}
 * />
 */
export function RangeInput({
  buttonInlineSize,
  buttonPaddingInline,
  buttonShape: buttonShapeProp,
  buttonSizePreset: buttonSizePresetProp,
  buttonText,
  buttonTextTone,
  buttonTone = DEFAULT_RANGE_INPUT_BUTTON_TONE,
  defaultValue = EMPTY_RANGE_VALUE,
  disabled = DEFAULT_RANGE_INPUT_DISABLED,
  formatActiveLabel,
  fromPlaceholder,
  iconFill,
  iconPosition = DEFAULT_ICON_POSITION,
  iconTone,
  inputShape: inputShapeProp,
  inputSizePreset: inputSizePresetProp,
  label,
  onChange,
  onClear,
  placeholder,
  presets,
  reserveErrorSpace = DEFAULT_RANGE_INPUT_RESERVE_ERROR_SPACE,
  shape,
  sizePreset,
  title,
  titleAlign = DEFAULT_RANGE_INPUT_TITLE_ALIGN,
  titleSizePreset,
  titleTone,
  toPlaceholder,
  validate,
  validationMessages: validationMessagesProp,
  value,
  ...rest
}: RangeInputProps) {
  const validationMessages = useMemo(
    () => ({
      ...DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES,
      ...validationMessagesProp,
    }),
    [validationMessagesProp]
  );
  const resolvedShape = shape ?? DEFAULT_SHAPE_PRESET;
  const resolvedSizePreset = sizePreset ?? DEFAULT_SIZE_PRESET;
  const buttonShape = buttonShapeProp ?? resolvedShape;
  const buttonSizePreset = buttonSizePresetProp ?? resolvedSizePreset;
  const inputShape = inputShapeProp ?? resolvedShape;
  const inputSizePreset = inputSizePresetProp ?? resolvedSizePreset;
  const { layoutProps } = splitLayoutProps(rest);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const triggerId = useId();
  const titleId = useId();
  const panelErrorId = useId();
  const fromInputId = useId();
  const { handleClose, handleOpen, isOpen, panelRef } =
    useAnchoredOpen<HTMLDivElement>();
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [panelError, setPanelError] = useState<null | string>(null);
  const [internalValue, setInternalValue] = useState<RangeValue>(() =>
    normalizeRangeValue(defaultValue)
  );

  const isControlled = value !== undefined;
  const committed = isControlled ? normalizeRangeValue(value) : internalValue;
  const isActive = !isEmptyRangeValue(committed);
  const showClear = isActive && onClear !== undefined && !disabled;
  const showChevron = !showClear;
  const triggerLabel = isActive ? formatActiveLabel(committed) : placeholder;
  const textSizePreset = getRangeInputTextSize(sizePreset);
  const hasPanelError = Boolean(panelError?.trim());
  const surfaceProps = { iconTone, shape, sizePreset };
  const isIconStart = iconPosition === 'start';
  const iconNode = showChevron && (
    <Icon
      data-slot="icon"
      iconFill={iconFill}
      iconTone={iconTone}
      interactive
      showBorder
      showShadow={false}
      sizePreset={sizePreset}
    >
      <ChevronDownIcon />
    </Icon>
  );

  function openPanel(): void {
    setDraftFrom(committed.from);
    setDraftTo(committed.to);
    setPanelError(null);
    handleOpen();
  }

  function focusRangeInputFromField(): void {
    document.getElementById(fromInputId)?.focus();
  }

  function commitValue(next: RangeValue): void {
    const normalized = normalizeRangeValue(next);

    if (!isControlled) {
      setInternalValue(normalized);
    }

    onChange(normalized);
    handleClose();
    setPanelError(null);
  }

  function applyDraft(): void {
    const draft = normalizeRangeValue({ from: draftFrom, to: draftTo });

    if (isEmptyRangeValue(draft)) {
      setPanelError(validationMessages.emptyBounds);

      return;
    }

    const validationMessage =
      validateNumericRangeValue(draft, validationMessages) ?? validate?.(draft) ?? null;

    if (validationMessage?.trim()) {
      setPanelError(validationMessage.trim());

      return;
    }

    commitValue(draft);
  }

  function applyPreset(preset: RangePreset): void {
    if (disabled) {
      return;
    }

    const normalized = normalizeRangeValue(preset.value);
    const validationMessage =
      validateNumericRangeValue(normalized, validationMessages) ??
      validate?.(normalized) ??
      null;

    if (validationMessage?.trim()) {
      setPanelError(validationMessage.trim());

      return;
    }

    commitValue(normalized);
  }

  function handleClear(event: { stopPropagation: () => void }): void {
    event.stopPropagation();

    if (disabled) {
      return;
    }

    if (!isControlled) {
      setInternalValue(EMPTY_RANGE_VALUE);
    }

    onClear?.();
    handleClose();
    setPanelError(null);
  }

  function togglePanel(): void {
    if (disabled) {
      return;
    }

    if (isOpen) {
      handleClose();
      return;
    }

    openPanel();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePanel();
    }
  }

  function handleFieldKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyDraft();
    }
  }

  const clearNode = showClear && (
    <Icon
      aria-label={resolveClearAriaLabel(label)}
      as="button"
      data-slot="clear"
      disabled={disabled}
      iconFill={iconFill}
      iconTone={iconTone}
      showBorder
      showShadow={false}
      sizePreset={sizePreset}
      onClick={handleClear}
    >
      <CloseIcon />
    </Icon>
  );

  return (
    <StyledRangeInputRoot
      data-disabled={disabled ? '' : undefined}
      data-open={isOpen}
      ref={rootRef}
      {...layoutProps}
    >
      <FieldLabel htmlFor={triggerId}>{label}</FieldLabel>
      <StyledRangeInputTriggerRow
        data-active={isActive}
        data-has-clear={showClear ? '' : undefined}
        data-open={isOpen}
        ref={triggerRowRef}
        {...surfaceProps}
      >
        {isIconStart && clearNode}

        <StyledRangeInputTrigger
          aria-controls={panelId}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          disabled={disabled}
          id={triggerId}
          ref={triggerRef}
          type="button"
          {...surfaceProps}
          onClick={togglePanel}
          onKeyDown={handleTriggerKeyDown}
        >
          {iconPosition === 'start' && iconNode}
          <StyledRangeInputValue {...surfaceProps}>
            <Text
              ellipsis
              sizePreset={textSizePreset}
              tone={isActive ? undefined : 'muted'}
            >
              {triggerLabel}
            </Text>
          </StyledRangeInputValue>
          {iconPosition === 'end' && iconNode}
        </StyledRangeInputTrigger>

        {!isIconStart && clearNode}
      </StyledRangeInputTriggerRow>

      <AnchoredPortal
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        openFocusDeps={[fromInputId]}
        panelRef={panelRef}
        positionStrategy={{
          anchorRef: triggerRowRef,
          apply: matchTriggerRect,
          layoutDeps: [presets?.length],
        }}
        returnFocusRef={triggerRef}
        onDismiss={handleClose}
        onOpenFocus={focusRangeInputFromField}
      >
        <StyledRangeInputPanel
          aria-labelledby={titleId}
          aria-modal={true}
          id={panelId}
          ref={panelRef}
          role="dialog"
          {...surfaceProps}
        >
          {Boolean(presets?.length) && (
            <StyledRangeInputPresetList>
              {presets?.map((preset) => (
                <li key={presetListKey(preset)}>
                  <StyledRangeInputPresetButton
                    disabled={disabled}
                    type="button"
                    {...surfaceProps}
                    onClick={() => {
                      applyPreset(preset);
                    }}
                  >
                    <StyledRangeInputValue {...surfaceProps}>
                      <Text ellipsis sizePreset={textSizePreset} zIndex="1">
                        {preset.label}
                      </Text>
                    </StyledRangeInputValue>
                  </StyledRangeInputPresetButton>
                </li>
              ))}
            </StyledRangeInputPresetList>
          )}

          <StyledRangeInputCustomSection>
            <Text
              align={titleAlign}
              as="h2"
              id={titleId}
              sizePreset={titleSizePreset}
              tone={titleTone}
            >
              {title}
            </Text>
            <StyledRangeInputFields aria-labelledby={titleId} role="group">
              <Input
                aria-describedby={hasPanelError ? panelErrorId : undefined}
                id={fromInputId}
                inputMode="numeric"
                invalid={hasPanelError}
                placeholder={fromPlaceholder}
                shape={inputShape}
                sizePreset={inputSizePreset}
                value={draftFrom}
                onChange={(event) => {
                  setDraftFrom(event.currentTarget.value);
                  setPanelError(null);
                }}
                onKeyDown={handleFieldKeyDown}
              />
              <Input
                aria-describedby={hasPanelError ? panelErrorId : undefined}
                inputMode="numeric"
                invalid={hasPanelError}
                placeholder={toPlaceholder}
                shape={inputShape}
                sizePreset={inputSizePreset}
                value={draftTo}
                onChange={(event) => {
                  setDraftTo(event.currentTarget.value);
                  setPanelError(null);
                }}
                onKeyDown={handleFieldKeyDown}
              />
            </StyledRangeInputFields>
            <FieldError id={panelErrorId} reserveErrorSpace={reserveErrorSpace}>
              {panelError}
            </FieldError>
            <StyledRangeInputButtonRow>
              <Button
                disabled={disabled}
                inlineSize={buttonInlineSize}
                paddingInline={buttonPaddingInline}
                shape={buttonShape}
                sizePreset={buttonSizePreset}
                textTone={buttonTextTone}
                tone={buttonTone}
                onClick={applyDraft}
              >
                {buttonText}
              </Button>
            </StyledRangeInputButtonRow>
          </StyledRangeInputCustomSection>
        </StyledRangeInputPanel>
      </AnchoredPortal>
    </StyledRangeInputRoot>
  );
}
