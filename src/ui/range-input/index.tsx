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
 *  - плейсхолдер поля from через проп `fromPlaceholder`
 *  - форму полей from и to через проп `inputShape`
 *  - размер полей from и to через проп `inputSizePreset`
 *  - подпись над триггером через проп `label`
 *  - обработчик изменения значения через проп `onChange`
 *  - обработчик сброса значения через проп `onClear`
 *  - плейсхолдер неактивного триггера через проп `placeholder`
 *  - пресеты диапазона через проп `presets`
 *  - резерв высоты под строку ошибки через проп `reserveErrorSpace`
 *  - заголовок панели через проп `title`
 *  - выравнивание заголовка панели через проп `titleAlign`
 *  - размер заголовка панели через проп `titleSizePreset`
 *  - плейсхолдер поля to через проп `toPlaceholder`
 *  - пользовательскую валидацию через проп `validate`
 *  - тексты встроенной валидации через проп `validationMessages`
 *  - контролируемое значение через проп `value`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RangeInput
 * 2. Типизировать пропсы через `RangeInputProps`
 * 3. Экспортировать типы `RangeValue`, `RangePreset`, `RangeInputValidationMessages`
 *    и `ResolvedRangeInputValidationMessages`
 * 4. Экспортировать дефолты `DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES`
 * 5. Реэкспортировать мост размера текста `getRangeInputTextSize`
 * 6. Выставлять `role` и `aria`-атрибуты панели и триггера
 *
 * Потребители:
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import {
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { ChevronDownIcon } from '@icons/chevron-down';
import { CloseIcon } from '@icons/close';
import { AnchoredPortal } from '@ui/anchored-portal';
import { Button } from '@ui/button';
import { DEFAULT_ICON_POSITION, Icon } from '@ui/icon';
import { Input } from '@ui/input';
import { type ShapePreset, type SizePreset } from '@ui/presets';
import { type SpacingValue } from '@ui/spacing';
import { Text, getTextLineHeight, type TextSizePreset } from '@ui/text';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

import {
  DEFAULT_RANGE_INPUT_SHAPE,
  DEFAULT_RANGE_INPUT_SIZE_PRESET,
  StyledRangeInputButtonRow,
  StyledRangeInputClearButton,
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

/* eslint-disable react-refresh/only-export-components -- публичные дефолты validationMessages и мост размера текста */

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
 * @property invalidFrom — текст ошибки нецелого значения from
 * @property invalidTo — текст ошибки нецелого значения to
 */
export type RangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]?: string;
};

/**
 * ResolvedRangeInputValidationMessages — представляет полные тексты встроенной валидации RangeInput.
 *
 * @property emptyBounds — текст ошибки, когда обе границы пустые при применении
 * @property invalidFrom — текст ошибки нецелого значения from
 * @property invalidTo — текст ошибки нецелого значения to
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
 * DEFAULT_RANGE_INPUT_RESERVE_ERROR_SPACE — задаёт резерв высоты под ошибку по умолчанию.
 * Используется, когда вызывающий код не передал проп `reserveErrorSpace`.
 */
const DEFAULT_RANGE_INPUT_RESERVE_ERROR_SPACE = true;

/**
 * DEFAULT_RANGE_INPUT_TITLE_ALIGN — задаёт выравнивание заголовка панели по умолчанию.
 * Используется, когда вызывающий код не передал проп `titleAlign`.
 */
const DEFAULT_RANGE_INPUT_TITLE_ALIGN: CSSProperties['textAlign'] = 'center';

/**
 * DEFAULT_CLEAR_ARIA_LABEL — задаёт `aria-label` кнопки сброса по умолчанию.
 * Подставляется, когда над триггером нет подписи.
 */
const DEFAULT_CLEAR_ARIA_LABEL = 'Clear';

/**
 * DEFAULT_RANGE_INPUT_ICON_FILL — задаёт тон глифа шеврона и сброса по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconFill`.
 */
const DEFAULT_RANGE_INPUT_ICON_FILL: TonePreset = DEFAULT_TONE;

/**
 * DEFAULT_RANGE_INPUT_ICON_TONE — задаёт тон секции шеврона и сброса по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconTone`.
 */
const DEFAULT_RANGE_INPUT_ICON_TONE: TonePreset = DEFAULT_TONE;

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
 * RangeInputInputProps — представляет пропсы полей from и to RangeInput.
 *
 * @property inputShape — форма полей from и to
 * @property inputSizePreset — размер полей from и to
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
 */
type RangeInputTitleProps = {
  titleAlign?: CSSProperties['textAlign'];
  titleSizePreset?: TextSizePreset;
};

/**
 * RangeInputProps — представляет пропсы компонента RangeInput.
 *
 * @property defaultValue — начальное значение в неконтролируемом режиме
 * @property disabled — включает недоступное состояние
 * @property formatActiveLabel — форматёр активного лейбла триггера по выбранному диапазону
 * @property fromPlaceholder — плейсхолдер поля from
 * @property label — подпись над триггером
 * @property onChange — обработчик изменения значения
 * @property onClear — обработчик сброса значения. Без обработчика кнопка сброса не показывается
 * @property placeholder — плейсхолдер неактивного триггера
 * @property presets — пресеты диапазона в панели
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 * @property title — заголовок панели
 * @property toPlaceholder — плейсхолдер поля to
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
 * clearButtonAriaLabel — возвращает `aria-label` кнопки сброса по подписи над триггером.
 * Убирает завершающее двоеточие и подставляет `DEFAULT_CLEAR_ARIA_LABEL` без подписи.
 *
 * @param label подпись над триггером
 * @returns текст для `aria-label`
 */
function clearButtonAriaLabel(label: string | undefined): string {
  const trimmed = label?.trim();

  if (!trimmed) {
    return DEFAULT_CLEAR_ARIA_LABEL;
  }

  return `Clear ${trimmed.replace(/:$/, '')}`;
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
  iconFill = DEFAULT_RANGE_INPUT_ICON_FILL,
  iconPosition = DEFAULT_ICON_POSITION,
  iconTone = DEFAULT_RANGE_INPUT_ICON_TONE,
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
  const resolvedShape = shape ?? DEFAULT_RANGE_INPUT_SHAPE;
  const resolvedSizePreset = sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;
  const buttonShape = buttonShapeProp ?? resolvedShape;
  const buttonSizePreset = buttonSizePresetProp ?? resolvedSizePreset;
  const inputShape = inputShapeProp ?? resolvedShape;
  const inputSizePreset = inputSizePresetProp ?? resolvedSizePreset;
  const { layoutProps } = splitLayoutProps(rest);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const triggerId = useId();
  const titleId = useId();
  const panelErrorId = useId();
  const fromInputId = useId();
  const [isOpen, setIsOpen] = useState(false);
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
  const surfaceProps = { iconFill, iconPosition, iconTone, shape, sizePreset };
  const isIconStart = iconPosition === 'start';

  function closePanel(): void {
    setIsOpen(false);
  }

  function openPanel(): void {
    setDraftFrom(committed.from);
    setDraftTo(committed.to);
    setPanelError(null);
    setIsOpen(true);
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
    closePanel();
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
    closePanel();
    setPanelError(null);
  }

  function togglePanel(): void {
    if (disabled) {
      return;
    }

    if (isOpen) {
      closePanel();
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

  return (
    <StyledRangeInputRoot
      data-disabled={disabled ? '' : undefined}
      data-open={isOpen}
      ref={rootRef}
      {...layoutProps}
    >
      {Boolean(label) && (
        <Text as="label" htmlFor={triggerId} sizePreset="medium" tone="muted">
          {label}
        </Text>
      )}
      <StyledRangeInputTriggerRow
        data-active={isActive}
        data-has-clear={showClear ? '' : undefined}
        data-open={isOpen}
        ref={triggerRowRef}
        {...surfaceProps}
      >
        {showClear && isIconStart && (
          <StyledRangeInputClearButton
            aria-label={clearButtonAriaLabel(label)}
            disabled={disabled}
            type="button"
            {...surfaceProps}
            onClick={handleClear}
          >
            <Icon sizePreset={sizePreset}>
              <CloseIcon />
            </Icon>
          </StyledRangeInputClearButton>
        )}

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
          {showChevron && isIconStart && (
            <Icon data-slot="icon" sizePreset={sizePreset}>
              <ChevronDownIcon />
            </Icon>
          )}
          <StyledRangeInputValue {...surfaceProps}>
            <Text
              showEllipsis
              sizePreset={textSizePreset}
              tone={isActive ? undefined : 'muted'}
            >
              {triggerLabel}
            </Text>
          </StyledRangeInputValue>
          {showChevron && !isIconStart && (
            <Icon data-slot="icon" sizePreset={sizePreset}>
              <ChevronDownIcon />
            </Icon>
          )}
        </StyledRangeInputTrigger>

        {showClear && !isIconStart && (
          <StyledRangeInputClearButton
            aria-label={clearButtonAriaLabel(label)}
            disabled={disabled}
            type="button"
            {...surfaceProps}
            onClick={handleClear}
          >
            <Icon sizePreset={sizePreset}>
              <CloseIcon />
            </Icon>
          </StyledRangeInputClearButton>
        )}
      </StyledRangeInputTriggerRow>

      {reserveErrorSpace && (
        <Text
          aria-hidden="true"
          as="p"
          minBlockSize={getTextLineHeight('thin')}
          sizePreset="thin"
        />
      )}

      <AnchoredPortal
        dismissZoneRefs={[rootRef, panelRef]}
        open={isOpen}
        openFocusDeps={[fromInputId]}
        panelRef={panelRef}
        positioning={{
          anchorRef: triggerRowRef,
          layoutDeps: [presets?.length],
          mode: 'trigger-row',
        }}
        returnFocusRef={triggerRef}
        onDismiss={closePanel}
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
                      <Text showEllipsis sizePreset={textSizePreset} zIndex="1">
                        {preset.label}
                      </Text>
                    </StyledRangeInputValue>
                  </StyledRangeInputPresetButton>
                </li>
              ))}
            </StyledRangeInputPresetList>
          )}

          <StyledRangeInputCustomSection>
            <Text align={titleAlign} as="h2" id={titleId} sizePreset={titleSizePreset}>
              {title}
            </Text>
            <StyledRangeInputFields aria-labelledby={titleId} role="group">
              <Input
                aria-describedby={hasPanelError ? panelErrorId : undefined}
                id={fromInputId}
                inputMode="numeric"
                invalid={hasPanelError}
                placeholder={fromPlaceholder}
                reserveErrorSpace={false}
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
                reserveErrorSpace={false}
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
            <Text
              align="center"
              aria-live="polite"
              as="p"
              id={panelErrorId}
              minBlockSize={getTextLineHeight('thin')}
              sizePreset="thin"
              tone="danger"
            >
              {hasPanelError ? panelError : null}
            </Text>
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

export { getRangeInputTextSize };
