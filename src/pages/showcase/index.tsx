// TODO: ручное ревью — pages/showcase/index.tsx
import { useMemo, useState, type ReactNode } from 'react';

import { useShellOutletContext } from '@components/router';
import { useToast } from '@hooks/use-toast';
import { SettingsIcon } from '@icons';
import { Button, getButtonTextSize } from '@ui/button';
import { CARD_HEADER_ACTION_SIZE_PRESET, Card } from '@ui/card';
import { Checkbox, getCheckboxTextSize } from '@ui/checkbox';
import { Combobox, type ComboboxOption } from '@ui/combobox';
import { DateRangeInput, todayUtc } from '@ui/date-range-input';
import { Fieldset } from '@ui/fieldset';
import { getIconPadding } from '@ui/icon';
import { Input } from '@ui/input';
import { Listbox } from '@ui/listbox';
import { Modal } from '@ui/modal';
import { type SizePreset } from '@ui/presets';
import { ProgressBar, getProgressBarTextSize } from '@ui/progress-bar';
import { RadioButton, getRadioButtonTextSize } from '@ui/radio-button';
import {
  DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES,
  RangeInput,
  type RangeValue,
} from '@ui/range-input';
import {
  DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  RoundButton,
} from '@ui/round-button';
import { ScrollPort } from '@ui/scroll-port';
import { SegmentButton, getSegmentButtonTextSize } from '@ui/segment-button';
import { Sidebar } from '@ui/sidebar';
import { Spinner, getSpinnerTextSize } from '@ui/spinner';
import { Stepper, getStepperTextSize } from '@ui/stepper';
import { Switch, getSwitchTextSize } from '@ui/switch';
import { Tag, getTagTextSize } from '@ui/tag';
import { Text } from '@ui/text';
import { Toast, getToastTextSize } from '@ui/toast';
import { DEFAULT_TONE } from '@ui/tones';

import { BrowserAiSmokeProbe } from './browser-ai-smoke-probe';
import { ButtonSettings, type ButtonWidgetState } from './button-settings';
import { CardSettings, type CardWidgetState } from './card-settings';
import { CheckboxSettings, type CheckboxWidgetState } from './checkbox-settings';
import { ComboboxSettings, type ComboboxWidgetState } from './combobox-settings';
import {
  DateRangeInputSettings,
  type DateRangeInputWidgetState,
} from './date-range-input-settings';
import { FieldsetSettings, type FieldsetWidgetState } from './fieldset-settings';
import { HeaderSettings } from './header-settings';
import { InputSettings, type InputWidgetState } from './input-settings';
import { ListboxSettings, type ListboxWidgetState } from './listbox-settings';
import { LISTBOX_DEMO_OPTIONS } from './listbox-settings/options';
import { ModalSettings, type ModalWidgetState } from './modal-settings';
import {
  ProgressBarSettings,
  type ProgressBarWidgetState,
} from './progress-bar-settings';
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
import { COMBOBOX_OPTIONS, LIST_OPTIONS, getIcon } from './showcase-icon-options';
import {
  StyledFieldsetDemo,
  StyledMain,
  StyledRadioButtonDemo,
  StyledShowcaseWidgetFullRow,
  StyledShowcaseWidgets,
  StyledSpinnerDemo,
  StyledTextDemo,
} from './showcase.styles';
import { SpinnerSettings, type SpinnerWidgetState } from './spinner-settings';
import { StepperSettings, type StepperWidgetState } from './stepper-settings';
import { SwitchSettings, type SwitchWidgetState } from './switch-settings';
import { TableDemo } from './table-demo';
import { TableSettings, type TableWidgetState } from './table-settings';
import { TagSettings, type TagWidgetState } from './tag-settings';
import { TextSettings, type TextWidgetState } from './text-settings';
import { ToastSettings, type ToastWidgetState } from './toast-settings';

const SIDEBAR_ID = 'showcase-sidebar';
const INPUT_WIDGET_TITLE_ID = 'showcase-input-heading';
const BUTTON_WIDGET_TITLE_ID = 'showcase-button-heading';
const ROUND_BUTTON_WIDGET_TITLE_ID = 'showcase-round-button-heading';
const LISTBOX_WIDGET_TITLE_ID = 'showcase-listbox-heading';
const COMBOBOX_WIDGET_TITLE_ID = 'showcase-combobox-heading';
const RANGE_INPUT_WIDGET_TITLE_ID = 'showcase-range-input-heading';
const DATE_RANGE_INPUT_WIDGET_TITLE_ID = 'showcase-date-range-input-heading';
const CHECKBOX_WIDGET_TITLE_ID = 'showcase-checkbox-heading';
const RADIO_BUTTON_WIDGET_TITLE_ID = 'showcase-radio-button-heading';
const FIELDSET_WIDGET_TITLE_ID = 'showcase-fieldset-heading';
const PROGRESS_WIDGET_TITLE_ID = 'showcase-progress-heading';
const SPINNER_WIDGET_TITLE_ID = 'showcase-spinner-heading';
const STEPPER_WIDGET_TITLE_ID = 'showcase-stepper-heading';
const SEGMENT_BUTTON_WIDGET_TITLE_ID = 'showcase-segment-button-heading';
const TAG_WIDGET_TITLE_ID = 'showcase-tag-heading';
const TABLE_WIDGET_TITLE_ID = 'showcase-table-heading';
const SWITCH_WIDGET_TITLE_ID = 'showcase-switch-heading';
const TOAST_WIDGET_TITLE_ID = 'showcase-toast-heading';
const MODAL_WIDGET_TITLE_ID = 'showcase-modal-heading';
const CARD_WIDGET_TITLE_ID = 'showcase-card-heading';
const TEXT_WIDGET_TITLE_ID = 'showcase-text-heading';
const RADIO_BUTTON_DEMO_NAME = 'showcase-radio-button-demo';
const FIELDSET_DEMO_NAME = 'showcase-fieldset-demo';

type WidgetSettingsKey =
  | 'button'
  | 'card'
  | 'checkbox'
  | 'combobox'
  | 'date-range-input'
  | 'fieldset'
  | 'input'
  | 'listbox'
  | 'modal'
  | 'progress'
  | 'radio-button'
  | 'range-input'
  | 'round-button'
  | 'segment-button'
  | 'spinner'
  | 'stepper'
  | 'switch'
  | 'table'
  | 'tag'
  | 'text'
  | 'toast';

const SETTINGS_TITLES: Record<WidgetSettingsKey, string> = {
  input: 'Input',
  listbox: 'Listbox',
  combobox: 'Combobox',
  'range-input': 'Range input',
  'date-range-input': 'Date range',
  button: 'Button',
  'round-button': 'Round button',
  'segment-button': 'Segment button',
  tag: 'Tag',
  table: 'Table',
  checkbox: 'Checkbox',
  'radio-button': 'Radio button',
  fieldset: 'Fieldset',
  progress: 'ProgressBar',
  spinner: 'Spinner',
  stepper: 'Stepper',
  switch: 'Switch',
  toast: 'Toast',
  modal: 'Modal',
  card: 'Card',
  text: 'Text',
};

const MODAL_INLINE_SIZE: Record<SizePreset, string> = {
  small: '20rem',
  normal: '28rem',
  large: '36rem',
};

const DEFAULT_INPUT_STATE: InputWidgetState = {
  disabled: false,
  error: '',
  errorAlign: 'center',
  errorItalic: false,
  invalid: false,
  label: 'Label:',
  placeholder: 'e.g. value',
  reserveErrorSpace: true,
  shape: 'rounded',
  showBorder: true,
  sizePreset: 'normal',
  textAlign: undefined,
  textItalic: false,
  value: '',
};

const DEFAULT_BUTTON_STATE: ButtonWidgetState = {
  active: false,
  disabled: false,
  iconFill: 'default',
  iconKey: 'search',
  iconPosition: 'end',
  iconTone: 'default',
  shape: 'rounded',
  sizePreset: 'normal',
  text: 'Button',
  textItalic: false,
  textSize: getButtonTextSize('normal'),
  textTone: 'default',
  tone: 'default',
  withIcon: false,
};

const DEFAULT_ROUND_BUTTON_STATE: RoundButtonWidgetState = {
  disabled: false,
  iconFill: 'default',
  iconKey: 'settings',
  iconPadding: getIconPadding(DEFAULT_ROUND_BUTTON_SIZE_PRESET),
  iconTone: 'default',
  showBorder: DEFAULT_ROUND_BUTTON_SHOW_BORDER,
  sizePreset: DEFAULT_ROUND_BUTTON_SIZE_PRESET,
};

const DEFAULT_LISTBOX_STATE: ListboxWidgetState = {
  disabled: false,
  iconFill: 'default',
  iconPosition: 'end',
  iconTone: 'default',
  inlineCheckbox: false,
  label: 'Label:',
  multiple: false,
  placeholder: 'Select…',
  reserveErrorSpace: true,
  shape: 'rounded',
  sizePreset: 'normal',
  value: 'default',
};

const DEFAULT_COMBOBOX_STATE: ComboboxWidgetState = {
  disabled: false,
  emptyMessage: 'Nothing found',
  iconFill: 'default',
  iconPosition: 'end',
  iconTone: 'default',
  label: 'Label:',
  placeholder: 'Select…',
  reserveErrorSpace: true,
  searchPlaceholder: 'Search…',
  shape: 'rounded',
  sizePreset: 'normal',
  value: 'search',
  withIcon: false,
};

const DEFAULT_RANGE_INPUT_STATE: RangeInputWidgetState = {
  buttonShape: 'rounded',
  buttonSizePreset: 'normal',
  buttonText: 'Apply',
  buttonTextTone: 'default',
  buttonTone: 'primary',
  disabled: false,
  fromPlaceholder: 'From',
  iconFill: 'default',
  iconPosition: 'end',
  iconTone: 'default',
  inputShape: 'rounded',
  inputSizePreset: 'normal',
  label: 'Label:',
  placeholder: 'Range: any',
  reserveErrorSpace: true,
  shape: 'rounded',
  sizePreset: 'normal',
  title: 'Custom range:',
  titleAlign: 'center',
  titleSizePreset: 'normal',
  titleTone: DEFAULT_TONE,
  toPlaceholder: 'To',
  validationMessages: { ...DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES },
  value: { from: '', to: '' },
  withClear: true,
};

const DEFAULT_DATE_RANGE_INPUT_STATE: DateRangeInputWidgetState = {
  disabled: false,
  endDay: '',
  endLabel: 'End date',
  maxDay: todayUtc(),
  minDay: '',
  shape: 'rounded',
  sizePreset: 'normal',
  startDay: '',
  startLabel: 'Start date',
};

const DEFAULT_CHECKBOX_STATE: CheckboxWidgetState = {
  checked: true,
  checkedMark: 'check',
  disabled: false,
  inverted: false,
  showText: true,
  sizePreset: 'normal',
  text: 'Example',
  textItalic: false,
  textSize: getCheckboxTextSize('normal'),
  textTone: 'muted',
  uncheckedMark: 'none',
};

const DEFAULT_RADIO_BUTTON_STATE: RadioButtonWidgetState = {
  disabledA: false,
  disabledB: false,
  selected: 'a',
  showText: true,
  sizePreset: 'normal',
  textA: 'Option A',
  textB: 'Option B',
  textItalic: false,
  textSize: getRadioButtonTextSize('normal'),
  textTone: 'muted',
};

const DEFAULT_FIELDSET_STATE: FieldsetWidgetState = {
  borderTone: 'default',
  label: 'Label:',
  legendItalic: false,
  legendSizePreset: 'thin',
  legendTone: 'muted',
  selected: 'a',
};

const DEFAULT_PROGRESS_STATE: ProgressBarWidgetState = {
  showText: true,
  sizePreset: 'normal',
  textItalic: false,
  textSize: getProgressBarTextSize('normal'),
  textTone: 'muted',
  tone: 'primary',
  value: 0.42,
};

const DEFAULT_SPINNER_STATE: SpinnerWidgetState = {
  reserveTextSpace: false,
  showText: true,
  sizePreset: 'normal',
  text: 'Loading…',
  textItalic: false,
  textSize: getSpinnerTextSize('normal'),
  textTone: 'muted',
  tone: 'primary',
};

const DEFAULT_STEPPER_STATE: StepperWidgetState = {
  disabled: false,
  max: undefined,
  min: undefined,
  shape: 'rounded',
  sizePreset: 'normal',
  step: 1,
  suffix: '',
  textAlign: 'center',
  textItalic: false,
  textSize: getStepperTextSize('normal'),
  textTone: undefined,
  value: 10,
};

const DEFAULT_SWITCH_STATE: SwitchWidgetState = {
  checked: true,
  disabled: false,
  showText: true,
  sizePreset: 'normal',
  text: 'Switch',
  textItalic: false,
  textSize: getSwitchTextSize('normal'),
  textTone: 'muted',
  tone: 'primary',
};

const DEFAULT_TOAST_STATE: ToastWidgetState = {
  message: 'Very important message',
  sizePreset: 'normal',
  textItalic: false,
  textSize: getToastTextSize('normal'),
  textTone: 'default',
  tone: 'success',
};

const DEFAULT_SEGMENT_BUTTON_STATE: SegmentButtonWidgetState = {
  centerDisabled: false,
  centerIconFill: 'default',
  centerIconKey: 'settings',
  centerIconPosition: 'end',
  centerText: 'Change',
  centerTextTone: 'success',
  centerTone: 'default',
  centerWithIcon: false,
  leftDisabled: false,
  leftIconFill: 'default',
  leftIconKey: 'search',
  leftIconPosition: 'start',
  leftText: 'Select',
  leftTextTone: 'default',
  leftTone: 'default',
  leftWithIcon: false,
  rightDisabled: false,
  rightIconFill: 'default',
  rightIconKey: 'close',
  rightIconPosition: 'end',
  rightText: 'Delete',
  rightTextTone: 'danger',
  rightTone: 'default',
  rightWithIcon: false,
  segmentCount: '2',
  shape: 'rounded',
  sizePreset: 'normal',
  textItalic: false,
  textSize: getSegmentButtonTextSize('normal'),
};

const DEFAULT_TAG_STATE: TagWidgetState = {
  borderTone: 'default',
  dotTone: 'default',
  shape: 'pill',
  showBorder: true,
  showDot: true,
  showText: true,
  sizePreset: 'small',
  text: 'Tag',
  textItalic: false,
  textSize: getTagTextSize('tiny'),
  textTone: 'default',
  tinted: false,
  tone: 'primary',
};

const DEFAULT_TABLE_STATE: TableWidgetState = {
  checkable: true,
  continuousNumbering: false,
  editable: true,
  hoverHighlight: true,
  showBorder: true,
  showIndexColumn: true,
  separateCheckboxColumn: false,
  sizePreset: 'normal',
  striped: true,
};

const DEFAULT_MODAL_STATE: ModalWidgetState = {
  background: 'surface',
  showSubtitle: false,
  sizePreset: 'normal',
  subtitle: 'Subtitle text',
  subtitleAlign: 'start',
  subtitleSizePreset: 'thin',
  subtitleTone: 'muted',
  title: 'Modal title',
  titleAlign: 'start',
  titleSizePreset: 'bold',
  titleTone: DEFAULT_TONE,
};

const DEFAULT_CARD_STATE: CardWidgetState = {
  background: 'surface',
  headerActions: [
    {
      disabled: false,
      iconKey: 'copy',
      iconPadding: getIconPadding(CARD_HEADER_ACTION_SIZE_PRESET),
    },
  ],
  title: 'Card title',
  showSubtitle: true,
  subtitle: 'Subtitle text',
  subtitleAlign: 'start',
  subtitleSizePreset: 'normal',
  subtitleTone: 'muted',
  titleAlign: 'start',
  titleSizePreset: 'bold',
  titleTone: DEFAULT_TONE,
};

const DEFAULT_TEXT_STATE: TextWidgetState = {
  align: undefined,
  children: 'Sample text line long enough to show ellipsis in the demo',
  ellipsis: false,
  italic: false,
  sizePreset: 'normal',
  tone: DEFAULT_TONE,
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

function validateDemoRange(value: RangeValue): null | string {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from !== '' && to !== '' && Number(from) > Number(to)) {
    return 'From must not exceed To.';
  }

  return null;
}

export function ShowcasePage() {
  /* autoHide хедера живёт в каркасе. ДС лишь даёт витрину-переключатель (см. header-settings). */
  const { showToast } = useToast();
  const { autoHide, isHeaderSettingsOpen, setAutoHide, setIsHeaderSettingsOpen } =
    useShellOutletContext();
  const [activeSettings, setActiveSettings] = useState<null | WidgetSettingsKey>(null);
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
  const [dateRangeInput, setDateRangeInput] = useState<DateRangeInputWidgetState>(
    DEFAULT_DATE_RANGE_INPUT_STATE
  );
  const [checkbox, setCheckbox] = useState<CheckboxWidgetState>(DEFAULT_CHECKBOX_STATE);
  const [radioButton, setRadioButton] = useState<RadioButtonWidgetState>(
    DEFAULT_RADIO_BUTTON_STATE
  );
  const [fieldset, setFieldset] = useState<FieldsetWidgetState>(DEFAULT_FIELDSET_STATE);
  const [progress, setProgress] =
    useState<ProgressBarWidgetState>(DEFAULT_PROGRESS_STATE);
  const [spinner, setSpinner] = useState<SpinnerWidgetState>(DEFAULT_SPINNER_STATE);
  const [stepper, setStepper] = useState<StepperWidgetState>(DEFAULT_STEPPER_STATE);
  const [switchState, setSwitchState] =
    useState<SwitchWidgetState>(DEFAULT_SWITCH_STATE);
  const [toast, setToast] = useState<ToastWidgetState>(DEFAULT_TOAST_STATE);
  const [segmentButton, setSegmentButton] = useState<SegmentButtonWidgetState>(
    DEFAULT_SEGMENT_BUTTON_STATE
  );
  const [tag, setTag] = useState<TagWidgetState>(DEFAULT_TAG_STATE);
  const [table, setTable] = useState<TableWidgetState>(DEFAULT_TABLE_STATE);
  const [modal, setModal] = useState<ModalWidgetState>(DEFAULT_MODAL_STATE);
  const [card, setCard] = useState<CardWidgetState>(DEFAULT_CARD_STATE);
  const [text, setText] = useState<TextWidgetState>(DEFAULT_TEXT_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Витрина хедера приоритетна и при открытии сбрасывает выбранный виджет — один источник
     истины о содержимом сайдбара (иначе карточка виджета осталась бы aria-expanded под ней). */
  const [prevIsHeaderSettingsOpen, setPrevIsHeaderSettingsOpen] =
    useState(isHeaderSettingsOpen);
  if (isHeaderSettingsOpen !== prevIsHeaderSettingsOpen) {
    setPrevIsHeaderSettingsOpen(isHeaderSettingsOpen);

    if (isHeaderSettingsOpen) {
      setActiveSettings(null);
    }
  }

  const isSettingsOpen = activeSettings !== null;
  /* Витрина хедера и настройки виджета делят один сайдбар, но не показываются вместе. */
  const isPanelOpen = isSettingsOpen || isHeaderSettingsOpen;
  const panelTitle = isHeaderSettingsOpen
    ? 'Header'
    : activeSettings
      ? SETTINGS_TITLES[activeSettings]
      : undefined;

  function activateSettings(target: WidgetSettingsKey): void {
    if (!isPanelOpen) {
      return;
    }

    setIsHeaderSettingsOpen(false);
    setActiveSettings(target);
  }

  function toggleSettings(target: WidgetSettingsKey): void {
    setIsHeaderSettingsOpen(false);
    setActiveSettings((current) => (current === target ? null : target));
  }

  function closePanel(): void {
    setActiveSettings(null);
    setIsHeaderSettingsOpen(false);
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
    () => (combobox.withIcon ? COMBOBOX_OPTIONS : (LIST_OPTIONS as ComboboxOption[])),
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

  function updateProgress<K extends keyof ProgressBarWidgetState>(
    key: K,
    value: ProgressBarWidgetState[K]
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

  function updateTable<K extends keyof TableWidgetState>(
    key: K,
    value: TableWidgetState[K]
  ): void {
    setTable((current) => ({ ...current, [key]: value }));
  }

  function updateModal<K extends keyof ModalWidgetState>(
    key: K,
    value: ModalWidgetState[K]
  ): void {
    setModal((current) => ({ ...current, [key]: value }));
  }

  function updateCard<K extends keyof CardWidgetState>(
    key: K,
    value: CardWidgetState[K]
  ): void {
    setCard((current) => ({ ...current, [key]: value }));
  }

  function updateText<K extends keyof TextWidgetState>(
    key: K,
    value: TextWidgetState[K]
  ): void {
    setText((current) => ({ ...current, [key]: value }));
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

    if (activeSettings === 'table') {
      return <TableSettings state={table} onChange={updateTable} />;
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
      return <ProgressBarSettings state={progress} onChange={updateProgress} />;
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

    if (activeSettings === 'modal') {
      return <ModalSettings state={modal} onChange={updateModal} />;
    }

    if (activeSettings === 'card') {
      return <CardSettings state={card} onChange={updateCard} />;
    }

    if (activeSettings === 'text') {
      return <TextSettings state={text} onChange={updateText} />;
    }

    return null;
  }

  /**
   * Общий скелет карточки виджета в витрине.
   *
   * Копируется в продукт: `Card as="article"`, `aria-labelledby`, `titleId`, `headerActions`
   * (если нужны действия в шапке) и содержимое `children`.
   *
   * Только дизайн-система: `onClick` на карточке (активация сайдбара настроек), `ariaControls` /
   * `ariaExpanded` на кнопке настроек, иконка `SettingsIcon` с `toggleSettings`. Не переносить
   * эту обвязку в продуктовый код.
   */
  function renderWidgetCard(
    widgetKey: WidgetSettingsKey,
    titleId: string,
    children: ReactNode,
    fullRow = false
  ): ReactNode {
    const open = activeSettings === widgetKey;

    const card = (
      <Card
        aria-labelledby={titleId}
        as="article"
        background="surface"
        headerActions={[
          {
            ariaControls: SIDEBAR_ID,
            ariaExpanded: open,
            ariaLabel: open ? 'Close settings' : 'Open settings',
            icon: <SettingsIcon />,
            onClick: () => toggleSettings(widgetKey),
          },
        ]}
        maxBlockSize={fullRow ? '100%' : undefined}
        minBlockSize={fullRow ? '0' : undefined}
        title={SETTINGS_TITLES[widgetKey]}
        titleId={titleId}
        onClick={() => activateSettings(widgetKey)}
      >
        {children}
      </Card>
    );

    if (fullRow) {
      return <StyledShowcaseWidgetFullRow>{card}</StyledShowcaseWidgetFullRow>;
    }

    return card;
  }

  return (
    <StyledMain>
      <Sidebar
        id={SIDEBAR_ID}
        open={isPanelOpen}
        sidebarContent={
          <ScrollPort paddingBlockEnd={16}>
            {(isHeaderSettingsOpen && (
              <HeaderSettings autoHide={autoHide} onChange={setAutoHide} />
            )) ||
              renderSettingsPanel()}
          </ScrollPort>
        }
        title={panelTitle}
        onClose={closePanel}
      >
        {/* 100% от зоны контента Sidebar (definite-высота от капа StyledMain):
            скролл остаётся внутри ScrollPort карточки, а не на зоне.
            Block-padding Card → ScrollPort: тень виджетов влезает в клип скролла,
            сумма по вертикали по-прежнему 16. */}
        <Card as="section" maxBlockSize="100%" paddingBlock={0}>
          <ScrollPort paddingBlock={16}>
            <StyledShowcaseWidgets>
              {renderWidgetCard(
                'table',
                TABLE_WIDGET_TITLE_ID,
                <TableDemo settings={table} />,
                true
              )}

              {renderWidgetCard(
                'modal',
                MODAL_WIDGET_TITLE_ID,
                <>
                  <Button
                    alignSelf="center"
                    tone="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open modal
                  </Button>
                  <Modal
                    background={modal.background}
                    inlineSize={MODAL_INLINE_SIZE[modal.sizePreset]}
                    open={isModalOpen}
                    subtitle={modal.showSubtitle ? modal.subtitle : undefined}
                    subtitleAlign={modal.subtitleAlign}
                    subtitleSizePreset={modal.subtitleSizePreset}
                    subtitleTone={modal.subtitleTone}
                    title={modal.title}
                    titleAlign={modal.titleAlign}
                    titleSizePreset={modal.titleSizePreset}
                    titleTone={modal.titleTone}
                    onClose={() => setIsModalOpen(false)}
                  >
                    Place your content here
                  </Modal>
                </>
              )}

              {renderWidgetCard(
                'card',
                CARD_WIDGET_TITLE_ID,
                <Card
                  background={card.background}
                  headerActions={card.headerActions.map((action) => ({
                    ariaLabel: action.iconKey,
                    disabled: action.disabled,
                    icon: getIcon(action.iconKey),
                    iconPadding: action.iconPadding,
                    onClick: () => undefined,
                  }))}
                  subtitle={card.showSubtitle ? card.subtitle : undefined}
                  subtitleAlign={card.subtitleAlign}
                  subtitleSizePreset={card.subtitleSizePreset}
                  subtitleTone={card.subtitleTone}
                  title={card.title}
                  titleAlign={card.titleAlign}
                  titleSizePreset={card.titleSizePreset}
                  titleTone={card.titleTone}
                />
              )}

              {renderWidgetCard(
                'text',
                TEXT_WIDGET_TITLE_ID,
                <StyledTextDemo>
                  <Text
                    align={text.align}
                    ellipsis={text.ellipsis}
                    italic={text.italic}
                    sizePreset={text.sizePreset}
                    tone={text.tone}
                  >
                    {text.children}
                  </Text>
                </StyledTextDemo>
              )}

              {renderWidgetCard(
                'input',
                INPUT_WIDGET_TITLE_ID,
                <Input
                  alignSelf="center"
                  disabled={input.disabled}
                  error={input.error || undefined}
                  errorAlign={input.errorAlign}
                  errorItalic={input.errorItalic}
                  invalid={input.invalid}
                  label={input.label || undefined}
                  placeholder={input.placeholder}
                  reserveErrorSpace={input.reserveErrorSpace}
                  shape={input.shape}
                  showBorder={input.showBorder}
                  sizePreset={input.sizePreset}
                  textAlign={input.textAlign}
                  textItalic={input.textItalic}
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
                  iconFill={listbox.iconFill}
                  iconPosition={listbox.iconPosition}
                  iconTone={listbox.iconTone}
                  inlineCheckbox={listbox.inlineCheckbox}
                  label={listbox.label || undefined}
                  multiple={listbox.multiple}
                  options={LISTBOX_DEMO_OPTIONS}
                  placeholder={listbox.placeholder}
                  reserveErrorSpace={listbox.reserveErrorSpace}
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
                  emptyMessage={combobox.emptyMessage}
                  iconFill={combobox.iconFill}
                  iconPosition={combobox.iconPosition}
                  iconTone={combobox.iconTone}
                  label={combobox.label || undefined}
                  options={comboboxDemoOptions}
                  placeholder={combobox.placeholder}
                  reserveErrorSpace={combobox.reserveErrorSpace}
                  searchPlaceholder={combobox.searchPlaceholder}
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
                  buttonTextTone={rangeInput.buttonTextTone}
                  buttonTone={rangeInput.buttonTone}
                  disabled={rangeInput.disabled}
                  formatActiveLabel={formatDemoRangeLabel}
                  fromPlaceholder={rangeInput.fromPlaceholder}
                  iconFill={rangeInput.iconFill}
                  iconPosition={rangeInput.iconPosition}
                  iconTone={rangeInput.iconTone}
                  inputShape={rangeInput.inputShape}
                  inputSizePreset={rangeInput.inputSizePreset}
                  label={rangeInput.label || undefined}
                  placeholder={rangeInput.placeholder}
                  reserveErrorSpace={rangeInput.reserveErrorSpace}
                  shape={rangeInput.shape}
                  sizePreset={rangeInput.sizePreset}
                  title={rangeInput.title}
                  titleAlign={rangeInput.titleAlign}
                  titleSizePreset={rangeInput.titleSizePreset}
                  titleTone={rangeInput.titleTone}
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
                'date-range-input',
                DATE_RANGE_INPUT_WIDGET_TITLE_ID,
                <DateRangeInput
                  alignSelf="center"
                  disabled={dateRangeInput.disabled}
                  endDay={dateRangeInput.endDay}
                  endLabel={dateRangeInput.endLabel}
                  maxDay={dateRangeInput.maxDay || undefined}
                  minDay={dateRangeInput.minDay || undefined}
                  shape={dateRangeInput.shape}
                  sizePreset={dateRangeInput.sizePreset}
                  startDay={dateRangeInput.startDay}
                  startLabel={dateRangeInput.startLabel}
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
                  icon={button.withIcon ? getIcon(button.iconKey) : undefined}
                  iconFill={button.withIcon ? button.iconFill : undefined}
                  iconPosition={button.iconPosition}
                  iconTone={button.withIcon ? button.iconTone : undefined}
                  shape={button.shape}
                  sizePreset={button.sizePreset}
                  textItalic={button.textItalic}
                  textSize={button.textSize}
                  textTone={button.textTone}
                  tone={button.tone}
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
                  iconFill={roundButton.iconFill}
                  iconPadding={roundButton.iconPadding}
                  iconTone={roundButton.iconTone}
                  placeSelf="center"
                  showBorder={roundButton.showBorder}
                  sizePreset={roundButton.sizePreset}
                >
                  {getIcon(roundButton.iconKey)}
                </RoundButton>
              )}

              {renderWidgetCard(
                'segment-button',
                SEGMENT_BUTTON_WIDGET_TITLE_ID,
                <SegmentButton
                  alignSelf="center"
                  center={
                    segmentButton.segmentCount === '3'
                      ? {
                          disabled: segmentButton.centerDisabled,
                          icon: segmentButton.centerWithIcon
                            ? getIcon(segmentButton.centerIconKey)
                            : undefined,
                          iconFill: segmentButton.centerWithIcon
                            ? segmentButton.centerIconFill
                            : undefined,
                          iconPosition: segmentButton.centerIconPosition,
                          text: segmentButton.centerText,
                          textTone: segmentButton.centerTextTone,
                          tone: segmentButton.centerTone,
                        }
                      : undefined
                  }
                  left={{
                    disabled: segmentButton.leftDisabled,
                    icon: segmentButton.leftWithIcon
                      ? getIcon(segmentButton.leftIconKey)
                      : undefined,
                    iconFill: segmentButton.leftWithIcon
                      ? segmentButton.leftIconFill
                      : undefined,
                    iconPosition: segmentButton.leftIconPosition,
                    text: segmentButton.leftText,
                    textTone: segmentButton.leftTextTone,
                    tone: segmentButton.leftTone,
                  }}
                  right={{
                    disabled: segmentButton.rightDisabled,
                    icon: segmentButton.rightWithIcon
                      ? getIcon(segmentButton.rightIconKey)
                      : undefined,
                    iconFill: segmentButton.rightWithIcon
                      ? segmentButton.rightIconFill
                      : undefined,
                    iconPosition: segmentButton.rightIconPosition,
                    text: segmentButton.rightText,
                    textTone: segmentButton.rightTextTone,
                    tone: segmentButton.rightTone,
                  }}
                  shape={segmentButton.shape}
                  sizePreset={segmentButton.sizePreset}
                  textItalic={segmentButton.textItalic}
                  textSize={segmentButton.textSize}
                />
              )}

              {renderWidgetCard(
                'tag',
                TAG_WIDGET_TITLE_ID,
                <Tag
                  borderTone={tag.borderTone}
                  dotTone={tag.dotTone}
                  placeSelf="center"
                  shape={tag.shape}
                  showBorder={tag.showBorder}
                  showDot={tag.showDot}
                  sizePreset={tag.sizePreset}
                  textItalic={tag.textItalic}
                  textSize={tag.textSize}
                  textTone={tag.textTone}
                  tinted={tag.tinted}
                  tone={tag.tone}
                >
                  {tag.showText && tag.text}
                </Tag>
              )}

              {renderWidgetCard(
                'checkbox',
                CHECKBOX_WIDGET_TITLE_ID,
                <Checkbox
                  checked={checkbox.checked}
                  checkedMark={checkbox.checkedMark}
                  disabled={checkbox.disabled}
                  inverted={checkbox.inverted}
                  placeSelf="center"
                  sizePreset={checkbox.sizePreset}
                  textItalic={checkbox.textItalic}
                  textSize={checkbox.textSize}
                  textTone={checkbox.textTone}
                  uncheckedMark={checkbox.uncheckedMark}
                  onChange={(event) => updateCheckbox('checked', event.target.checked)}
                >
                  {checkbox.showText && checkbox.text}
                </Checkbox>
              )}

              {renderWidgetCard(
                'radio-button',
                RADIO_BUTTON_WIDGET_TITLE_ID,
                <StyledRadioButtonDemo>
                  <RadioButton
                    checked={radioButton.selected === 'a'}
                    disabled={radioButton.disabledA}
                    name={RADIO_BUTTON_DEMO_NAME}
                    sizePreset={radioButton.sizePreset}
                    textItalic={radioButton.textItalic}
                    textSize={radioButton.textSize}
                    textTone={radioButton.textTone}
                    value="a"
                    onChange={() => updateRadioButton('selected', 'a')}
                  >
                    {radioButton.showText && radioButton.textA}
                  </RadioButton>
                  <RadioButton
                    checked={radioButton.selected === 'b'}
                    disabled={radioButton.disabledB}
                    name={RADIO_BUTTON_DEMO_NAME}
                    sizePreset={radioButton.sizePreset}
                    textItalic={radioButton.textItalic}
                    textSize={radioButton.textSize}
                    textTone={radioButton.textTone}
                    value="b"
                    onChange={() => updateRadioButton('selected', 'b')}
                  >
                    {radioButton.showText && radioButton.textB}
                  </RadioButton>
                </StyledRadioButtonDemo>
              )}

              {renderWidgetCard(
                'fieldset',
                FIELDSET_WIDGET_TITLE_ID,
                <StyledFieldsetDemo>
                  <Fieldset
                    borderTone={fieldset.borderTone}
                    label={fieldset.label}
                    legendItalic={fieldset.legendItalic}
                    legendSizePreset={fieldset.legendSizePreset}
                    legendTone={fieldset.legendTone}
                  >
                    <RadioButton
                      checked={fieldset.selected === 'a'}
                      name={FIELDSET_DEMO_NAME}
                      value="a"
                      onChange={() => updateFieldset('selected', 'a')}
                    >
                      Option A
                    </RadioButton>
                    <RadioButton
                      checked={fieldset.selected === 'b'}
                      name={FIELDSET_DEMO_NAME}
                      value="b"
                      onChange={() => updateFieldset('selected', 'b')}
                    >
                      Option B
                    </RadioButton>
                  </Fieldset>
                </StyledFieldsetDemo>
              )}

              {renderWidgetCard(
                'progress',
                PROGRESS_WIDGET_TITLE_ID,
                <ProgressBar
                  aria-labelledby={PROGRESS_WIDGET_TITLE_ID}
                  showText={progress.showText}
                  sizePreset={progress.sizePreset}
                  textItalic={progress.textItalic}
                  textSize={progress.textSize}
                  textTone={progress.textTone}
                  tone={progress.tone}
                  value={progress.value}
                />
              )}

              {renderWidgetCard(
                'spinner',
                SPINNER_WIDGET_TITLE_ID,
                <StyledSpinnerDemo>
                  <Spinner
                    reserveTextSpace={spinner.reserveTextSpace}
                    sizePreset={spinner.sizePreset}
                    textItalic={spinner.textItalic}
                    textSize={spinner.textSize}
                    textTone={spinner.textTone}
                    tone={spinner.tone}
                  >
                    {spinner.showText && spinner.text}
                  </Spinner>
                </StyledSpinnerDemo>
              )}

              {renderWidgetCard(
                'stepper',
                STEPPER_WIDGET_TITLE_ID,
                <Stepper
                  alignSelf="center"
                  aria-label="Demo stepper"
                  disabled={stepper.disabled}
                  max={stepper.max}
                  min={stepper.min}
                  shape={stepper.shape}
                  sizePreset={stepper.sizePreset}
                  step={stepper.step}
                  suffix={stepper.suffix}
                  textAlign={stepper.textAlign}
                  textItalic={stepper.textItalic}
                  textSize={stepper.textSize}
                  textTone={stepper.textTone}
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
                  placeSelf="center"
                  sizePreset={switchState.sizePreset}
                  textItalic={switchState.textItalic}
                  textSize={switchState.textSize}
                  textTone={switchState.textTone}
                  tone={switchState.tone}
                  onChange={(event) => updateSwitch('checked', event.target.checked)}
                >
                  {switchState.showText && switchState.text}
                </Switch>
              )}

              {renderWidgetCard(
                'toast',
                TOAST_WIDGET_TITLE_ID,
                <>
                  <Toast
                    alignSelf="center"
                    sizePreset={toast.sizePreset}
                    textItalic={toast.textItalic}
                    textSize={toast.textSize}
                    textTone={toast.textTone}
                    tone={toast.tone}
                  >
                    {toast.message}
                  </Toast>
                  <Button
                    alignSelf="center"
                    tone="primary"
                    onClick={() =>
                      showToast({
                        message: toast.message,
                        sizePreset: toast.sizePreset,
                        textItalic: toast.textItalic,
                        textSize: toast.textSize,
                        textTone: toast.textTone,
                        tone: toast.tone,
                      })
                    }
                  >
                    Show toast
                  </Button>
                </>
              )}

              {/* Extension-only: smoke probe для Browser AI; не синкается в lite. */}
              <BrowserAiSmokeProbe />
            </StyledShowcaseWidgets>
          </ScrollPort>
        </Card>
      </Sidebar>
    </StyledMain>
  );
}
