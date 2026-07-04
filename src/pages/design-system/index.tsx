import { useMemo, useState, type ReactNode } from 'react';

import { HEADER_BLOCK_SIZE } from '@components/header/header.styles';
import { useShellOutletContext } from '@components/router/use-shell-outlet-context';
import { SettingsIcon } from '@icons/settings';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { DateInput, todayUtc } from '@ui/date-input';
import { DateRangeInput } from '@ui/date-range-input';
import { Fieldset } from '@ui/fieldset';
import { Input } from '@ui/input';
import { Listbox } from '@ui/listbox';
import { Progress } from '@ui/progress';
import { RadioButton } from '@ui/radio-button';
import {
  DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES,
  RangeInput,
  type RangeValue,
} from '@ui/range-input';
import { RoundButton } from '@ui/round-button';
import { ScrollPort } from '@ui/scroll-port';
import { SegmentButton } from '@ui/segment-button';
import { Sidebar } from '@ui/sidebar';
import { spacingRem } from '@ui/spacing';
import { Spinner } from '@ui/spinner';
import { Stepper } from '@ui/stepper';
import { Switch } from '@ui/switch';
import { Tag } from '@ui/tag';
import { Toast } from '@ui/toast';

import { ButtonSettings, type ButtonWidgetState } from './button-settings';
import { CheckboxSettings, type CheckboxWidgetState } from './checkbox-settings';
import { ComboboxSettings, type ComboboxWidgetState } from './combobox-settings';
import {
  COMBOBOX_DEMO_OPTIONS,
  SHOWCASE_ICON_COMBOBOX_OPTIONS,
} from './combobox-settings/options';
import { DateInputSettings, type DateInputWidgetState } from './date-input-settings';
import {
  DateRangeInputSettings,
  type DateRangeInputWidgetState,
} from './date-range-input-settings';
import {
  StyledDesignSystemWidgets,
  StyledFieldsetDemo,
  StyledMain,
  StyledRadioButtonDemo,
  StyledSpinnerDemo,
} from './design-system.styles';
import { FieldsetSettings, type FieldsetWidgetState } from './fieldset-settings';
import { HeaderSettings } from './header-settings';
import { InputSettings, type InputWidgetState } from './input-settings';
import { ListboxSettings, type ListboxWidgetState } from './listbox-settings';
import { LISTBOX_DEMO_OPTIONS } from './listbox-settings/options';
import { ProgressSettings, type ProgressWidgetState } from './progress-settings';
import {
  RadioButtonSettings,
  type RadioButtonWidgetState,
} from './radio-button-settings';
import { RangeInputSettings, type RangeInputWidgetState } from './range-input-settings';
import {
  RoundButtonSettings,
  type RoundButtonWidgetState,
} from './round-button-settings';
import {
  SegmentButtonSettings,
  type SegmentButtonWidgetState,
} from './segment-button-settings';
import { renderShowcaseIcon } from './showcase-icons';
import { SpinnerSettings, type SpinnerWidgetState } from './spinner-settings';
import { StepperSettings, type StepperWidgetState } from './stepper-settings';
import { SwitchSettings, type SwitchWidgetState } from './switch-settings';
import { TagSettings, type TagWidgetState } from './tag-settings';
import { ToastSettings, type ToastWidgetState } from './toast-settings';

const SIDEBAR_ID = 'design-system-sidebar';
const INPUT_WIDGET_TITLE_ID = 'design-system-input-heading';
const BUTTON_WIDGET_TITLE_ID = 'design-system-button-heading';
const ROUND_BUTTON_WIDGET_TITLE_ID = 'design-system-round-button-heading';
const LISTBOX_WIDGET_TITLE_ID = 'design-system-listbox-heading';
const COMBOBOX_WIDGET_TITLE_ID = 'design-system-combobox-heading';
const RANGE_INPUT_WIDGET_TITLE_ID = 'design-system-range-input-heading';
const DATE_INPUT_WIDGET_TITLE_ID = 'design-system-date-input-heading';
const DATE_RANGE_INPUT_WIDGET_TITLE_ID = 'design-system-date-range-input-heading';
const CHECKBOX_WIDGET_TITLE_ID = 'design-system-checkbox-heading';
const RADIO_BUTTON_WIDGET_TITLE_ID = 'design-system-radio-button-heading';
const FIELDSET_WIDGET_TITLE_ID = 'design-system-fieldset-heading';
const PROGRESS_WIDGET_TITLE_ID = 'design-system-progress-heading';
const SPINNER_WIDGET_TITLE_ID = 'design-system-spinner-heading';
const STEPPER_WIDGET_TITLE_ID = 'design-system-stepper-heading';
const SEGMENT_BUTTON_WIDGET_TITLE_ID = 'design-system-segment-button-heading';
const TAG_WIDGET_TITLE_ID = 'design-system-tag-heading';
const SWITCH_WIDGET_TITLE_ID = 'design-system-switch-heading';
const TOAST_WIDGET_TITLE_ID = 'design-system-toast-heading';
const RADIO_BUTTON_DEMO_NAME = 'design-system-radio-button-demo';
const FIELDSET_DEMO_NAME = 'design-system-fieldset-demo';

type WidgetSettingsKey =
  | 'input'
  | 'listbox'
  | 'combobox'
  | 'range-input'
  | 'date-input'
  | 'date-range-input'
  | 'button'
  | 'round-button'
  | 'segment-button'
  | 'tag'
  | 'checkbox'
  | 'radio-button'
  | 'fieldset'
  | 'progress'
  | 'spinner'
  | 'stepper'
  | 'switch'
  | 'toast';

const SETTINGS_TITLES: Record<WidgetSettingsKey, string> = {
  input: 'Input',
  listbox: 'Listbox',
  combobox: 'Combobox',
  'range-input': 'Range filter',
  'date-input': 'Date input',
  'date-range-input': 'Date range',
  button: 'Button',
  'round-button': 'Round button',
  'segment-button': 'Segment button',
  tag: 'Tag',
  checkbox: 'Checkbox',
  'radio-button': 'Radio button',
  fieldset: 'Fieldset',
  progress: 'Progress',
  spinner: 'Spinner',
  stepper: 'Stepper',
  switch: 'Switch',
  toast: 'Toast',
};

/**
 * Локальный definite-якорь высоты видимой области: вьюпорт минус живая высота шапки
 * (CSS-переменная `--shell-header-block-size`, которую публикует сама шапка) и нижний инсет.
 * Единый источник высоты — шапка: при сворачивании в autoHide переменная уменьшается и
 * плейграунд/панель сайдбара плавно занимают весь экран. dvb не зависит от грид-каркаса body,
 * поэтому ScrollPort внутри скролит контент, не растягивая страницу. Каркасная альтернатива —
 * в @ui/sidebar.
 */
const PLAYGROUND_MAX_BLOCK_SIZE = `calc(100dvb - var(--shell-header-block-size, ${HEADER_BLOCK_SIZE}) - ${spacingRem(8)})`;

const DEFAULT_INPUT_STATE: InputWidgetState = {
  disabled: false,
  error: '',
  label: 'Label:',
  placeholder: 'e.g. value',
  shape: 'default',
  sizePreset: 'large',
  value: '',
};

const DEFAULT_BUTTON_STATE: ButtonWidgetState = {
  active: false,
  disabled: false,
  iconFill: 'default',
  iconKey: 'search',
  iconPosition: 'end',
  iconTone: 'default',
  textColor: 'default',
  shape: 'default',
  sizePreset: 'large',
  text: 'Button',
  tone: 'default',
  withIcon: false,
};

const DEFAULT_ROUND_BUTTON_STATE: RoundButtonWidgetState = {
  disabled: false,
  iconKey: 'settings',
  sizePreset: 'medium',
};

const DEFAULT_LISTBOX_STATE: ListboxWidgetState = {
  disabled: false,
  inlineCheckbox: false,
  label: 'Label:',
  multiple: false,
  shape: 'default',
  sizePreset: 'large',
  value: 'default',
};

const DEFAULT_COMBOBOX_STATE: ComboboxWidgetState = {
  disabled: false,
  label: 'Label:',
  shape: 'default',
  sizePreset: 'large',
  value: 'search',
  withIcon: false,
};

const DEFAULT_RANGE_INPUT_STATE: RangeInputWidgetState = {
  buttonShape: 'default',
  buttonSizePreset: 'large',
  buttonText: 'Apply',
  buttonTextColor: 'default',
  buttonTone: 'primary',
  disabled: false,
  fromPlaceholder: 'From',
  inputShape: 'default',
  inputSizePreset: 'large',
  label: 'Label:',
  placeholder: 'Range: any',
  shape: 'default',
  sizePreset: 'large',
  title: 'Custom range:',
  titleAlign: 'center',
  titleSizePreset: 'normal',
  toPlaceholder: 'To',
  validationMessages: { ...DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES },
  value: { from: '', to: '' },
  withClear: true,
};

const DEFAULT_DATE_INPUT_STATE: DateInputWidgetState = {
  disabled: false,
  maxDay: todayUtc(),
  minDay: '',
  shape: 'default',
  sizePreset: 'large',
  value: '',
};

const DEFAULT_DATE_RANGE_INPUT_STATE: DateRangeInputWidgetState = {
  disabled: false,
  endDay: '',
  maxDay: todayUtc(),
  minDay: '',
  shape: 'default',
  sizePreset: 'large',
  startDay: '',
};

const DEFAULT_CHECKBOX_STATE: CheckboxWidgetState = {
  bare: false,
  checked: true,
  disabled: false,
  inverted: false,
  label: 'Example',
  sizePreset: 'large',
};

const DEFAULT_RADIO_BUTTON_STATE: RadioButtonWidgetState = {
  bare: false,
  disabledA: false,
  disabledB: false,
  labelA: 'Option A',
  labelB: 'Option B',
  selected: 'a',
};

const DEFAULT_FIELDSET_STATE: FieldsetWidgetState = {
  borderTone: 'default',
  disabledA: false,
  disabledB: false,
  label: 'Label:',
  labelA: 'Option A',
  labelB: 'Option B',
  selected: 'a',
};

const DEFAULT_PROGRESS_STATE: ProgressWidgetState = {
  showLabel: true,
  sizePreset: 'medium',
  tone: 'primary',
  valuePercent: 42,
};

const DEFAULT_SPINNER_STATE: SpinnerWidgetState = {
  sizePreset: 'medium',
  tone: 'primary',
};

const DEFAULT_STEPPER_STATE: StepperWidgetState = {
  disabled: false,
  shape: 'default',
  sizePreset: 'large',
  step: 1,
  value: 10,
};

const DEFAULT_SWITCH_STATE: SwitchWidgetState = {
  checked: true,
  disabled: false,
  label: 'Switch',
  sizePreset: 'large',
  tone: 'primary',
};

const DEFAULT_TOAST_STATE: ToastWidgetState = {
  message: 'Very important message',
  sizePreset: 'large',
  tone: 'success',
};

const DEFAULT_SEGMENT_BUTTON_STATE: SegmentButtonWidgetState = {
  centerDisabled: false,
  centerText: 'Change',
  centerTextColor: 'success',
  leftDisabled: false,
  leftText: 'Select',
  leftTextColor: 'default',
  rightDisabled: false,
  rightText: 'Delete',
  rightTextColor: 'danger',
  segmentCount: '2',
  shape: 'default',
  sizePreset: 'large',
};

const DEFAULT_TAG_STATE: TagWidgetState = {
  borderColor: 'default',
  dot: true,
  dotColor: 'default',
  shape: 'round',
  sizePreset: 'small',
  bordered: true,
  text: 'Tag',
  textColor: 'default',
  tinted: false,
  tone: 'primary',
};

function formatDemoRangeLabel(value: RangeValue): string {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from && to) {
    return `${from}–${to}`;
  }

  if (from) {
    return `${from}+`;
  }

  if (to) {
    return `≤${to}`;
  }

  return '';
}

function validateDemoRange(value: RangeValue): string | null {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from !== '' && to !== '' && Number(from) > Number(to)) {
    return 'From must not exceed To.';
  }

  return null;
}

export function DesignSystemPage() {
  /* autoHide хедера живёт в каркасе. ДС лишь даёт витрину-переключатель (см. header-settings). */
  const { autoHide, headerSettingsOpen, setAutoHide, setHeaderSettingsOpen } =
    useShellOutletContext();
  const [activeSettings, setActiveSettings] = useState<WidgetSettingsKey | null>(null);
  const [input, setInput] = useState<InputWidgetState>(DEFAULT_INPUT_STATE);
  const [button, setButton] = useState<ButtonWidgetState>(DEFAULT_BUTTON_STATE);
  const [roundButton, setRoundButton] = useState<RoundButtonWidgetState>(
    DEFAULT_ROUND_BUTTON_STATE
  );
  const [listbox, setListbox] = useState<ListboxWidgetState>(DEFAULT_LISTBOX_STATE);
  const [combobox, setCombobox] = useState<ComboboxWidgetState>(DEFAULT_COMBOBOX_STATE);
  const [rangeInput, setRangeInput] = useState<RangeInputWidgetState>(
    DEFAULT_RANGE_INPUT_STATE
  );
  const [dateInput, setDateInput] = useState<DateInputWidgetState>(
    DEFAULT_DATE_INPUT_STATE
  );
  const [dateRangeInput, setDateRangeInput] = useState<DateRangeInputWidgetState>(
    DEFAULT_DATE_RANGE_INPUT_STATE
  );
  const [checkbox, setCheckbox] = useState<CheckboxWidgetState>(DEFAULT_CHECKBOX_STATE);
  const [radioButton, setRadioButton] = useState<RadioButtonWidgetState>(
    DEFAULT_RADIO_BUTTON_STATE
  );
  const [fieldset, setFieldset] = useState<FieldsetWidgetState>(DEFAULT_FIELDSET_STATE);
  const [progress, setProgress] = useState<ProgressWidgetState>(DEFAULT_PROGRESS_STATE);
  const [spinner, setSpinner] = useState<SpinnerWidgetState>(DEFAULT_SPINNER_STATE);
  const [stepper, setStepper] = useState<StepperWidgetState>(DEFAULT_STEPPER_STATE);
  const [switchState, setSwitchState] =
    useState<SwitchWidgetState>(DEFAULT_SWITCH_STATE);
  const [toast, setToast] = useState<ToastWidgetState>(DEFAULT_TOAST_STATE);
  const [segmentButton, setSegmentButton] = useState<SegmentButtonWidgetState>(
    DEFAULT_SEGMENT_BUTTON_STATE
  );
  const [tag, setTag] = useState<TagWidgetState>(DEFAULT_TAG_STATE);

  /* Витрина хедера приоритетна и при открытии сбрасывает выбранный виджет — один источник
     истины о содержимом сайдбара (иначе карточка виджета осталась бы aria-expanded под ней). */
  const [headerSettingsShown, setHeaderSettingsShown] = useState(headerSettingsOpen);
  if (headerSettingsOpen !== headerSettingsShown) {
    setHeaderSettingsShown(headerSettingsOpen);

    if (headerSettingsOpen) {
      setActiveSettings(null);
    }
  }

  const settingsOpen = activeSettings !== null;
  /* Витрина хедера и настройки виджета делят один сайдбар, но не показываются вместе. */
  const panelOpen = settingsOpen || headerSettingsOpen;
  const panelTitle = headerSettingsOpen
    ? 'Header'
    : activeSettings
      ? SETTINGS_TITLES[activeSettings]
      : undefined;

  function activateSettings(target: WidgetSettingsKey): void {
    if (!panelOpen) {
      return;
    }

    setHeaderSettingsOpen(false);
    setActiveSettings(target);
  }

  function toggleSettings(target: WidgetSettingsKey): void {
    setHeaderSettingsOpen(false);
    setActiveSettings((current) => (current === target ? null : target));
  }

  function closePanel(): void {
    setActiveSettings(null);
    setHeaderSettingsOpen(false);
  }

  function updateInput<K extends keyof InputWidgetState>(
    key: K,
    value: InputWidgetState[K]
  ): void {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateButton<K extends keyof ButtonWidgetState>(
    key: K,
    value: ButtonWidgetState[K]
  ): void {
    setButton((current) => ({ ...current, [key]: value }));
  }

  function updateRoundButton<K extends keyof RoundButtonWidgetState>(
    key: K,
    value: RoundButtonWidgetState[K]
  ): void {
    setRoundButton((current) => ({ ...current, [key]: value }));
  }

  function updateListbox<K extends keyof ListboxWidgetState>(
    key: K,
    value: ListboxWidgetState[K]
  ): void {
    setListbox((current) => {
      const next = { ...current, [key]: value };

      if (key === 'multiple') {
        next.value =
          value === true
            ? Array.isArray(current.value)
              ? current.value
              : [current.value]
            : Array.isArray(current.value)
              ? (current.value[0] ?? 'default')
              : current.value;

        if (value === false) {
          next.inlineCheckbox = false;
        }
      }

      if (key === 'inlineCheckbox' && value === true) {
        next.multiple = true;
        next.value = Array.isArray(current.value) ? current.value : [current.value];
      }

      return next;
    });
  }

  function updateCombobox<K extends keyof ComboboxWidgetState>(
    key: K,
    value: ComboboxWidgetState[K]
  ): void {
    setCombobox((current) => ({ ...current, [key]: value }));
  }

  const comboboxDemoOptions = useMemo(
    () => (combobox.withIcon ? SHOWCASE_ICON_COMBOBOX_OPTIONS : COMBOBOX_DEMO_OPTIONS),
    [combobox.withIcon]
  );

  function updateRangeInput<K extends keyof RangeInputWidgetState>(
    key: K,
    value: RangeInputWidgetState[K]
  ): void {
    setRangeInput((current) => ({ ...current, [key]: value }));
  }

  function clearRangeInputValue(): void {
    setRangeInput((current) => ({
      ...current,
      value: { from: '', to: '' },
    }));
  }

  function updateDateInput<K extends keyof DateInputWidgetState>(
    key: K,
    value: DateInputWidgetState[K]
  ): void {
    setDateInput((current) => ({ ...current, [key]: value }));
  }

  function updateDateRangeInput<K extends keyof DateRangeInputWidgetState>(
    key: K,
    value: DateRangeInputWidgetState[K]
  ): void {
    setDateRangeInput((current) => ({ ...current, [key]: value }));
  }

  function updateCheckbox<K extends keyof CheckboxWidgetState>(
    key: K,
    value: CheckboxWidgetState[K]
  ): void {
    setCheckbox((current) => ({ ...current, [key]: value }));
  }

  function updateRadioButton<K extends keyof RadioButtonWidgetState>(
    key: K,
    value: RadioButtonWidgetState[K]
  ): void {
    setRadioButton((current) => ({ ...current, [key]: value }));
  }

  function updateFieldset<K extends keyof FieldsetWidgetState>(
    key: K,
    value: FieldsetWidgetState[K]
  ): void {
    setFieldset((current) => ({ ...current, [key]: value }));
  }

  function updateProgress<K extends keyof ProgressWidgetState>(
    key: K,
    value: ProgressWidgetState[K]
  ): void {
    setProgress((current) => ({ ...current, [key]: value }));
  }

  function updateSpinner<K extends keyof SpinnerWidgetState>(
    key: K,
    value: SpinnerWidgetState[K]
  ): void {
    setSpinner((current) => ({ ...current, [key]: value }));
  }

  function updateStepper<K extends keyof StepperWidgetState>(
    key: K,
    value: StepperWidgetState[K]
  ): void {
    setStepper((current) => ({ ...current, [key]: value }));
  }

  function updateSwitch<K extends keyof SwitchWidgetState>(
    key: K,
    value: SwitchWidgetState[K]
  ): void {
    setSwitchState((current) => ({ ...current, [key]: value }));
  }

  function updateToast<K extends keyof ToastWidgetState>(
    key: K,
    value: ToastWidgetState[K]
  ): void {
    setToast((current) => ({ ...current, [key]: value }));
  }

  function updateSegmentButton<K extends keyof SegmentButtonWidgetState>(
    key: K,
    value: SegmentButtonWidgetState[K]
  ): void {
    setSegmentButton((current) => ({ ...current, [key]: value }));
  }

  function updateTag<K extends keyof TagWidgetState>(
    key: K,
    value: TagWidgetState[K]
  ): void {
    setTag((current) => ({ ...current, [key]: value }));
  }

  function renderSettingsPanel(): ReactNode {
    if (activeSettings === 'input') {
      return <InputSettings state={input} onChange={updateInput} />;
    }

    if (activeSettings === 'listbox') {
      return <ListboxSettings state={listbox} onChange={updateListbox} />;
    }

    if (activeSettings === 'combobox') {
      return <ComboboxSettings state={combobox} onChange={updateCombobox} />;
    }

    if (activeSettings === 'range-input') {
      return <RangeInputSettings state={rangeInput} onChange={updateRangeInput} />;
    }

    if (activeSettings === 'date-input') {
      return <DateInputSettings state={dateInput} onChange={updateDateInput} />;
    }

    if (activeSettings === 'date-range-input') {
      return (
        <DateRangeInputSettings state={dateRangeInput} onChange={updateDateRangeInput} />
      );
    }

    if (activeSettings === 'button') {
      return <ButtonSettings state={button} onChange={updateButton} />;
    }

    if (activeSettings === 'round-button') {
      return <RoundButtonSettings state={roundButton} onChange={updateRoundButton} />;
    }

    if (activeSettings === 'segment-button') {
      return (
        <SegmentButtonSettings state={segmentButton} onChange={updateSegmentButton} />
      );
    }

    if (activeSettings === 'tag') {
      return <TagSettings state={tag} onChange={updateTag} />;
    }

    if (activeSettings === 'checkbox') {
      return <CheckboxSettings state={checkbox} onChange={updateCheckbox} />;
    }

    if (activeSettings === 'radio-button') {
      return <RadioButtonSettings state={radioButton} onChange={updateRadioButton} />;
    }

    if (activeSettings === 'fieldset') {
      return <FieldsetSettings state={fieldset} onChange={updateFieldset} />;
    }

    if (activeSettings === 'progress') {
      return <ProgressSettings state={progress} onChange={updateProgress} />;
    }

    if (activeSettings === 'spinner') {
      return <SpinnerSettings state={spinner} onChange={updateSpinner} />;
    }

    if (activeSettings === 'stepper') {
      return <StepperSettings state={stepper} onChange={updateStepper} />;
    }

    if (activeSettings === 'switch') {
      return <SwitchSettings state={switchState} onChange={updateSwitch} />;
    }

    if (activeSettings === 'toast') {
      return <ToastSettings state={toast} onChange={updateToast} />;
    }

    return null;
  }

  /** Общий скелет карточки виджета: иконка-настройки + aria/toggle-обвязка; различие — ключ и содержимое. */
  function renderWidgetCard(
    widgetKey: WidgetSettingsKey,
    titleId: string,
    children: ReactNode
  ): ReactNode {
    const open = activeSettings === widgetKey;

    return (
      <Card
        as="article"
        aria-labelledby={titleId}
        background="default"
        headerActions={[
          {
            ariaControls: SIDEBAR_ID,
            ariaExpanded: open,
            ariaLabel: open ? 'Close settings' : 'Open settings',
            icon: <SettingsIcon />,
            onClick: () => toggleSettings(widgetKey),
          },
        ]}
        title={SETTINGS_TITLES[widgetKey]}
        titleId={titleId}
        onClick={() => activateSettings(widgetKey)}
      >
        {children}
      </Card>
    );
  }

  return (
    <StyledMain>
      <Sidebar
        id={SIDEBAR_ID}
        maxBlockSize={PLAYGROUND_MAX_BLOCK_SIZE}
        open={panelOpen}
        paddingBlockEnd={8}
        paddingInlineStart={8}
        title={panelTitle}
        sidebarContent={
          <ScrollPort>
            {(headerSettingsOpen && (
              <HeaderSettings autoHide={autoHide} onChange={setAutoHide} />
            )) ||
              renderSettingsPanel()}
          </ScrollPort>
        }
        onClose={closePanel}
      >
        <Card as="section" maxBlockSize={PLAYGROUND_MAX_BLOCK_SIZE}>
          <ScrollPort>
            <StyledDesignSystemWidgets>
              {renderWidgetCard(
                'input',
                INPUT_WIDGET_TITLE_ID,
                <Input
                  alignSelf="center"
                  disabled={input.disabled}
                  error={input.error || undefined}
                  label={input.label || undefined}
                  placeholder={input.placeholder}
                  shape={input.shape}
                  sizePreset={input.sizePreset}
                  value={input.value}
                  onChange={(event) => updateInput('value', event.target.value)}
                />
              )}

              {renderWidgetCard(
                'listbox',
                LISTBOX_WIDGET_TITLE_ID,
                <Listbox
                  alignSelf="center"
                  disabled={listbox.disabled}
                  inlineCheckbox={listbox.inlineCheckbox}
                  label={listbox.label || undefined}
                  multiple={listbox.multiple}
                  options={LISTBOX_DEMO_OPTIONS}
                  shape={listbox.shape}
                  sizePreset={listbox.sizePreset}
                  value={listbox.value}
                  onChange={(value) => updateListbox('value', value)}
                />
              )}

              {renderWidgetCard(
                'combobox',
                COMBOBOX_WIDGET_TITLE_ID,
                <Combobox
                  alignSelf="center"
                  disabled={combobox.disabled}
                  label={combobox.label || undefined}
                  options={comboboxDemoOptions}
                  shape={combobox.shape}
                  sizePreset={combobox.sizePreset}
                  value={combobox.value}
                  onChange={(value) => updateCombobox('value', value)}
                />
              )}

              {renderWidgetCard(
                'range-input',
                RANGE_INPUT_WIDGET_TITLE_ID,
                <RangeInput
                  alignSelf="center"
                  buttonShape={rangeInput.buttonShape}
                  buttonSizePreset={rangeInput.buttonSizePreset}
                  buttonText={rangeInput.buttonText}
                  buttonTextColor={rangeInput.buttonTextColor}
                  buttonTone={rangeInput.buttonTone}
                  disabled={rangeInput.disabled}
                  formatActiveLabel={formatDemoRangeLabel}
                  fromPlaceholder={rangeInput.fromPlaceholder}
                  inputShape={rangeInput.inputShape}
                  inputSizePreset={rangeInput.inputSizePreset}
                  label={rangeInput.label || undefined}
                  placeholder={rangeInput.placeholder}
                  shape={rangeInput.shape}
                  sizePreset={rangeInput.sizePreset}
                  title={rangeInput.title}
                  titleAlign={rangeInput.titleAlign}
                  titleSizePreset={rangeInput.titleSizePreset}
                  toPlaceholder={rangeInput.toPlaceholder}
                  validate={validateDemoRange}
                  validationMessages={rangeInput.validationMessages}
                  value={rangeInput.value}
                  onChange={(next) => updateRangeInput('value', next)}
                  onClear={
                    rangeInput.withClear
                      ? () => {
                          clearRangeInputValue();
                        }
                      : undefined
                  }
                />
              )}

              {renderWidgetCard(
                'date-input',
                DATE_INPUT_WIDGET_TITLE_ID,
                <DateInput
                  alignSelf="center"
                  aria-label="Demo date"
                  disabled={dateInput.disabled}
                  maxDay={dateInput.maxDay || undefined}
                  minDay={dateInput.minDay || undefined}
                  shape={dateInput.shape}
                  sizePreset={dateInput.sizePreset}
                  value={dateInput.value}
                  {...(dateInput.dayShape != null
                    ? { dayShape: dateInput.dayShape }
                    : {})}
                  onChange={(value) => updateDateInput('value', value)}
                  onClear={() => updateDateInput('value', '')}
                />
              )}

              {renderWidgetCard(
                'date-range-input',
                DATE_RANGE_INPUT_WIDGET_TITLE_ID,
                <DateRangeInput
                  alignSelf="center"
                  disabled={dateRangeInput.disabled}
                  endDay={dateRangeInput.endDay}
                  maxDay={dateRangeInput.maxDay || undefined}
                  minDay={dateRangeInput.minDay || undefined}
                  shape={dateRangeInput.shape}
                  sizePreset={dateRangeInput.sizePreset}
                  startDay={dateRangeInput.startDay}
                  {...(dateRangeInput.dayShape != null
                    ? { dayShape: dateRangeInput.dayShape }
                    : {})}
                  onClear={() => {
                    updateDateRangeInput('startDay', '');
                    updateDateRangeInput('endDay', '');
                  }}
                  onEndDayChange={(value) => updateDateRangeInput('endDay', value)}
                  onStartDayChange={(value) => updateDateRangeInput('startDay', value)}
                />
              )}

              {renderWidgetCard(
                'button',
                BUTTON_WIDGET_TITLE_ID,
                <Button
                  active={button.active}
                  alignSelf="center"
                  disabled={button.disabled}
                  icon={button.withIcon ? renderShowcaseIcon(button.iconKey) : undefined}
                  iconFill={button.withIcon ? button.iconFill : undefined}
                  iconPosition={button.iconPosition}
                  iconTone={button.withIcon ? button.iconTone : undefined}
                  textColor={button.textColor}
                  shape={button.shape}
                  sizePreset={button.sizePreset}
                  tone={button.tone}
                  type="button"
                >
                  {button.text}
                </Button>
              )}

              {renderWidgetCard(
                'round-button',
                ROUND_BUTTON_WIDGET_TITLE_ID,
                <RoundButton
                  aria-label="Demo round button"
                  disabled={roundButton.disabled}
                  placeSelf="center"
                  sizePreset={roundButton.sizePreset}
                >
                  {renderShowcaseIcon(roundButton.iconKey)}
                </RoundButton>
              )}

              {renderWidgetCard(
                'segment-button',
                SEGMENT_BUTTON_WIDGET_TITLE_ID,
                <SegmentButton
                  alignSelf="center"
                  shape={segmentButton.shape}
                  sizePreset={segmentButton.sizePreset}
                  center={
                    segmentButton.segmentCount === '3'
                      ? {
                          disabled: segmentButton.centerDisabled,
                          text: segmentButton.centerText,
                          textColor: segmentButton.centerTextColor,
                        }
                      : undefined
                  }
                  left={{
                    disabled: segmentButton.leftDisabled,
                    text: segmentButton.leftText,
                    textColor: segmentButton.leftTextColor,
                  }}
                  right={{
                    disabled: segmentButton.rightDisabled,
                    text: segmentButton.rightText,
                    textColor: segmentButton.rightTextColor,
                  }}
                />
              )}

              {renderWidgetCard(
                'tag',
                TAG_WIDGET_TITLE_ID,
                <Tag
                  borderColor={tag.borderColor}
                  dot={tag.dot}
                  dotColor={tag.dotColor}
                  placeSelf="center"
                  shape={tag.shape}
                  sizePreset={tag.sizePreset}
                  bordered={tag.bordered}
                  tinted={tag.tinted}
                  textColor={tag.textColor}
                  tone={tag.tone}
                >
                  {tag.text}
                </Tag>
              )}

              {renderWidgetCard(
                'checkbox',
                CHECKBOX_WIDGET_TITLE_ID,
                <Checkbox
                  bare={checkbox.bare}
                  checked={checkbox.checked}
                  disabled={checkbox.disabled}
                  inverted={checkbox.inverted}
                  label={checkbox.bare ? undefined : checkbox.label}
                  placeSelf="center"
                  sizePreset={checkbox.sizePreset}
                  onChange={(event) => updateCheckbox('checked', event.target.checked)}
                />
              )}

              {renderWidgetCard(
                'radio-button',
                RADIO_BUTTON_WIDGET_TITLE_ID,
                <StyledRadioButtonDemo>
                  <RadioButton
                    bare={radioButton.bare}
                    checked={radioButton.selected === 'a'}
                    disabled={radioButton.disabledA}
                    label={radioButton.bare ? undefined : radioButton.labelA}
                    name={RADIO_BUTTON_DEMO_NAME}
                    value="a"
                    onChange={() => updateRadioButton('selected', 'a')}
                  />
                  <RadioButton
                    bare={radioButton.bare}
                    checked={radioButton.selected === 'b'}
                    disabled={radioButton.disabledB}
                    label={radioButton.bare ? undefined : radioButton.labelB}
                    name={RADIO_BUTTON_DEMO_NAME}
                    value="b"
                    onChange={() => updateRadioButton('selected', 'b')}
                  />
                </StyledRadioButtonDemo>
              )}

              {renderWidgetCard(
                'fieldset',
                FIELDSET_WIDGET_TITLE_ID,
                <StyledFieldsetDemo>
                  <Fieldset borderTone={fieldset.borderTone} label={fieldset.label}>
                    <RadioButton
                      checked={fieldset.selected === 'a'}
                      disabled={fieldset.disabledA}
                      label={fieldset.labelA}
                      name={FIELDSET_DEMO_NAME}
                      value="a"
                      onChange={() => updateFieldset('selected', 'a')}
                    />
                    <RadioButton
                      checked={fieldset.selected === 'b'}
                      disabled={fieldset.disabledB}
                      label={fieldset.labelB}
                      name={FIELDSET_DEMO_NAME}
                      value="b"
                      onChange={() => updateFieldset('selected', 'b')}
                    />
                  </Fieldset>
                </StyledFieldsetDemo>
              )}

              {renderWidgetCard(
                'progress',
                PROGRESS_WIDGET_TITLE_ID,
                <Progress
                  inlineSize="100%"
                  showLabel={progress.showLabel}
                  sizePreset={progress.sizePreset}
                  tone={progress.tone}
                  value={progress.valuePercent / 100}
                />
              )}

              {renderWidgetCard(
                'spinner',
                SPINNER_WIDGET_TITLE_ID,
                <StyledSpinnerDemo>
                  <Spinner sizePreset={spinner.sizePreset} tone={spinner.tone} />
                </StyledSpinnerDemo>
              )}

              {renderWidgetCard(
                'stepper',
                STEPPER_WIDGET_TITLE_ID,
                <Stepper
                  alignSelf="center"
                  align="center"
                  aria-label="Demo stepper"
                  disabled={stepper.disabled}
                  min={0}
                  shape={stepper.shape}
                  sizePreset={stepper.sizePreset}
                  step={stepper.step}
                  value={stepper.value}
                  onChange={(value) => updateStepper('value', value)}
                />
              )}

              {renderWidgetCard(
                'switch',
                SWITCH_WIDGET_TITLE_ID,
                <Switch
                  checked={switchState.checked}
                  disabled={switchState.disabled}
                  label={switchState.label || undefined}
                  placeSelf="center"
                  sizePreset={switchState.sizePreset}
                  tone={switchState.tone}
                  onChange={(event) => updateSwitch('checked', event.target.checked)}
                />
              )}

              {renderWidgetCard(
                'toast',
                TOAST_WIDGET_TITLE_ID,
                <Toast
                  alignSelf="center"
                  message={toast.message}
                  sizePreset={toast.sizePreset}
                  tone={toast.tone}
                />
              )}
            </StyledDesignSystemWidgets>
          </ScrollPort>
        </Card>
      </Sidebar>
    </StyledMain>
  );
}
