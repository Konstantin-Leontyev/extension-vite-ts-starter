import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'styled-components';

import { useAnchoredDismiss } from '@hooks/use-anchored-dismiss';
import { useFocusTrap } from '@hooks/use-focus-trap';
import { ChevronIcon } from '@icons/chevron';
import { CloseIcon } from '@icons/close';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import {
  textSizePreset as resolveTextSizePreset,
  valuePaddingInline as resolveValuePaddingInline,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { type SpacingPx } from '@ui/spacing';
import { Text, type TextSizePreset } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import {
  DEFAULT_RANGE_INPUT_SHAPE,
  DEFAULT_RANGE_INPUT_SIZE_PRESET,
  StyledRangeInputButtonRow,
  StyledRangeInputChevron,
  StyledRangeInputChevronBox,
  StyledRangeInputClearButton,
  StyledRangeInputClearIcon,
  StyledRangeInputCustomSection,
  StyledRangeInputFields,
  StyledRangeInputPanel,
  StyledRangeInputPresetButton,
  StyledRangeInputPresetList,
  StyledRangeInputRoot,
  StyledRangeInputTrigger,
  StyledRangeInputTriggerRow,
  splitLayoutProps,
  type RangeInputStyleProps,
} from './range-input.styles';

// eslint-disable-next-line react-refresh/only-export-components -- публичные дефолты validationMessages
export const DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES = {
  emptyBounds: 'Enter at least one bound.',
  invalidFrom: 'From must be a whole number.',
  invalidTo: 'To must be a whole number.',
} as const;

export type RangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]?: string;
};

export type ResolvedRangeInputValidationMessages = {
  [K in keyof typeof DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES]: string;
};

export type RangeValue = {
  from: string;
  to: string;
};

export type RangePreset = {
  /** Стабильный ключ списка; иначе — from+to. */
  id?: string;
  label: ReactNode;
  value: RangeValue;
};

const EMPTY_RANGE_VALUE: RangeValue = { from: '', to: '' };

/** Проброс осей кнопки панели в Button; shape/sizePreset по умолчанию — как у триггера. */
export type RangeInputButtonProps = {
  buttonInlineSize?: string;
  buttonPaddingInline?: SpacingPx;
  buttonShape?: ShapePreset;
  buttonSizePreset?: SizePreset;
  buttonText: string;
  buttonTextColor?: TonePreset;
  buttonTone?: TonePreset;
};

/** Проброс осей полей From/To в Input; по умолчанию — shape/sizePreset триггера. */
export type RangeInputInputProps = {
  inputShape?: ShapePreset;
  inputSizePreset?: SizePreset;
};

/** Проброс типографики заголовка панели в Text. */
export type RangeInputTitleProps = {
  titleAlign?: CSSProperties['textAlign'];
  titleSizePreset?: TextSizePreset;
};

export type RangeInputProps = RangeInputStyleProps &
  RangeInputButtonProps &
  RangeInputInputProps &
  RangeInputTitleProps & {
    defaultValue?: RangeValue;
    disabled?: boolean;
    formatActiveLabel: (value: RangeValue) => ReactNode;
    fromPlaceholder: string;
    /** Встроенная подпись над триггером (как у Listbox). */
    label?: string;
    onChange: (value: RangeValue) => void;
    onClear?: () => void;
    placeholder: string;
    presets?: RangePreset[];
    /** Резерв высоты под строку ошибки — как у Input/Listbox, для общей сетки с полями формы. */
    reserveErrorSpace?: boolean;
    /** Заголовок панели (как title в ProfileMenuSheet). */
    title: string;
    toPlaceholder: string;
    validate?: (value: RangeValue) => string | null;
    validationMessages?: RangeInputValidationMessages;
    value?: RangeValue;
  };

function isEmptyRangeValue(value: RangeValue): boolean {
  return value.from.trim() === '' && value.to.trim() === '';
}

function normalizeRangeValue(value: RangeValue): RangeValue {
  return {
    from: value.from.trim(),
    to: value.to.trim(),
  };
}

/** aria-label кнопки сброса — из подписи над триггером, без двоеточия. */
function clearButtonAriaLabel(label: string | undefined): string {
  const trimmed = label?.trim();

  if (!trimmed) {
    return 'Clear';
  }

  return `Clear ${trimmed.replace(/:$/, '')}`;
}

/** Целые числа ≥ 0; inputMode numeric не блокирует буквы на десктопе. */
function validateNumericRangeValue(
  value: RangeValue,
  messages: ResolvedRangeInputValidationMessages
): string | null {
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

function presetListKey(preset: RangePreset): string {
  if (preset.id) {
    return preset.id;
  }

  return `${preset.value.from}\0${preset.value.to}`;
}

export function RangeInput({
  buttonInlineSize,
  buttonPaddingInline,
  buttonShape: buttonShapeProp,
  buttonSizePreset: buttonSizePresetProp,
  buttonText,
  buttonTextColor,
  buttonTone = 'primary',
  defaultValue = EMPTY_RANGE_VALUE,
  disabled = false,
  formatActiveLabel,
  fromPlaceholder,
  inputShape: inputShapeProp,
  inputSizePreset: inputSizePresetProp,
  label,
  onChange,
  onClear,
  placeholder,
  presets,
  reserveErrorSpace = true,
  shape,
  sizePreset,
  title,
  titleAlign = 'center',
  titleSizePreset = 'normal',
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
  const theme = useTheme();
  const { layout } = splitLayoutProps(rest);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const triggerId = useId();
  const titleId = useId();
  const panelErrorId = useId();
  const fromInputId = useId();
  const [open, setOpen] = useState(false);
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');
  const [panelError, setPanelError] = useState<string | null>(null);
  const [internalValue, setInternalValue] = useState<RangeValue>(() =>
    normalizeRangeValue(defaultValue)
  );

  const isControlled = value !== undefined;
  const committed = isControlled ? normalizeRangeValue(value) : internalValue;
  const isActive = !isEmptyRangeValue(committed);
  const showClear = isActive && onClear !== undefined && !disabled;
  const showChevron = !showClear;
  const triggerLabel = isActive ? formatActiveLabel(committed) : placeholder;
  const textSizePreset = resolveTextSizePreset(resolvedSizePreset);
  const valuePaddingInline = resolveValuePaddingInline(resolvedSizePreset);
  const hasPanelError = Boolean(panelError?.trim());

  const closePanel = useCallback((): void => {
    setOpen(false);
  }, []);

  const openPanel = useCallback((): void => {
    setDraftFrom(committed.from);
    setDraftTo(committed.to);
    setPanelError(null);
    setOpen(true);
  }, [committed.from, committed.to]);

  const isInsideRangeInput = useCallback((target: Node): boolean => {
    return (
      (rootRef.current?.contains(target) ?? false) ||
      (panelRef.current?.contains(target) ?? false)
    );
  }, []);

  useAnchoredDismiss({
    active: open,
    isInside: isInsideRangeInput,
    onDismiss: closePanel,
  });

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    returnFocusRef: triggerRef,
  });

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const triggerRowElement = triggerRowRef.current;
    const panelElement = panelRef.current;

    if (!triggerRowElement || !panelElement) {
      return;
    }

    function applyPanelPosition(): void {
      const rowElement = triggerRowRef.current;
      const panel = panelRef.current;

      if (!rowElement || !panel) {
        return;
      }

      const rect = rowElement.getBoundingClientRect();

      panel.style.insetBlockStart = `${rect.top}px`;
      panel.style.insetInlineStart = `${rect.left}px`;
      panel.style.inlineSize = `${rect.width}px`;
    }

    applyPanelPosition();
    const frameId = window.requestAnimationFrame(applyPanelPosition);

    window.addEventListener('resize', applyPanelPosition);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', applyPanelPosition);
    };
  }, [open, presets?.length]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(fromInputId)?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [fromInputId, open]);

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

    if (open) {
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

  const axisProps = useMemo(() => ({ shape, sizePreset }), [shape, sizePreset]);

  return (
    <StyledRangeInputRoot ref={rootRef} data-open={open} {...layout}>
      {Boolean(label) && (
        <Text
          as="label"
          color={theme.colors.muted}
          htmlFor={triggerId}
          sizePreset="medium"
        >
          {label}
        </Text>
      )}
      <StyledRangeInputTriggerRow
        ref={triggerRowRef}
        data-active={isActive}
        data-open={open}
        {...axisProps}
      >
        <StyledRangeInputTrigger
          ref={triggerRef}
          aria-controls={panelId}
          aria-expanded={open}
          aria-haspopup="dialog"
          disabled={disabled}
          id={triggerId}
          type="button"
          {...axisProps}
          onClick={togglePanel}
          onKeyDown={handleTriggerKeyDown}
        >
          <Text
            color={isActive ? undefined : theme.colors.muted}
            ellipsis
            minInlineSize="0"
            paddingInline={valuePaddingInline}
            sizePreset={textSizePreset}
          >
            {triggerLabel}
          </Text>
          {showChevron && (
            <StyledRangeInputChevronBox {...axisProps}>
              <StyledRangeInputChevron {...axisProps}>
                <ChevronIcon />
              </StyledRangeInputChevron>
            </StyledRangeInputChevronBox>
          )}
        </StyledRangeInputTrigger>

        {showClear && (
          <StyledRangeInputClearButton
            aria-label={clearButtonAriaLabel(label)}
            disabled={disabled}
            type="button"
            {...axisProps}
            onClick={handleClear}
          >
            <StyledRangeInputClearIcon {...axisProps}>
              <CloseIcon />
            </StyledRangeInputClearIcon>
          </StyledRangeInputClearButton>
        )}
      </StyledRangeInputTriggerRow>

      {reserveErrorSpace && (
        <Text aria-hidden="true" as="p" minBlockSize="1.25rem" sizePreset="thin" />
      )}

      {open &&
        createPortal(
          <StyledRangeInputPanel
            ref={panelRef}
            aria-labelledby={titleId}
            aria-modal={true}
            id={panelId}
            role="dialog"
            {...axisProps}
          >
            {Boolean(presets?.length) && (
              <StyledRangeInputPresetList>
                {presets?.map((preset) => (
                  <li key={presetListKey(preset)}>
                    <StyledRangeInputPresetButton
                      disabled={disabled}
                      type="button"
                      {...axisProps}
                      onClick={() => {
                        applyPreset(preset);
                      }}
                    >
                      <Text
                        ellipsis
                        minInlineSize="0"
                        paddingInline={valuePaddingInline}
                        sizePreset={textSizePreset}
                        zIndex="1"
                      >
                        {preset.label}
                      </Text>
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
                color={theme.colors.danger}
                id={panelErrorId}
                minBlockSize="1.25rem"
                sizePreset="thin"
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
                  textColor={buttonTextColor}
                  tone={buttonTone}
                  type="button"
                  onClick={applyDraft}
                >
                  {buttonText}
                </Button>
              </StyledRangeInputButtonRow>
            </StyledRangeInputCustomSection>
          </StyledRangeInputPanel>,
          document.body
        )}
    </StyledRangeInputRoot>
  );
}
