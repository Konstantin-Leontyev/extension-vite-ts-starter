import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';
import { useTheme } from 'styled-components';

import { ChevronDownIcon } from '@icons/chevron-down';
import { ChevronUpIcon } from '@icons/chevron-up';
import { Text } from '@ui/text';

import {
  StyledStepperButton,
  StyledStepperInput,
  StyledStepperRoot,
  StyledStepperSpin,
  StyledStepperValue,
  splitLayoutProps,
  type StepperStyleProps,
} from './stepper.styles';

/** Пауза до старта автоповтора при удержании и шаг повтора (мс). */
const STEP_REPEAT_DELAY_MS = 400;
const STEP_REPEAT_INTERVAL_MS = 60;

/** EN-дефолты подписей стрелок (как у прочих примитивов). */
const INCREASE_LABEL = 'Increase';
const DECREASE_LABEL = 'Decrease';

/** spinbutton требует accessible name — aria-label или aria-labelledby. */
type StepperAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-labelledby': string; 'aria-label'?: never };

type StepperProps = StepperStyleProps &
  StepperAccessibleName & {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Подпись единицы внутри поля (например, K/M) — рисуется суффиксом у значения. */
    suffix?: string;
  } & Omit<
    ComponentPropsWithRef<'input'>,
    | keyof StepperStyleProps
    | 'className'
    | 'style'
    | 'type'
    | 'role'
    | 'value'
    | 'onChange'
    | 'onBlur'
    | 'onKeyDown'
    | 'min'
    | 'max'
    | 'step'
    | 'aria-label'
    | 'aria-labelledby'
  >;

export function Stepper({
  align,
  shape,
  sizePreset,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  disabled,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: StepperProps) {
  const theme = useTheme();
  const { layout, rest: control } = splitLayoutProps(rest);

  /* draft != null — пользователь печатает; иначе показываем актуальное value. */
  const [draft, setDraft] = useState<string | null>(null);

  /* Актуальное значение для автоповтора: замыкание интервала иначе держит устаревшее. */
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const clamp = useCallback(
    (next: number): number => {
      let result = next;

      if (min !== undefined) {
        result = Math.max(min, result);
      }

      if (max !== undefined) {
        result = Math.min(max, result);
      }

      return result;
    },
    [max, min]
  );

  const stepBy = useCallback(
    (direction: 1 | -1): void => {
      setDraft(null);
      onChange(clamp(valueRef.current + direction * step));
    },
    [clamp, onChange, step]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const next = event.target.value;
      setDraft(next);
      const parsed = Number(next);

      if (next.trim() !== '' && Number.isFinite(parsed)) {
        onChange(parsed);
      }
    },
    [onChange]
  );

  /* По уходу из поля фиксируем приведённое к диапазону значение и показываем value. */
  const handleBlur = useCallback((): void => {
    if (draft !== null) {
      const parsed = Number(draft);

      if (draft.trim() !== '' && Number.isFinite(parsed)) {
        onChange(clamp(parsed));
      }
    }

    setDraft(null);
  }, [clamp, draft, onChange]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        stepBy(1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        stepBy(-1);
      }
    },
    [stepBy]
  );

  /* Удержание стрелки: после паузы — автоповтор; repeated гасит click-«хвост» по отпусканию. */
  const holdRef = useRef<{ timer: number | null; repeated: boolean }>({
    timer: null,
    repeated: false,
  });

  const stopHold = useCallback((): void => {
    if (holdRef.current.timer !== null) {
      window.clearTimeout(holdRef.current.timer);
      holdRef.current.timer = null;
    }
  }, []);

  const startHold = useCallback(
    (direction: 1 | -1): void => {
      holdRef.current.repeated = false;

      const tick = (): void => {
        holdRef.current.repeated = true;
        stepBy(direction);
        holdRef.current.timer = window.setTimeout(tick, STEP_REPEAT_INTERVAL_MS);
      };

      holdRef.current.timer = window.setTimeout(tick, STEP_REPEAT_DELAY_MS);
    },
    [stepBy]
  );

  const handleStepClick = useCallback(
    (direction: 1 | -1): void => {
      if (holdRef.current.repeated) {
        holdRef.current.repeated = false;

        return;
      }

      stepBy(direction);
    },
    [stepBy]
  );

  useEffect(() => stopHold, [stopHold]);

  return (
    <StyledStepperRoot {...layout} align={align} shape={shape} sizePreset={sizePreset}>
      <StyledStepperValue>
        <StyledStepperInput
          inputMode="numeric"
          {...control}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={value}
          disabled={disabled}
          role="spinbutton"
          type="text"
          value={draft ?? String(value)}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {Boolean(suffix) && (
          <Text color={theme.colors.muted} sizePreset="thin">
            {suffix}
          </Text>
        )}
      </StyledStepperValue>

      <StyledStepperSpin>
        <StyledStepperButton
          aria-label={INCREASE_LABEL}
          disabled={disabled}
          type="button"
          onClick={() => handleStepClick(1)}
          onPointerDown={() => startHold(1)}
          onPointerLeave={stopHold}
          onPointerUp={stopHold}
        >
          <ChevronUpIcon />
        </StyledStepperButton>
        <StyledStepperButton
          aria-label={DECREASE_LABEL}
          disabled={disabled}
          type="button"
          onClick={() => handleStepClick(-1)}
          onPointerDown={() => startHold(-1)}
          onPointerLeave={stopHold}
          onPointerUp={stopHold}
        >
          <ChevronDownIcon />
        </StyledStepperButton>
      </StyledStepperSpin>
    </StyledStepperRoot>
  );
}

export type { StepperStyleProps } from './stepper.styles';
