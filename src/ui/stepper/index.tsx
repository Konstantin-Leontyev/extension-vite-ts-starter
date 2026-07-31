/**
 * Файл: `src/ui/stepper/index.tsx`
 * Предоставляет компонент Stepper для отображения числового счётчика с полем ввода и стрелками.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - форму поля через проп `shape`
 *  - числовое значение через проп `value`
 *  - обработчик изменения значения через проп `onChange`
 *  - обработчик фиксации значения через проп `onCommit`
 *  - нижнюю границу через проп `min`
 *  - верхнюю границу через проп `max`
 *  - шаг изменения через проп `step`
 *  - подпись единицы внутри поля через проп `suffix`
 *  - тон значения и суффикса через проп `textTone`
 *  - размер значения и суффикса через проп `textSize`
 *  - курсив значения и суффикса через проп `textItalic`
 *  - горизонтальное выравнивание пары «значение + суффикс» через проп `textAlign`
 *  - подпись над полем через проп `label`
 *  - текстовую метку через проп `aria-label`
 *  - id метки через проп `aria-labelledby`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Stepper
 * 2. Типизировать пропсы через `StepperProps`
 * 3. Выставлять `role="spinbutton"` и атрибуты `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
 * 4. Реэкспортировать мост размера текста `getStepperTextSize`
 *
 * Потребители:
 *  - `src/pages/showcase/stepper-settings/index.tsx` — выбирает шаг в панели настроек
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type KeyboardEvent,
} from 'react';

import { ChevronDownIcon, ChevronUpIcon } from '@icons';
import { FieldLabel } from '@ui/field-label';
import { Icon } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';
import { Text, type TextTone } from '@ui/text';

import {
  StyledStepperButton,
  StyledStepperFieldRoot,
  StyledStepperInput,
  StyledStepperRoot,
  StyledStepperSpin,
  StyledStepperValue,
  getStepperTextSize,
  splitLayoutProps,
  type StepperStyleProps,
} from './stepper.styles';

/**
 * DEFAULT_STEPPER_STEP — задаёт шаг изменения по умолчанию.
 * Используется, когда вызывающий код не передал проп `step`.
 */
const DEFAULT_STEPPER_STEP = 1;

/**
 * DEFAULT_STEPPER_SUFFIX_TONE — задаёт тон суффикса по умолчанию.
 * Суффикс единицы — вторичный текст, поэтому `muted`.
 */
const DEFAULT_STEPPER_SUFFIX_TONE: TextTone = 'muted';

/**
 * DECREASE_LABEL — задаёт текст `aria-label` кнопки уменьшения.
 * Используется для доступного имени стрелки вниз.
 */
const DECREASE_LABEL = 'Decrease';

/**
 * INCREASE_LABEL — задаёт текст `aria-label` кнопки увеличения.
 * Используется для доступного имени стрелки вверх.
 */
const INCREASE_LABEL = 'Increase';

/**
 * STEPPER_CHEVRON_ICON_PADDING — задаёт отступ окна Icon шеврона внутри половинки
 * стрелки. Вместе с высотой половинки даёт окна `12`/`16`/`20` px при `small`/`normal`/`large`.
 */
const STEPPER_CHEVRON_ICON_PADDING: SpacingValue = 2;

/**
 * STEP_REPEAT_DELAY_MS — задаёт паузу до старта автоповтора при удержании стрелки.
 * Используется в таймере начала автоповтора.
 */
const STEP_REPEAT_DELAY_MS = 400;

/**
 * STEP_REPEAT_INTERVAL_MS — задаёт интервал шагов автоповтора при удержании стрелки.
 * Используется в повторяющемся таймере.
 */
const STEP_REPEAT_INTERVAL_MS = 60;

/**
 * StepperAccessibleName — представляет обязательное доступное имя spinbutton.
 * Требует один из пропов: `label`, `aria-label` или `aria-labelledby`.
 *
 * @property aria-label — текстовая метка поля
 * @property aria-labelledby — id элемента с меткой поля
 * @property label — подпись над полем; при передаче выставляет `aria-labelledby` на корень
 */
type StepperAccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: never; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string; label?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; label: string };

/**
 * StepperProps — представляет пропсы компонента Stepper.
 *
 * @property max — верхняя граница значения
 * @property min — нижняя граница значения
 * @property onChange — обработчик изменения значения
 * @property onCommit — обработчик фиксации значения после `blur` поля и отпускания стрелки, в том числе после автоповтора
 * @property step — шаг изменения значения
 * @property suffix — подпись единицы внутри поля, например `K` или `M`
 * @property value — числовое значение счётчика
 */
type StepperProps = StepperStyleProps &
  StepperAccessibleName & {
    max?: number;
    min?: number;
    onChange: (value: number) => void;
    onCommit?: (value: number) => void;
    step?: number;
    suffix?: string;
    value: number;
  } & Omit<
    ComponentPropsWithRef<'input'>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'className'
    | 'max'
    | 'min'
    | 'onBlur'
    | 'onChange'
    | 'onKeyDown'
    | 'role'
    | 'step'
    | 'style'
    | 'type'
    | 'value'
    | keyof StepperStyleProps
  >;

/**
 * Stepper — отображает числовой счётчик с полем ввода и стрелками.
 *
 * @example
 * <Stepper label="Quantity:" value={1} onChange={setValue} />
 * <Stepper aria-label="Quantity" value={1} onChange={setValue} />
 * <Stepper aria-labelledby="qty-label" min={0} max={10} step={1} value={5} onChange={setValue} />
 * <Stepper sizePreset="normal" suffix="K" textAlign="start" value={100} onChange={setValue} />
 */
export function Stepper({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  disabled,
  label,
  max,
  min,
  onChange,
  onCommit,
  shape,
  sizePreset,
  step = DEFAULT_STEPPER_STEP,
  suffix,
  textAlign,
  textItalic,
  textSize,
  textTone,
  value,
  ...rest
}: StepperProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const labelId = useId();
  const resolvedLabelledBy = label ? labelId : ariaLabelledBy;

  // Размер пары «значение + суффикс» вычисляется один раз: поле и Text получают готовое значение
  const resolvedTextSize = textSize ?? getStepperTextSize(sizePreset);

  // Если draft не null, пользователь печатает, иначе показывается актуальное value
  const [draft, setDraft] = useState<null | string>(null);

  // Хранит актуальное значение для автоповтора, иначе замыкание интервала держит устаревшее
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

  const commit = useCallback((): void => {
    onCommit?.(clamp(valueRef.current));
  }, [clamp, onCommit]);

  const stepBy = useCallback(
    (direction: -1 | 1): void => {
      setDraft(null);
      const next = clamp(valueRef.current + direction * step);
      valueRef.current = next;
      onChange(next);
    },
    [clamp, onChange, step]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const next = event.target.value;
    setDraft(next);
    const parsed = Number(next);

    if (next.trim() !== '' && Number.isFinite(parsed)) {
      onChange(parsed);
    }
  };

  // По уходу из поля фиксирует приведённое к диапазону значение и показывает value
  const handleBlur = (): void => {
    if (draft !== null) {
      const parsed = Number(draft);

      if (draft.trim() !== '' && Number.isFinite(parsed)) {
        onChange(clamp(parsed));
      }
    }

    setDraft(null);
    commit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      stepBy(-1);
    }
  };

  // Удержание стрелки запускает автоповтор после паузы, repeated гасит лишний click по отпусканию
  const holdRef = useRef<{ repeated: boolean; timer: null | number }>({
    timer: null,
    repeated: false,
  });
  const spinActiveRef = useRef(false);

  const stopHold = useCallback((): void => {
    if (holdRef.current.timer !== null) {
      window.clearTimeout(holdRef.current.timer);
      holdRef.current.timer = null;
    }

    if (spinActiveRef.current) {
      spinActiveRef.current = false;
      if (holdRef.current.repeated) {
        commit();
      }
    }
  }, [commit]);

  const startHold = useCallback(
    (direction: -1 | 1): void => {
      spinActiveRef.current = true;
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
    (direction: -1 | 1): void => {
      if (holdRef.current.repeated) {
        holdRef.current.repeated = false;

        return;
      }

      stepBy(direction);
      commit();
    },
    [commit, stepBy]
  );

  const handleIncreaseClick = (): void => {
    handleStepClick(1);
  };

  const handleDecreaseClick = (): void => {
    handleStepClick(-1);
  };

  const handleIncreasePointerDown = (): void => {
    startHold(1);
  };

  const handleDecreasePointerDown = (): void => {
    startHold(-1);
  };

  useEffect(() => stopHold, [stopHold]);

  return (
    <StyledStepperFieldRoot
      aria-labelledby={label ? labelId : undefined}
      {...layoutProps}
    >
      <FieldLabel id={labelId}>{label}</FieldLabel>
      <StyledStepperRoot
        data-disabled={disabled ? '' : undefined}
        shape={shape}
        sizePreset={sizePreset}
      >
        <StyledStepperValue sizePreset={sizePreset} textAlign={textAlign}>
          <StyledStepperInput
            inputMode="numeric"
            textItalic={textItalic}
            textSize={resolvedTextSize}
            textTone={textTone}
            {...restProps}
            aria-label={ariaLabel}
            aria-labelledby={resolvedLabelledBy}
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
            <Text
              italic={textItalic}
              sizePreset={resolvedTextSize}
              tone={textTone ?? DEFAULT_STEPPER_SUFFIX_TONE}
            >
              {suffix}
            </Text>
          )}
        </StyledStepperValue>

        <StyledStepperSpin sizePreset={sizePreset}>
          <StyledStepperButton
            aria-label={INCREASE_LABEL}
            disabled={disabled}
            sizePreset={sizePreset}
            type="button"
            onClick={handleIncreaseClick}
            onPointerDown={handleIncreasePointerDown}
            onPointerLeave={stopHold}
            onPointerUp={stopHold}
          >
            <Icon
              blockSize="100%"
              inlineSize="100%"
              padding={STEPPER_CHEVRON_ICON_PADDING}
              showHover={false}
            >
              <ChevronUpIcon />
            </Icon>
          </StyledStepperButton>
          <StyledStepperButton
            aria-label={DECREASE_LABEL}
            disabled={disabled}
            sizePreset={sizePreset}
            type="button"
            onClick={handleDecreaseClick}
            onPointerDown={handleDecreasePointerDown}
            onPointerLeave={stopHold}
            onPointerUp={stopHold}
          >
            <Icon
              blockSize="100%"
              inlineSize="100%"
              padding={STEPPER_CHEVRON_ICON_PADDING}
              showHover={false}
            >
              <ChevronDownIcon />
            </Icon>
          </StyledStepperButton>
        </StyledStepperSpin>
      </StyledStepperRoot>
    </StyledStepperFieldRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { getStepperTextSize };
