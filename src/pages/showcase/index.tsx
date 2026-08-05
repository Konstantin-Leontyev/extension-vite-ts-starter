/**
 * Файл: `src/pages/showcase/index.tsx`
 * Предоставляет компонент ShowcasePage для отображения витрины дизайн-системы.
 * Содержит превью виджетов, начальные состояния настроек и синхронизацию с Sidebar.
 *
 * Основные задачи:
 * 1. Экспортировать компонент ShowcasePage
 * 2. Собрать превью виджетов и синхронизацию с панелями настроек в Sidebar
 *
 * Потребители:
 *  - `src/components/router/router.tsx` — рендерит ShowcasePage как маршрут витрины
 */

import { useMemo, useState, type ReactNode } from 'react';

import { useShellOutletContext } from '@components/router';
import { useToast } from '@hooks/use-toast';
import { SettingsIcon } from '@icons';
import { Button, getButtonTextSize } from '@ui/button';
import { CARD_HEADER_ACTION_SIZE_PRESET, Card } from '@ui/card';
import { Checkbox, getCheckboxTextSize } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { DateRangeInput, todayUtc } from '@ui/date-range-input';
import { Fieldset } from '@ui/fieldset';
import { Icon, getIconPadding } from '@ui/icon';
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
import { ScrollPort } from '@ui/scroll-port';
import { SegmentButton, getSegmentButtonTextSize } from '@ui/segment-button';
import { Sidebar } from '@ui/sidebar';
import { Spinner, getSpinnerTextSize } from '@ui/spinner';
import { Stepper, getStepperTextSize } from '@ui/stepper';
import { Switch, getSwitchTextSize } from '@ui/switch';
import {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_SHOW_BORDER,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
} from '@ui/table';
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
import { IconSettings, type IconWidgetState } from './icon-settings';
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
  SegmentButtonSettings,
  type SegmentButtonWidgetState,
} from './segment-button-settings';
import { COMBOBOX_OPTIONS, LIST_OPTIONS, getIcon } from './showcase-icon-options';
import {
  StyledMain,
  StyledRadioButtonDemo,
  StyledShowcaseWidgetFullRow,
  StyledShowcaseWidgets,
} from './showcase.styles';
import { SpinnerSettings, type SpinnerWidgetState } from './spinner-settings';
import { StepperSettings, type StepperWidgetState } from './stepper-settings';
import { SwitchSettings, type SwitchWidgetState } from './switch-settings';
import { TableDemo } from './table-demo';
import { TableSettings, type TableWidgetState } from './table-settings';
import { TagSettings, type TagWidgetState } from './tag-settings';
import { TextSettings, type TextWidgetState } from './text-settings';
import { ToastSettings, type ToastWidgetState } from './toast-settings';

/**
 * SIDEBAR_ID — задаёт id боковой панели витрины.
 * Связывает кнопки настроек карточек с Sidebar через `aria-controls`.
 */
const SIDEBAR_ID = 'showcase-sidebar';

/**
 * INPUT_WIDGET_TITLE_ID — задаёт id заголовка виджета Input в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const INPUT_WIDGET_TITLE_ID = 'showcase-input-heading';

/**
 * BUTTON_WIDGET_TITLE_ID — задаёт id заголовка виджета Button в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const BUTTON_WIDGET_TITLE_ID = 'showcase-button-heading';

/**
 * ICON_WIDGET_TITLE_ID — задаёт id заголовка виджета Icon в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const ICON_WIDGET_TITLE_ID = 'showcase-icon-heading';

/**
 * LISTBOX_WIDGET_TITLE_ID — задаёт id заголовка виджета Listbox в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const LISTBOX_WIDGET_TITLE_ID = 'showcase-listbox-heading';

/**
 * COMBOBOX_WIDGET_TITLE_ID — задаёт id заголовка виджета Combobox в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const COMBOBOX_WIDGET_TITLE_ID = 'showcase-combobox-heading';

/**
 * RANGE_INPUT_WIDGET_TITLE_ID — задаёт id заголовка виджета RangeInput в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const RANGE_INPUT_WIDGET_TITLE_ID = 'showcase-range-input-heading';

/**
 * DATE_RANGE_INPUT_WIDGET_TITLE_ID — задаёт id заголовка виджета DateRangeInput в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const DATE_RANGE_INPUT_WIDGET_TITLE_ID = 'showcase-date-range-input-heading';

/**
 * CHECKBOX_WIDGET_TITLE_ID — задаёт id заголовка виджета Checkbox в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const CHECKBOX_WIDGET_TITLE_ID = 'showcase-checkbox-heading';

/**
 * RADIO_BUTTON_WIDGET_TITLE_ID — задаёт id заголовка виджета RadioButton в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const RADIO_BUTTON_WIDGET_TITLE_ID = 'showcase-radio-button-heading';

/**
 * FIELDSET_WIDGET_TITLE_ID — задаёт id заголовка виджета Fieldset в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const FIELDSET_WIDGET_TITLE_ID = 'showcase-fieldset-heading';

/**
 * PROGRESS_WIDGET_TITLE_ID — задаёт id заголовка виджета ProgressBar в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const PROGRESS_WIDGET_TITLE_ID = 'showcase-progress-heading';

/**
 * SPINNER_WIDGET_TITLE_ID — задаёт id заголовка виджета Spinner в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const SPINNER_WIDGET_TITLE_ID = 'showcase-spinner-heading';

/**
 * STEPPER_WIDGET_TITLE_ID — задаёт id заголовка виджета Stepper в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const STEPPER_WIDGET_TITLE_ID = 'showcase-stepper-heading';

/**
 * SEGMENT_BUTTON_WIDGET_TITLE_ID — задаёт id заголовка виджета SegmentButton в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const SEGMENT_BUTTON_WIDGET_TITLE_ID = 'showcase-segment-button-heading';

/**
 * TAG_WIDGET_TITLE_ID — задаёт id заголовка виджета Tag в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const TAG_WIDGET_TITLE_ID = 'showcase-tag-heading';

/**
 * TABLE_WIDGET_TITLE_ID — задаёт id заголовка виджета Table в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const TABLE_WIDGET_TITLE_ID = 'showcase-table-heading';

/**
 * SWITCH_WIDGET_TITLE_ID — задаёт id заголовка виджета Switch в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const SWITCH_WIDGET_TITLE_ID = 'showcase-switch-heading';

/**
 * TOAST_WIDGET_TITLE_ID — задаёт id заголовка виджета Toast в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const TOAST_WIDGET_TITLE_ID = 'showcase-toast-heading';

/**
 * MODAL_WIDGET_TITLE_ID — задаёт id заголовка виджета Modal в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const MODAL_WIDGET_TITLE_ID = 'showcase-modal-heading';

/**
 * CARD_WIDGET_TITLE_ID — задаёт id заголовка виджета Card в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const CARD_WIDGET_TITLE_ID = 'showcase-card-heading';

/**
 * TEXT_WIDGET_TITLE_ID — задаёт id заголовка виджета Text в витрине.
 * Используется в `aria-labelledby` карточки и как `titleId` виджета.
 */
const TEXT_WIDGET_TITLE_ID = 'showcase-text-heading';

/**
 * RADIO_BUTTON_DEMO_NAME — задаёт name группы RadioButton в демо-превью.
 * Связывает варианты A и B одной группой выбора.
 */
const RADIO_BUTTON_DEMO_NAME = 'showcase-radio-button-demo';

/**
 * FIELDSET_DEMO_NAME — задаёт name группы переключателей внутри демо Fieldset.
 * Связывает варианты внутри Fieldset одной группой выбора.
 */
const FIELDSET_DEMO_NAME = 'showcase-fieldset-demo';

/**
 * TEXT_DEMO_INLINE_SIZE — задаёт узкую фиксированную ширину демо Text.
 * Используется для демонстрации обрезки длинной строки в виджете Text.
 */
const TEXT_DEMO_INLINE_SIZE = '12rem';

/**
 * WidgetSettingsKey — представляет ключ активной панели настроек виджета в витрине.
 */
type WidgetSettingsKey =
  | 'button'
  | 'card'
  | 'checkbox'
  | 'combobox'
  | 'date-range-input'
  | 'fieldset'
  | 'icon'
  | 'input'
  | 'listbox'
  | 'modal'
  | 'progress'
  | 'radio-button'
  | 'range-input'
  | 'segment-button'
  | 'spinner'
  | 'stepper'
  | 'switch'
  | 'table'
  | 'tag'
  | 'text'
  | 'toast';

/**
 * SETTINGS_TITLES — связывает ключ панели настроек с заголовком Sidebar и карточки.
 * Используется в `ShowcasePage` для заголовка панели и `title` виджета.
 */
const SETTINGS_TITLES: Record<WidgetSettingsKey, string> = {
  input: 'Input',
  listbox: 'Listbox',
  combobox: 'Combobox',
  'range-input': 'Range input',
  'date-range-input': 'Date range',
  button: 'Button',
  icon: 'Icon',
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

/**
 * MODAL_INLINE_SIZE — хранит ширину демо Modal для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — CSS-длина для пропа `inlineSize`.
 */
const MODAL_INLINE_SIZE: Record<SizePreset, string> = {
  small: '20rem',
  normal: '28rem',
  large: '36rem',
};

/**
 * DEFAULT_INPUT_STATE — задаёт начальное состояние виджета Input в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_INPUT_STATE: InputWidgetState = {
  borderTone: 'neutral',
  disabled: false,
  error: '',
  invalid: false,
  label: 'Label:',
  placeholder: 'e.g. value',
  shape: 'rounded',
  showBorder: true,
  showShadow: true,
  sizePreset: 'normal',
  textAlign: undefined,
  textItalic: false,
  value: '',
};

/**
 * DEFAULT_BUTTON_STATE — задаёт начальное состояние виджета Button в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_BUTTON_STATE: ButtonWidgetState = {
  active: false,
  disabled: false,
  iconFill: 'neutral',
  iconKey: 'search',
  iconPosition: 'end',
  iconTone: 'neutral',
  label: 'Label:',
  shape: 'rounded',
  sizePreset: 'normal',
  text: 'Button',
  textItalic: false,
  textSize: getButtonTextSize('normal'),
  textTone: 'neutral',
  tone: 'neutral',
  withIcon: false,
};

/**
 * DEFAULT_ICON_STATE — задаёт начальное состояние виджета Icon в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_ICON_STATE: IconWidgetState = {
  borderTone: 'neutral',
  disabled: false,
  iconFill: 'neutral',
  iconKey: 'settings',
  iconTone: 'neutral',
  padding: getIconPadding('normal'),
  shape: 'square',
  showBorder: false,
  showHover: true,
  showShadow: true,
  sizePreset: 'normal',
};

/**
 * DEFAULT_LISTBOX_STATE — задаёт начальное состояние виджета Listbox в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_LISTBOX_STATE: ListboxWidgetState = {
  disabled: false,
  iconFill: 'neutral',
  iconPosition: 'end',
  iconTone: 'neutral',
  inlineCheckbox: false,
  label: 'Label:',
  multiple: false,
  placeholder: 'Select…',
  shape: 'rounded',
  showClear: false,
  sizePreset: 'normal',
  value: '',
};

/**
 * DEFAULT_COMBOBOX_STATE — задаёт начальное состояние виджета Combobox в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_COMBOBOX_STATE: ComboboxWidgetState = {
  disabled: false,
  emptyMessage: 'Nothing found',
  iconFill: 'neutral',
  iconPosition: 'end',
  iconTone: 'neutral',
  label: 'Label:',
  placeholder: 'Select…',
  searchPlaceholder: 'Search…',
  shape: 'rounded',
  showClear: false,
  sizePreset: 'normal',
  value: '',
  withIcon: false,
};

/**
 * DEFAULT_RANGE_INPUT_STATE — задаёт начальное состояние виджета RangeInput в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_RANGE_INPUT_STATE: RangeInputWidgetState = {
  buttonShape: 'rounded',
  buttonSizePreset: 'normal',
  buttonText: 'Apply',
  buttonTextTone: 'neutral',
  buttonTone: 'primary',
  disabled: false,
  fromPlaceholder: 'From',
  iconFill: 'neutral',
  iconPosition: 'end',
  iconTone: 'neutral',
  inputShape: 'rounded',
  inputSizePreset: 'normal',
  label: 'Label:',
  placeholder: 'Range: any',
  shape: 'rounded',
  sizePreset: 'normal',
  title: 'Custom range:',
  titleAlign: 'center',
  titleSizePreset: 'normal',
  titleTone: DEFAULT_TONE,
  toPlaceholder: 'To',
  validationMessages: { ...DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES },
  value: { from: '', to: '' },
  withClear: false,
};

/**
 * DEFAULT_DATE_RANGE_INPUT_STATE — задаёт начальное состояние виджета DateRangeInput в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_DATE_RANGE_INPUT_STATE: DateRangeInputWidgetState = {
  disabled: false,
  endDay: '',
  endLabel: 'End date',
  label: 'Label:',
  maxDay: todayUtc(),
  minDay: '',
  shape: 'rounded',
  sizePreset: 'normal',
  startDay: '',
  startLabel: 'Start date',
};

/**
 * DEFAULT_CHECKBOX_STATE — задаёт начальное состояние виджета Checkbox в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
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

/**
 * DEFAULT_RADIO_BUTTON_STATE — задаёт начальное состояние виджета RadioButton в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
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

/**
 * DEFAULT_FIELDSET_STATE — задаёт начальное состояние виджета Fieldset в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_FIELDSET_STATE: FieldsetWidgetState = {
  borderTone: 'neutral',
  label: 'Label:',
  legendItalic: false,
  legendSizePreset: 'thin',
  legendTone: 'muted',
  selected: 'a',
};

/**
 * DEFAULT_PROGRESS_STATE — задаёт начальное состояние виджета ProgressBar в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_PROGRESS_STATE: ProgressBarWidgetState = {
  showText: true,
  sizePreset: 'normal',
  textItalic: false,
  textSize: getProgressBarTextSize('normal'),
  textTone: 'muted',
  tone: 'primary',
  value: 0.42,
};

/**
 * DEFAULT_SPINNER_STATE — задаёт начальное состояние виджета Spinner в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
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

/**
 * DEFAULT_STEPPER_STATE — задаёт начальное состояние виджета Stepper в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_STEPPER_STATE: StepperWidgetState = {
  disabled: false,
  label: 'Label:',
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

/**
 * DEFAULT_SWITCH_STATE — задаёт начальное состояние виджета Switch в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
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

/**
 * DEFAULT_TOAST_STATE — задаёт начальное состояние виджета Toast в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TOAST_STATE: ToastWidgetState = {
  message: 'Very important message',
  sizePreset: 'normal',
  textItalic: false,
  textSize: getToastTextSize('normal'),
  textTone: 'neutral',
  tone: 'success',
};

/**
 * DEFAULT_SEGMENT_BUTTON_STATE — задаёт начальное состояние виджета SegmentButton в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_SEGMENT_BUTTON_STATE: SegmentButtonWidgetState = {
  centerActive: false,
  centerDisabled: false,
  centerIconFill: 'neutral',
  centerIconKey: 'settings',
  centerIconPosition: 'end',
  centerLabel: 'Change',
  centerTextTone: 'success',
  centerTone: 'neutral',
  centerWithIcon: false,
  label: 'Label:',
  leftActive: false,
  leftDisabled: false,
  leftIconFill: 'neutral',
  leftIconKey: 'search',
  leftIconPosition: 'start',
  leftLabel: 'Select',
  leftTextTone: 'neutral',
  leftTone: 'neutral',
  leftWithIcon: false,
  rightActive: false,
  rightDisabled: false,
  rightIconFill: 'neutral',
  rightIconKey: 'close',
  rightIconPosition: 'end',
  rightLabel: 'Delete',
  rightTextTone: 'danger',
  rightTone: 'neutral',
  rightWithIcon: false,
  segmentCount: '2',
  shape: 'rounded',
  sizePreset: 'normal',
  textItalic: false,
  textSize: getSegmentButtonTextSize('normal'),
};

/**
 * DEFAULT_TAG_STATE — задаёт начальное состояние виджета Tag в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TAG_STATE: TagWidgetState = {
  borderTone: 'neutral',
  dotTone: 'neutral',
  shape: 'pill',
  showBorder: true,
  showDot: true,
  showShadow: true,
  showText: true,
  sizePreset: 'tiny',
  text: 'Tag',
  textItalic: false,
  textSize: getTagTextSize('tiny'),
  textTone: 'neutral',
  tinted: false,
  tone: 'primary',
};

/**
 * DEFAULT_TABLE_STATE — задаёт начальное состояние виджета Table в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TABLE_STATE: TableWidgetState = {
  checkable: true,
  continuousNumbering: false,
  editable: true,
  hoverHighlight: DEFAULT_TABLE_HOVER_HIGHLIGHT,
  separateCheckboxColumn: false,
  showBorder: DEFAULT_TABLE_SHOW_BORDER,
  showIndexColumn: true,
  sizePreset: DEFAULT_TABLE_SIZE_PRESET,
  striped: DEFAULT_TABLE_STRIPED,
};

/**
 * DEFAULT_MODAL_STATE — задаёт начальное состояние виджета Modal в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_MODAL_STATE: ModalWidgetState = {
  background: 'surface',
  showSubtitle: true,
  sizePreset: 'normal',
  subtitle: 'Modal subtitle',
  subtitleTone: 'muted',
  title: 'Modal title',
  titleSizePreset: 'bold',
  titleTone: DEFAULT_TONE,
};

/**
 * DEFAULT_CARD_STATE — задаёт начальное состояние виджета Card в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_CARD_STATE: CardWidgetState = {
  background: 'surface',
  borderTone: 'neutral',
  headerActions: [
    {
      disabled: false,
      iconKey: 'copy',
      iconPadding: getIconPadding(CARD_HEADER_ACTION_SIZE_PRESET),
    },
  ],
  showBorder: true,
  showShadow: true,
  title: 'Card title',
  showSubtitle: true,
  subtitle: 'Subtitle text',
  subtitleTone: 'muted',
  titleSizePreset: 'bold',
  titleTone: DEFAULT_TONE,
};

/**
 * DEFAULT_TEXT_STATE — задаёт начальное состояние виджета Text в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TEXT_STATE: TextWidgetState = {
  align: undefined,
  children: 'Sample text line long enough to show ellipsis in the demo',
  ellipsis: false,
  italic: false,
  sizePreset: 'normal',
  tone: DEFAULT_TONE,
};

/**
 * formatDemoRangeLabel — возвращает подпись активного диапазона для демо RangeInput.
 *
 * @param value текущее значение диапазона
 * @returns подпись вида `from–to`, `from+`, `≤to` или пустая строка
 */
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

/**
 * validateDemoRange — возвращает текст ошибки, когда `from` больше `to`.
 *
 * @param value текущее значение диапазона
 * @returns текст ошибки или `null`, когда диапазон допустим
 */
function validateDemoRange(value: RangeValue): null | string {
  const from = value.from.trim();
  const to = value.to.trim();

  if (from !== '' && to !== '' && Number(from) > Number(to)) {
    return 'From must not exceed To.';
  }

  return null;
}

/**
 * ShowcasePage — отображает витрину дизайн-системы с превью виджетов и панелью настроек.
 *
 * @example
 * <ShowcasePage />
 */
export function ShowcasePage() {
  // autoHide шапки живёт в каркасе. Витрина даёт только переключатель, см. header-settings.
  const { showToast } = useToast();
  const { autoHide, isHeaderSettingsOpen, setAutoHide, setIsHeaderSettingsOpen } =
    useShellOutletContext();
  const [activeSettings, setActiveSettings] = useState<null | WidgetSettingsKey>(null);
  const [input, setInput] = useState<InputWidgetState>(DEFAULT_INPUT_STATE);
  const [button, setButton] = useState<ButtonWidgetState>(DEFAULT_BUTTON_STATE);
  const [icon, setIcon] = useState<IconWidgetState>(DEFAULT_ICON_STATE);
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

  // Настройки шапки приоритетны: при открытии сбрасывают выбранный виджет, чтобы
  // Sidebar имел один источник содержимого. Иначе карточка виджета осталась бы
  // aria-expanded под панелью шапки.
  const [prevIsHeaderSettingsOpen, setPrevIsHeaderSettingsOpen] =
    useState(isHeaderSettingsOpen);
  if (isHeaderSettingsOpen !== prevIsHeaderSettingsOpen) {
    setPrevIsHeaderSettingsOpen(isHeaderSettingsOpen);

    if (isHeaderSettingsOpen) {
      setActiveSettings(null);
    }
  }

  const isSettingsOpen = activeSettings !== null;
  // Настройки шапки и настройки виджета делят один Sidebar, но не показываются вместе.
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

  function updateIcon<K extends keyof IconWidgetState>(
    key: K,
    value: IconWidgetState[K]
  ): void {
    setIcon((current) => ({ ...current, [key]: value }));
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
              : current.value
                ? [current.value]
                : []
            : Array.isArray(current.value)
              ? (current.value[0] ?? '')
              : current.value;

        if (value === false) {
          next.inlineCheckbox = false;
        }
      }

      if (key === 'inlineCheckbox' && value === true) {
        next.multiple = true;
        next.value = Array.isArray(current.value)
          ? current.value
          : current.value
            ? [current.value]
            : [];
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
    () => (combobox.withIcon ? COMBOBOX_OPTIONS : LIST_OPTIONS),
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

    if (activeSettings === 'icon') {
      return <IconSettings state={icon} onChange={updateIcon} />;
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
   * renderWidgetCard — возвращает карточку виджета витрины с общим скелетом Card.
   * В продукт копируются `Card as="article"`, `aria-labelledby`, `titleId`, `headerActions`
   * при действиях в шапке и содержимое `children`.
   * Только для витрины: `onClick` на карточке активирует панель настроек в Sidebar,
   * `ariaControls` и `ariaExpanded` на кнопке настроек, иконка SettingsIcon с
   * `toggleSettings`. Эту обвязку в продуктовый код не переносить.
   *
   * @param widgetKey ключ панели настроек виджета
   * @param titleId id заголовка карточки
   * @param children содержимое превью виджета
   * @param fullRow включает растяжение карточки на всю ширину сетки
   * @returns карточка виджета, при `fullRow` — в обёртке `StyledShowcaseWidgetFullRow`
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
        {/* Высота 100% от зоны контента Sidebar: definite-высота от max-block-size
            StyledMain. Скролл остаётся внутри ScrollPort карточки, а не на зоне.
            Block-padding перенесён с Card на ScrollPort: тень виджетов входит в
            область обрезки скролла, сумма отступов по вертикали по-прежнему 16. */}
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
                  borderTone={card.borderTone}
                  headerActions={card.headerActions.map((action) => ({
                    ariaLabel: action.iconKey,
                    disabled: action.disabled,
                    icon: getIcon(action.iconKey),
                    iconPadding: action.iconPadding,
                    onClick: () => undefined,
                  }))}
                  showBorder={card.showBorder}
                  showShadow={card.showShadow}
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
                <Text
                  align={text.align}
                  ellipsis={text.ellipsis}
                  inlineSize={TEXT_DEMO_INLINE_SIZE}
                  italic={text.italic}
                  minInlineSize="0"
                  placeSelf="center"
                  sizePreset={text.sizePreset}
                  tone={text.tone}
                >
                  {text.children}
                </Text>
              )}

              {renderWidgetCard(
                'input',
                INPUT_WIDGET_TITLE_ID,
                <Input
                  alignSelf="center"
                  borderTone={input.borderTone}
                  disabled={input.disabled}
                  error={input.error || undefined}
                  errorPlaceholder={input.errorPlaceholder}
                  invalid={input.invalid}
                  label={input.label || undefined}
                  placeholder={input.placeholder}
                  reserveErrorSpace={input.reserveErrorSpace}
                  shape={input.shape}
                  showBorder={input.showBorder}
                  showShadow={input.showShadow}
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
                  shape={listbox.shape}
                  showClear={listbox.showClear}
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
                  searchPlaceholder={combobox.searchPlaceholder}
                  shape={combobox.shape}
                  showClear={combobox.showClear}
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
                  errorPlaceholder={rangeInput.errorPlaceholder}
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
                  label={dateRangeInput.label || undefined}
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
                  label={button.label || undefined}
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
                'icon',
                ICON_WIDGET_TITLE_ID,
                <Icon
                  aria-label="Demo icon"
                  as="button"
                  borderTone={icon.borderTone}
                  disabled={icon.disabled}
                  iconFill={icon.iconFill}
                  iconTone={icon.iconTone}
                  padding={icon.padding}
                  placeSelf="center"
                  shape={icon.shape}
                  showBorder={icon.showBorder}
                  showHover={icon.showHover}
                  showShadow={icon.showShadow}
                  sizePreset={icon.sizePreset}
                >
                  {getIcon(icon.iconKey)}
                </Icon>
              )}

              {renderWidgetCard(
                'segment-button',
                SEGMENT_BUTTON_WIDGET_TITLE_ID,
                <SegmentButton
                  alignSelf="center"
                  center={
                    segmentButton.segmentCount === '3'
                      ? {
                          active: segmentButton.centerActive,
                          disabled: segmentButton.centerDisabled,
                          icon: segmentButton.centerWithIcon
                            ? getIcon(segmentButton.centerIconKey)
                            : undefined,
                          iconFill: segmentButton.centerWithIcon
                            ? segmentButton.centerIconFill
                            : undefined,
                          iconPosition: segmentButton.centerIconPosition,
                          label: segmentButton.centerLabel,
                          textTone: segmentButton.centerTextTone,
                          tone: segmentButton.centerTone,
                        }
                      : undefined
                  }
                  label={segmentButton.label || undefined}
                  left={{
                    active: segmentButton.leftActive,
                    disabled: segmentButton.leftDisabled,
                    icon: segmentButton.leftWithIcon
                      ? getIcon(segmentButton.leftIconKey)
                      : undefined,
                    iconFill: segmentButton.leftWithIcon
                      ? segmentButton.leftIconFill
                      : undefined,
                    iconPosition: segmentButton.leftIconPosition,
                    label: segmentButton.leftLabel,
                    textTone: segmentButton.leftTextTone,
                    tone: segmentButton.leftTone,
                  }}
                  right={{
                    active: segmentButton.rightActive,
                    disabled: segmentButton.rightDisabled,
                    icon: segmentButton.rightWithIcon
                      ? getIcon(segmentButton.rightIconKey)
                      : undefined,
                    iconFill: segmentButton.rightWithIcon
                      ? segmentButton.rightIconFill
                      : undefined,
                    iconPosition: segmentButton.rightIconPosition,
                    label: segmentButton.rightLabel,
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
                  showShadow={tag.showShadow}
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
                <Fieldset
                  alignSelf="center"
                  borderTone={fieldset.borderTone}
                  inlineSize="100%"
                  label={fieldset.label}
                  legendItalic={fieldset.legendItalic}
                  legendSizePreset={fieldset.legendSizePreset}
                  legendTone={fieldset.legendTone}
                  minInlineSize="0"
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
                <Spinner
                  minBlockSize="0"
                  placeSelf="center"
                  reserveTextSpace={spinner.reserveTextSpace}
                  sizePreset={spinner.sizePreset}
                  textItalic={spinner.textItalic}
                  textSize={spinner.textSize}
                  textTone={spinner.textTone}
                  tone={spinner.tone}
                >
                  {spinner.showText && spinner.text}
                </Spinner>
              )}

              {renderWidgetCard(
                'stepper',
                STEPPER_WIDGET_TITLE_ID,
                <Stepper
                  alignSelf="center"
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
                  {...(stepper.label.trim()
                    ? { label: stepper.label }
                    : { 'aria-label': 'Demo stepper' })}
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

              {/* Только extension: smoke probe Browser AI в витрине. В lite не синхронизируется. */}
              <BrowserAiSmokeProbe />
            </StyledShowcaseWidgets>
          </ScrollPort>
        </Card>
      </Sidebar>
    </StyledMain>
  );
}
