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

import { useState, type ReactNode } from 'react';

import { useShellOutletContext } from '@components/router';
import { useToast } from '@hooks/use-toast';
import { SettingsIcon } from '@icons';
import {
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  resolveActionBorderProps,
  resolveBorderProps,
  type BorderProps,
  type ShowActionBorderProps,
  type ShowBorderProps,
} from '@ui/border';
import { Button, type ButtonIconProps } from '@ui/button';
import { CARD_HEADER_ACTION_SIZE_PRESET, Card } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { DateRangeInput, todayUtc } from '@ui/date-range-input';
import { Fieldset } from '@ui/fieldset';
import { DEFAULT_ICON_POSITION, Icon, getIconPadding } from '@ui/icon';
import { type IconButtonRowAction } from '@ui/icon-button-row';
import { Input, type InputClearProps } from '@ui/input';
import {
  DEFAULT_LISTBOX_EMPTY_MESSAGE,
  DEFAULT_LISTBOX_PLACEHOLDER,
  Listbox,
  type ListboxAppearanceProps,
  type ListboxMultipleProps,
} from '@ui/listbox';
import { LocalePicker } from '@ui/locale-picker';
import { Modal, type ModalAccessibleName } from '@ui/modal';
import { DEFAULT_SHAPE_PRESET, DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { ProgressBar } from '@ui/progress-bar';
import { RadioButton } from '@ui/radio-button';
import {
  DEFAULT_RANGE_INPUT_FROM_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_TO_PLACEHOLDER,
  DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES,
  RangeInput,
  type RangeInputClearProps,
  type RangeInputValidationMessages,
  type RangeValue,
} from '@ui/range-input';
import { ScrollPort } from '@ui/scroll-port';
import {
  DEFAULT_SEARCH_FIELD_PLACEHOLDER,
  SearchField,
  type SearchFieldClearProps,
  type SearchFieldShowIconProps,
} from '@ui/search-field';
import { SegmentButton } from '@ui/segment-button';
import { type SegmentButtonPartsActionIconProps } from '@ui/segment-button-parts';
import { Sidebar } from '@ui/sidebar';
import { Spinner } from '@ui/spinner';
import { Stepper } from '@ui/stepper';
import { DEFAULT_SURFACE_BACKGROUND } from '@ui/surface';
import { Switch } from '@ui/switch';
import {
  DEFAULT_TABLE_HOVER_HIGHLIGHT,
  DEFAULT_TABLE_SHOW_BORDER,
  DEFAULT_TABLE_SIZE_PRESET,
  DEFAULT_TABLE_STRIPED,
} from '@ui/table';
import { Tag, type TagShowDotProps } from '@ui/tag';
import { Text, type TextNodeProps } from '@ui/text';
import { Toast } from '@ui/toast';
import { DEFAULT_TONE } from '@ui/tones';
import { Toolbar } from '@ui/toolbar';

import { BrowserAiSmokeProbe } from './browser-ai-smoke-probe';
import { ButtonSettings, type ButtonWidgetState } from './button-settings';
import { CardSettings, type CardWidgetState } from './card-settings';
import { CheckboxSettings, type CheckboxWidgetState } from './checkbox-settings';
import {
  DateRangeInputSettings,
  type DateRangeInputWidgetState,
} from './date-range-input-settings';
import { FieldsetSettings, type FieldsetWidgetState } from './fieldset-settings';
import { HeaderSettings } from './header-settings';
import { resolveIconButtonRowAction } from './icon-row-group/icon-row-group';
import { IconSettings, type IconWidgetState } from './icon-settings';
import { InputSettings, type InputWidgetState } from './input-settings';
import { ListboxSettings, type ListboxWidgetState } from './listbox-settings';
import {
  LocalePickerSettings,
  type LocalePickerWidgetState,
} from './locale-picker-settings';
import { LOCALE_SLICE_OPTIONS } from './locale-slice';
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
  SearchFieldSettings,
  type SearchFieldWidgetState,
} from './search-field-settings';
import {
  SegmentButtonSettings,
  type SegmentButtonWidgetState,
} from './segment-button-settings';
import { ICON_OPTIONS, LIST_OPTIONS, getIcon } from './showcase-icon-options';
import { resolveTextNodeProps } from './showcase-text-node';
import { createWidgetStateUpdater } from './showcase-widget-state-updater';
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
import { ToolbarSettings, type ToolbarWidgetState } from './toolbar-settings';

/**
 * SIDEBAR_ID — задаёт id боковой панели витрины.
 * Связывает кнопки настроек карточек с Sidebar через `aria-controls`.
 */
const SIDEBAR_ID = 'showcase-sidebar';

/**
 * DEMO_STEPPER_ARIA_LABEL — задаёт запасной `aria-label` превью Stepper без подписи.
 */
const DEMO_STEPPER_ARIA_LABEL = 'Demo stepper';

/**
 * DEMO_ICON_ARIA_LABEL — задаёт `aria-label` превью Icon как кнопки.
 * Используется в превью виджета Icon.
 */
const DEMO_ICON_ARIA_LABEL = 'Demo icon';

/**
 * OPEN_WIDGET_SETTINGS_ARIA_LABEL — задаёт `aria-label` кнопки открытия панели настроек карточки.
 * Используется в `headerActions` карточек виджетов.
 */
const OPEN_WIDGET_SETTINGS_ARIA_LABEL = 'Open settings';

/**
 * CLOSE_WIDGET_SETTINGS_ARIA_LABEL — задаёт `aria-label` кнопки закрытия панели настроек карточки.
 * Используется в `headerActions` карточек виджетов.
 */
const CLOSE_WIDGET_SETTINGS_ARIA_LABEL = 'Close settings';

/**
 * DEMO_RANGE_FROM_EXCEEDS_TO_ERROR — задаёт текст ошибки демо-валидации RangeInput.
 * Используется в `validateDemoRange`.
 */
const DEMO_RANGE_FROM_EXCEEDS_TO_ERROR = 'From must not exceed To.';

/**
 * DEMO_MODAL_ARIA_LABEL — задаёт запасной `ariaLabel` превью Modal без заголовка.
 * Используется, когда витрина вызывает Modal без `title`.
 */
const DEMO_MODAL_ARIA_LABEL = 'Demo modal';

/**
 * DEMO_MODAL_BODY_TEXT — задаёт текст тела превью Modal.
 * Используется в теле превью Modal.
 */
const DEMO_MODAL_BODY_TEXT = 'Place your content here';

/**
 * PROGRESS_WIDGET_TITLE_ID — задаёт id заголовка виджета ProgressBar в витрине.
 * Используется как `titleId` карточки виджета и в `aria-labelledby` индикатора ProgressBar.
 */
const PROGRESS_WIDGET_TITLE_ID = 'showcase-progress-heading';

/**
 * TOOLBAR_DEMO_ARIA_LABEL — задаёт `aria-label` превью Toolbar.
 * Используется в превью виджета Toolbar.
 */
const TOOLBAR_DEMO_ARIA_LABEL = 'Toolbar';

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
  | 'date-range-input'
  | 'fieldset'
  | 'icon'
  | 'input'
  | 'listbox'
  | 'locale-picker'
  | 'modal'
  | 'progress'
  | 'radio-button'
  | 'range-input'
  | 'search-field'
  | 'segment-button'
  | 'spinner'
  | 'stepper'
  | 'switch'
  | 'table'
  | 'tag'
  | 'text'
  | 'toast'
  | 'toolbar';

/**
 * SETTINGS_TITLES — связывает ключ панели настроек с заголовком Sidebar и карточки.
 * Используется в `ShowcasePage` для заголовка панели и `title` виджета.
 */
const SETTINGS_TITLES: Record<WidgetSettingsKey, string> = {
  input: 'Input',
  'search-field': 'SearchField',
  listbox: 'Listbox',
  'locale-picker': 'LocalePicker',
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
  toolbar: 'Toolbar',
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
  borderTone: DEFAULT_TONE,
  disabled: false,
  error: '',
  invalid: false,
  label: 'Label:',
  placeholder: 'e.g. value',
  shape: DEFAULT_SHAPE_PRESET,
  showBorder: DEFAULT_SHOW_BORDER,
  showClearButton: true,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
  value: '',
};

/**
 * DEFAULT_SEARCH_FIELD_STATE — задаёт начальное состояние виджета SearchField в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_SEARCH_FIELD_STATE: SearchFieldWidgetState = {
  borderTone: DEFAULT_TONE,
  disabled: false,
  iconFill: DEFAULT_TONE,
  iconKey: 'search',
  iconPosition: 'start',
  iconTone: DEFAULT_TONE,
  label: 'Label:',
  placeholder: DEFAULT_SEARCH_FIELD_PLACEHOLDER,
  shape: DEFAULT_SHAPE_PRESET,
  showBorder: DEFAULT_SHOW_BORDER,
  showClearButton: true,
  showIcon: true,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
  value: '',
};

/**
 * DEFAULT_BUTTON_STATE — задаёт начальное состояние виджета Button в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_BUTTON_STATE: ButtonWidgetState = {
  active: false,
  disabled: false,
  iconFill: DEFAULT_TONE,
  iconKey: 'search',
  iconPosition: DEFAULT_ICON_POSITION,
  iconTone: DEFAULT_TONE,
  label: 'Label:',
  shape: DEFAULT_SHAPE_PRESET,
  size: DEFAULT_SIZE_PRESET,
  text: 'Button',
  textTone: DEFAULT_TONE,
  tone: DEFAULT_TONE,
  withIcon: false,
};

/**
 * DEFAULT_ICON_STATE — задаёт начальное состояние виджета Icon в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_ICON_STATE: IconWidgetState = {
  active: false,
  as: 'button',
  borderTone: DEFAULT_TONE,
  disabled: false,
  iconFill: DEFAULT_TONE,
  iconKey: 'settings',
  iconTone: DEFAULT_TONE,
  padding: getIconPadding(DEFAULT_SIZE_PRESET),
  shape: 'square',
  showBorder: false,
  showHover: true,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
};

/**
 * DEFAULT_LISTBOX_STATE — задаёт начальное состояние виджета Listbox в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_LISTBOX_STATE: ListboxWidgetState = {
  appearance: 'field',
  borderTone: DEFAULT_TONE,
  disabled: false,
  emptyMessage: DEFAULT_LISTBOX_EMPTY_MESSAGE,
  iconFill: DEFAULT_TONE,
  iconPosition: DEFAULT_ICON_POSITION,
  iconTone: DEFAULT_TONE,
  inlineCheckbox: false,
  label: 'Label:',
  multiple: false,
  placeholder: DEFAULT_LISTBOX_PLACEHOLDER,
  searchPlaceholder: DEFAULT_SEARCH_FIELD_PLACEHOLDER,
  shape: DEFAULT_SHAPE_PRESET,
  showBorder: DEFAULT_SHOW_BORDER,
  showClearButton: false,
  showSearch: false,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
  value: '',
  withIcon: false,
};

/**
 * LISTBOX_DEMO_DISABLED_OPTION — задаёт недоступную опцию Listbox в демо витрины.
 * Используется в превью Listbox витрины дизайн-системы.
 */
const LISTBOX_DEMO_DISABLED_OPTION = {
  disabled: true,
  label: 'Unavailable',
  value: 'unavailable',
} as const;

/**
 * DEFAULT_LOCALE_PICKER_STATE — задаёт начальное состояние виджета LocalePicker в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_LOCALE_PICKER_STATE: LocalePickerWidgetState = {
  appearance: 'field',
  borderTone: DEFAULT_TONE,
  disabled: false,
  emptyMessage: DEFAULT_LISTBOX_EMPTY_MESSAGE,
  iconFill: DEFAULT_TONE,
  iconPosition: DEFAULT_ICON_POSITION,
  iconTone: DEFAULT_TONE,
  label: 'Label:',
  placeholder: DEFAULT_LISTBOX_PLACEHOLDER,
  searchPlaceholder: DEFAULT_SEARCH_FIELD_PLACEHOLDER,
  shape: DEFAULT_SHAPE_PRESET,
  showBorder: DEFAULT_SHOW_BORDER,
  showClearButton: false,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
  value: '',
};

/**
 * DEFAULT_RANGE_INPUT_STATE — задаёт начальное состояние виджета RangeInput в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_RANGE_INPUT_STATE: RangeInputWidgetState = {
  buttonShape: DEFAULT_SHAPE_PRESET,
  buttonSize: DEFAULT_SIZE_PRESET,
  buttonText: 'Apply',
  buttonTextTone: DEFAULT_TONE,
  buttonTone: 'primary',
  disabled: false,
  fromPlaceholder: DEFAULT_RANGE_INPUT_FROM_PLACEHOLDER,
  iconFill: DEFAULT_TONE,
  iconPosition: DEFAULT_ICON_POSITION,
  iconTone: DEFAULT_TONE,
  inputShape: DEFAULT_SHAPE_PRESET,
  inputSize: DEFAULT_SIZE_PRESET,
  label: 'Label:',
  placeholder: DEFAULT_RANGE_INPUT_PLACEHOLDER,
  reserveErrorSpace: true,
  shape: DEFAULT_SHAPE_PRESET,
  size: DEFAULT_SIZE_PRESET,
  title: 'Custom range:',
  titleAlign: 'center',
  titleItalic: false,
  titleSize: 'normal',
  titleTone: DEFAULT_TONE,
  toPlaceholder: DEFAULT_RANGE_INPUT_TO_PLACEHOLDER,
  validationMessages: { ...DEFAULT_RANGE_INPUT_VALIDATION_MESSAGES },
  value: { from: '', to: '' },
  withClear: false,
};

/**
 * DEFAULT_DATE_RANGE_INPUT_STATE — задаёт начальное состояние виджета DateRangeInput в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_DATE_RANGE_INPUT_STATE: DateRangeInputWidgetState = {
  buttonShape: DEFAULT_SHAPE_PRESET,
  dayShape: DEFAULT_SHAPE_PRESET,
  disabled: false,
  endDay: '',
  label: 'Label:',
  maxDay: todayUtc(),
  minDay: '',
  shape: DEFAULT_SHAPE_PRESET,
  size: DEFAULT_SIZE_PRESET,
  startDay: '',
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
  size: DEFAULT_SIZE_PRESET,
  text: 'Example',
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
  size: DEFAULT_SIZE_PRESET,
  textA: 'Option A',
  textB: 'Option B',
};

/**
 * DEFAULT_FIELDSET_STATE — задаёт начальное состояние виджета Fieldset в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_FIELDSET_STATE: FieldsetWidgetState = {
  borderTone: DEFAULT_TONE,
  legend: 'Legend',
  selected: 'a',
};

/**
 * DEFAULT_PROGRESS_STATE — задаёт начальное состояние виджета ProgressBar в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_PROGRESS_STATE: ProgressBarWidgetState = {
  showText: true,
  size: DEFAULT_SIZE_PRESET,
  tone: 'primary',
  value: 0.42,
};

/**
 * DEFAULT_SPINNER_STATE — задаёт начальное состояние виджета Spinner в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_SPINNER_STATE: SpinnerWidgetState = {
  reserveTextSpace: true,
  size: DEFAULT_SIZE_PRESET,
  text: 'Loading…',
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
  shape: DEFAULT_SHAPE_PRESET,
  size: DEFAULT_SIZE_PRESET,
  step: 1,
  suffix: '',
  value: 10,
};

/**
 * DEFAULT_SWITCH_STATE — задаёт начальное состояние виджета Switch в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_SWITCH_STATE: SwitchWidgetState = {
  checked: true,
  disabled: false,
  size: DEFAULT_SIZE_PRESET,
  text: 'Switch',
  tone: 'primary',
};

/**
 * DEFAULT_TOAST_STATE — задаёт начальное состояние виджета Toast в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TOAST_STATE: ToastWidgetState = {
  message: 'Very important message',
  size: DEFAULT_SIZE_PRESET,
  tone: 'success',
};

/**
 * DEFAULT_SEGMENT_BUTTON_STATE — задаёт начальное состояние виджета SegmentButton в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_SEGMENT_BUTTON_STATE: SegmentButtonWidgetState = {
  centerActive: false,
  centerDisabled: false,
  centerIconFill: DEFAULT_TONE,
  centerIconKey: 'settings',
  centerIconPosition: DEFAULT_ICON_POSITION,
  centerLabel: 'Change',
  centerTextTone: 'success',
  centerTone: DEFAULT_TONE,
  centerWithIcon: false,
  label: 'Label:',
  leftActive: false,
  leftDisabled: false,
  leftIconFill: DEFAULT_TONE,
  leftIconKey: 'search',
  leftIconPosition: 'start',
  leftLabel: 'Select',
  leftTextTone: DEFAULT_TONE,
  leftTone: DEFAULT_TONE,
  leftWithIcon: false,
  rightActive: false,
  rightDisabled: false,
  rightIconFill: DEFAULT_TONE,
  rightIconKey: 'close',
  rightIconPosition: DEFAULT_ICON_POSITION,
  rightLabel: 'Delete',
  rightTextTone: 'danger',
  rightTone: DEFAULT_TONE,
  rightWithIcon: false,
  segmentCount: '2',
  shape: DEFAULT_SHAPE_PRESET,
  size: DEFAULT_SIZE_PRESET,
};

/**
 * DEFAULT_TAG_STATE — задаёт начальное состояние виджета Tag в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TAG_STATE: TagWidgetState = {
  borderTone: DEFAULT_TONE,
  dotTone: DEFAULT_TONE,
  shape: 'pill',
  showBorder: DEFAULT_SHOW_BORDER,
  showDot: true,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: 'tiny',
  text: 'Tag',
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
  showBorder: DEFAULT_TABLE_SHOW_BORDER,
  showIndexColumn: true,
  size: DEFAULT_TABLE_SIZE_PRESET,
  striped: DEFAULT_TABLE_STRIPED,
};

/**
 * DEFAULT_MODAL_STATE — задаёт начальное состояние виджета Modal в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_MODAL_STATE: ModalWidgetState = {
  background: DEFAULT_SURFACE_BACKGROUND,
  borderTone: DEFAULT_TONE,
  showBorder: false,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
  subtitle: 'Modal subtitle',
  subtitleItalic: false,
  subtitleTone: 'muted',
  title: 'Modal title',
  titleItalic: false,
  titleSize: 'bold',
  titleTone: DEFAULT_TONE,
};

/**
 * DEFAULT_CARD_STATE — задаёт начальное состояние виджета Card в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_CARD_STATE: CardWidgetState = {
  background: DEFAULT_SURFACE_BACKGROUND,
  borderTone: DEFAULT_TONE,
  headerActions: [
    {
      active: false,
      disabled: false,
      iconKey: 'close',
      iconPadding: getIconPadding(CARD_HEADER_ACTION_SIZE_PRESET),
      title: '',
    },
  ],
  showActionBorder: false,
  showActionShadow: true,
  showBorder: DEFAULT_SHOW_BORDER,
  showShadow: DEFAULT_SHOW_SHADOW,
  subtitle: 'Subtitle text',
  subtitleItalic: false,
  subtitleTone: 'muted',
  title: 'Card title',
  titleItalic: false,
  titleSize: 'bold',
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
  size: 'normal',
  tone: DEFAULT_TONE,
};

/**
 * DEFAULT_TOOLBAR_STATE — задаёт начальное состояние виджета Toolbar в витрине.
 * Используется при инициализации состояния в `ShowcasePage`.
 */
const DEFAULT_TOOLBAR_STATE: ToolbarWidgetState = {
  actions: [
    {
      active: false,
      disabled: false,
      iconKey: 'search',
      iconPadding: getIconPadding(DEFAULT_SIZE_PRESET),
      title: '',
    },
    {
      active: false,
      disabled: false,
      iconKey: 'copy',
      iconPadding: getIconPadding(DEFAULT_SIZE_PRESET),
      title: '',
    },
    {
      active: false,
      disabled: false,
      iconKey: 'download',
      iconPadding: getIconPadding(DEFAULT_SIZE_PRESET),
      title: '',
    },
    {
      active: false,
      disabled: false,
      iconKey: 'settings',
      iconPadding: getIconPadding(DEFAULT_SIZE_PRESET),
      title: '',
    },
    {
      active: false,
      disabled: false,
      iconKey: 'sign-out',
      iconPadding: getIconPadding(DEFAULT_SIZE_PRESET),
      title: '',
    },
  ],
  background: DEFAULT_SURFACE_BACKGROUND,
  borderTone: DEFAULT_TONE,
  shape: DEFAULT_SHAPE_PRESET,
  showActionBorder: false,
  showActionShadow: true,
  showBorder: DEFAULT_SHOW_BORDER,
  showShadow: DEFAULT_SHOW_SHADOW,
  size: DEFAULT_SIZE_PRESET,
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
    return DEMO_RANGE_FROM_EXCEEDS_TO_ERROR;
  }

  return null;
}

/**
 * resolveListboxAppearanceProps — возвращает пропсы стилизации триггера по состоянию виджета.
 * Используется в превью Listbox и LocalePicker: каждое передаёт своё состояние.
 *
 * Как работает:
 * 1. При виде `icon` отдаёт `appearance: 'icon'` и пакет пропсов рамки
 *    через `resolveBorderProps`
 * 2. При виде `field` и включённом `showClearButton` отдаёт вид `field`, пропы шеврона
 *    и `showClearButton: true`
 * 3. Иначе при виде `field` отдаёт вид `field` и пропы шеврона без `showClearButton`
 *
 * @param state состояние виджета Listbox или LocalePicker
 * @returns пропсы стилизации триггера
 */
function resolveListboxAppearanceProps(
  state: ListboxWidgetState | LocalePickerWidgetState
): ListboxAppearanceProps {
  if (state.appearance === 'icon') {
    return {
      appearance: 'icon',
      ...resolveBorderProps(state.showBorder, state.borderTone, state.showShadow),
    };
  }

  if (state.showClearButton) {
    return {
      appearance: 'field',
      iconFill: state.iconFill,
      iconPosition: state.iconPosition,
      iconTone: state.iconTone,
      showClearButton: true,
    };
  }

  return {
    appearance: 'field',
    iconFill: state.iconFill,
    iconPosition: state.iconPosition,
    iconTone: state.iconTone,
  };
}

/**
 * ShowcasePage — отображает витрину дизайн-системы с превью виджетов и панелью настроек.
 *
 * @example
 * <ShowcasePage />
 */
export function ShowcasePage() {
  // autoHide шапки живёт в каркасе. Витрина даёт только тумблер, см. src/pages/showcase/header-settings/index.tsx.
  const { showToast } = useToast();
  const { autoHide, isHeaderSettingsOpen, setAutoHide, setIsHeaderSettingsOpen } =
    useShellOutletContext();
  const [activeSettings, setActiveSettings] = useState<null | WidgetSettingsKey>(null);
  const [input, setInput] = useState<InputWidgetState>(DEFAULT_INPUT_STATE);
  const [searchField, setSearchField] = useState<SearchFieldWidgetState>(
    DEFAULT_SEARCH_FIELD_STATE
  );
  const [button, setButton] = useState<ButtonWidgetState>(DEFAULT_BUTTON_STATE);
  const [icon, setIcon] = useState<IconWidgetState>(DEFAULT_ICON_STATE);
  const [listbox, setListbox] = useState<ListboxWidgetState>(DEFAULT_LISTBOX_STATE);
  const [localePicker, setLocalePicker] = useState<LocalePickerWidgetState>(
    DEFAULT_LOCALE_PICKER_STATE
  );
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
  const [toolbar, setToolbar] = useState<ToolbarWidgetState>(DEFAULT_TOOLBAR_STATE);
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

  function toggleSettings(target: WidgetSettingsKey): void {
    setIsHeaderSettingsOpen(false);
    setActiveSettings((current) => (current === target ? null : target));
  }

  function closePanel(): void {
    setActiveSettings(null);
    setIsHeaderSettingsOpen(false);
  }

  const updateInput = createWidgetStateUpdater(setInput);
  const updateSearchField = createWidgetStateUpdater(setSearchField);
  const updateButton = createWidgetStateUpdater(setButton);
  const updateIcon = createWidgetStateUpdater(setIcon);

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
        next.withIcon = false;
        next.value = Array.isArray(current.value)
          ? current.value
          : current.value
            ? [current.value]
            : [];
      }

      if (key === 'withIcon' && value === true) {
        next.inlineCheckbox = false;
      }

      return next;
    });
  }

  const updateLocalePicker = createWidgetStateUpdater(setLocalePicker);

  /**
   * listboxDemoOptions — формирует опции превью Listbox: с иконками или текстовые
   * и недоступную строку.
   * Используется в превью виджета Listbox.
   */
  const listboxDemoOptions = [
    ...(listbox.withIcon && !listbox.inlineCheckbox ? ICON_OPTIONS : LIST_OPTIONS),
    LISTBOX_DEMO_DISABLED_OPTION,
  ];

  const updateRangeInput = createWidgetStateUpdater(setRangeInput);
  const updateDateRangeInput = createWidgetStateUpdater(setDateRangeInput);
  const updateCheckbox = createWidgetStateUpdater(setCheckbox);
  const updateRadioButton = createWidgetStateUpdater(setRadioButton);
  const updateFieldset = createWidgetStateUpdater(setFieldset);
  const updateProgress = createWidgetStateUpdater(setProgress);
  const updateSpinner = createWidgetStateUpdater(setSpinner);
  const updateStepper = createWidgetStateUpdater(setStepper);
  const updateSwitch = createWidgetStateUpdater(setSwitchState);
  const updateToast = createWidgetStateUpdater(setToast);
  const updateSegmentButton = createWidgetStateUpdater(setSegmentButton);
  const updateTag = createWidgetStateUpdater(setTag);
  const updateTable = createWidgetStateUpdater(setTable);
  const updateModal = createWidgetStateUpdater(setModal);
  const updateCard = createWidgetStateUpdater(setCard);
  const updateText = createWidgetStateUpdater(setText);
  const updateToolbar = createWidgetStateUpdater(setToolbar);

  function renderSettingsPanel(): ReactNode {
    if (activeSettings === 'input') {
      return <InputSettings state={input} onChange={updateInput} />;
    }

    if (activeSettings === 'search-field') {
      return <SearchFieldSettings state={searchField} onChange={updateSearchField} />;
    }

    if (activeSettings === 'listbox') {
      return <ListboxSettings state={listbox} onChange={updateListbox} />;
    }

    if (activeSettings === 'locale-picker') {
      return <LocalePickerSettings state={localePicker} onChange={updateLocalePicker} />;
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

    if (activeSettings === 'toolbar') {
      return <ToolbarSettings state={toolbar} onChange={updateToolbar} />;
    }

    return null;
  }

  /**
   * renderWidgetCard — возвращает карточку виджета витрины с общим скелетом Card.
   * В продукт копируются `Card as="article"`, `headerActions` при действиях в шапке
   * и содержимое `children`. Связывание имени области с заголовком делает Card.
   * Только для витрины: `ariaControls` и `ariaExpanded` на кнопке настроек, иконка
   * SettingsIcon с `toggleSettings`. Эту обвязку в продуктовый код не переносить.
   * `titleId` передают, когда тем же заголовком называют другой узел внутри карточки.
   *
   * @param widgetKey ключ панели настроек виджета
   * @param children содержимое превью виджета
   * @param fullRow включает растяжение карточки на всю ширину сетки
   * @param titleId id заголовка, когда им называют узел внутри карточки
   * @returns карточка виджета, при `fullRow` — в обёртке `StyledShowcaseWidgetFullRow`
   */
  function renderWidgetCard(
    widgetKey: WidgetSettingsKey,
    children: ReactNode,
    fullRow = false,
    titleId?: string
  ): ReactNode {
    const open = activeSettings === widgetKey;

    const card = (
      <Card
        as="article"
        background="surface"
        headerActions={[
          {
            ariaControls: SIDEBAR_ID,
            ariaExpanded: open,
            ariaLabel: open
              ? CLOSE_WIDGET_SETTINGS_ARIA_LABEL
              : OPEN_WIDGET_SETTINGS_ARIA_LABEL,
            icon: <SettingsIcon />,
            onClick: () => toggleSettings(widgetKey),
          },
        ]}
        maxBlockSize={fullRow ? '100%' : undefined}
        minBlockSize={fullRow ? '0' : undefined}
        paddingBlockEnd={widgetKey === 'table' ? 0 : undefined}
        title={SETTINGS_TITLES[widgetKey]}
        titleId={titleId}
      >
        {children}
      </Card>
    );

    if (fullRow) {
      return <StyledShowcaseWidgetFullRow>{card}</StyledShowcaseWidgetFullRow>;
    }

    return card;
  }

  const modalTitleProps: TextNodeProps<'title'> = resolveTextNodeProps({
    prefix: 'title',
    text: modal.title,
    align: modal.titleAlign,
    italic: modal.titleItalic,
    size: modal.titleSize,
    tone: modal.titleTone,
  });
  const modalAccessibleName: ModalAccessibleName = modalTitleProps.title
    ? modalTitleProps
    : { ariaLabel: DEMO_MODAL_ARIA_LABEL };
  const modalSubtitleProps: TextNodeProps<'subtitle'> = resolveTextNodeProps({
    prefix: 'subtitle',
    text: modal.subtitle,
    align: modal.subtitleAlign,
    italic: modal.subtitleItalic,
    size: modal.subtitleSize,
    tone: modal.subtitleTone,
  });
  const resolvedCardTitleProps: TextNodeProps<'title'> = resolveTextNodeProps({
    prefix: 'title',
    text: card.title,
    align: card.titleAlign,
    italic: card.titleItalic,
    size: card.titleSize,
    tone: card.titleTone,
  });
  const cardTitleProps: TextNodeProps<'title'> = resolvedCardTitleProps.title
    ? { ...resolvedCardTitleProps, titleLevel: 'h3' }
    : resolvedCardTitleProps;
  const cardSubtitleProps: TextNodeProps<'subtitle'> = resolveTextNodeProps({
    prefix: 'subtitle',
    text: card.subtitle,
    align: card.subtitleAlign,
    italic: card.subtitleItalic,
    size: card.subtitleSize,
    tone: card.subtitleTone,
  });
  const rangeInputTitleProps: TextNodeProps<'title'> = resolveTextNodeProps({
    prefix: 'title',
    text: rangeInput.title,
    align: rangeInput.titleAlign,
    italic: rangeInput.titleItalic,
    size: rangeInput.titleSize,
    tone: rangeInput.titleTone,
  });
  const sidebarTitleProps: TextNodeProps<'title'> = resolveTextNodeProps({
    prefix: 'title',
    text: panelTitle ?? '',
  });
  const spinnerTextProps =
    spinner.text.trim() !== ''
      ? {
          children: spinner.text,
        }
      : {};
  const modalBorderProps: ShowBorderProps = resolveBorderProps(
    modal.showBorder,
    modal.borderTone,
    modal.showShadow
  );
  const cardBorderProps: BorderProps = resolveBorderProps(
    card.showBorder,
    card.borderTone,
    card.showShadow
  );
  const cardActionBorderProps: ShowActionBorderProps = resolveActionBorderProps(
    card.showActionBorder,
    card.showActionShadow
  );
  const toolbarBorderProps: BorderProps = resolveBorderProps(
    toolbar.showBorder,
    toolbar.borderTone,
    toolbar.showShadow
  );
  const toolbarActionBorderProps: ShowActionBorderProps = resolveActionBorderProps(
    toolbar.showActionBorder,
    toolbar.showActionShadow
  );
  /**
   * toolbarActions — формирует ряд превью Toolbar: слот LocalePicker вида `icon`
   * и действия панели.
   * Используется в превью виджета Toolbar.
   */
  const toolbarActions: IconButtonRowAction[] = [
    {
      control: (
        <LocalePicker
          appearance="icon"
          label="Language:"
          options={LOCALE_SLICE_OPTIONS}
        />
      ),
    },
    ...toolbar.actions.map(resolveIconButtonRowAction),
  ];
  const inputBorderProps: BorderProps = resolveBorderProps(
    input.showBorder,
    input.borderTone,
    input.showShadow
  );
  const searchFieldBorderProps: BorderProps = resolveBorderProps(
    searchField.showBorder,
    searchField.borderTone,
    searchField.showShadow
  );
  const iconBorderProps: ShowBorderProps = resolveBorderProps(
    icon.showBorder,
    icon.borderTone,
    icon.showShadow
  );
  /**
   * iconRoleProps — формирует пропсы роли превью Icon по `icon.as`.
   * Для `button` передаёт `active`, `disabled` и `aria-label`. Для `span` отдаёт
   * только тег окна: состояния кнопки в превью не идут.
   * Используется в превью виджета Icon.
   */
  const iconRoleProps =
    icon.as === 'button'
      ? {
          active: icon.active,
          'aria-label': DEMO_ICON_ARIA_LABEL,
          as: 'button' as const,
          disabled: icon.disabled,
        }
      : { as: 'span' as const };
  const tagBorderProps: BorderProps = resolveBorderProps(
    tag.showBorder,
    tag.borderTone,
    tag.showShadow
  );
  const searchFieldShowIconProps: SearchFieldShowIconProps = searchField.showIcon
    ? {
        showIcon: true,
        icon: getIcon(searchField.iconKey),
        iconPosition: searchField.iconPosition,
      }
    : { showIcon: false };
  /**
   * searchFieldClearProps — формирует пропсы кнопки сброса превью SearchField.
   * Используется в превью виджета SearchField.
   */
  const searchFieldClearProps: SearchFieldClearProps = searchField.showClearButton
    ? { showClearButton: true }
    : { showClearButton: false };
  /**
   * inputClearProps — формирует пропсы кнопки сброса превью Input.
   * Используется в превью виджета Input.
   */
  const inputClearProps: InputClearProps = input.showClearButton
    ? { showClearButton: true }
    : { showClearButton: false };
  /**
   * rangeInputClearProps — формирует пропсы кнопки сброса превью RangeInput.
   * Используется в превью виджета RangeInput.
   */
  const rangeInputClearProps: RangeInputClearProps = rangeInput.withClear
    ? {
        onClear: () => {
          updateRangeInput('value', { from: '', to: '' });
        },
      }
    : {};
  /**
   * rangeInputValidationMessages — формирует тексты валидации превью RangeInput.
   * Пустой ключ в объект не входит: иначе слияние в RangeInput оставляет пустую строку
   * вместо коробочного текста.
   * Используется в превью виджета RangeInput.
   */
  const rangeInputValidationMessages: RangeInputValidationMessages = {
    ...(rangeInput.validationMessages.emptyBounds.trim() !== ''
      ? { emptyBounds: rangeInput.validationMessages.emptyBounds }
      : {}),
    ...(rangeInput.validationMessages.invalidFrom.trim() !== ''
      ? { invalidFrom: rangeInput.validationMessages.invalidFrom }
      : {}),
    ...(rangeInput.validationMessages.invalidTo.trim() !== ''
      ? { invalidTo: rangeInput.validationMessages.invalidTo }
      : {}),
  };
  const listboxMultipleProps: ListboxMultipleProps = listbox.multiple
    ? {
        multiple: true,
        inlineCheckbox: listbox.inlineCheckbox,
      }
    : {};
  /**
   * listboxAppearanceProps — формирует пропсы стилизации триггера превью Listbox.
   * Используется в превью виджета Listbox.
   */
  const listboxAppearanceProps: ListboxAppearanceProps =
    resolveListboxAppearanceProps(listbox);
  /**
   * localePickerAppearanceProps — формирует пропсы стилизации триггера превью LocalePicker.
   * Используется в превью виджета LocalePicker.
   */
  const localePickerAppearanceProps: ListboxAppearanceProps =
    resolveListboxAppearanceProps(localePicker);
  const buttonIconProps: ButtonIconProps = button.withIcon
    ? {
        icon: getIcon(button.iconKey),
        iconFill: button.iconFill,
        iconPosition: button.iconPosition,
        iconTone: button.iconTone,
      }
    : {};
  const segmentButtonCenterIconProps: SegmentButtonPartsActionIconProps =
    segmentButton.centerWithIcon
      ? {
          icon: getIcon(segmentButton.centerIconKey),
          iconFill: segmentButton.centerIconFill,
          iconPosition: segmentButton.centerIconPosition,
        }
      : {};
  const segmentButtonLeftIconProps: SegmentButtonPartsActionIconProps =
    segmentButton.leftWithIcon
      ? {
          icon: getIcon(segmentButton.leftIconKey),
          iconFill: segmentButton.leftIconFill,
          iconPosition: segmentButton.leftIconPosition,
        }
      : {};
  const segmentButtonRightIconProps: SegmentButtonPartsActionIconProps =
    segmentButton.rightWithIcon
      ? {
          icon: getIcon(segmentButton.rightIconKey),
          iconFill: segmentButton.rightIconFill,
          iconPosition: segmentButton.rightIconPosition,
        }
      : {};
  const tagShowDotProps: TagShowDotProps = tag.showDot
    ? {
        showDot: true,
        dotTone: tag.dotTone,
      }
    : { showDot: false };

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
        onClose={closePanel}
        {...sidebarTitleProps}
      >
        {/* Высота 100% от зоны контента Sidebar: definite-высота от max-block-size
            StyledMain. Скролл остаётся внутри ScrollPort карточки, а не на зоне.
            Block-padding перенесён с Card на ScrollPort: тень виджетов входит в
            область обрезки скролла, сумма отступов по вертикали по-прежнему 16. */}
        <Card as="section" maxBlockSize="100%" paddingBlock={0}>
          <ScrollPort paddingBlock={16}>
            <StyledShowcaseWidgets>
              {renderWidgetCard('table', <TableDemo settings={table} />, true)}

              {renderWidgetCard(
                'modal',
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
                    inlineSize={MODAL_INLINE_SIZE[modal.size]}
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    {...modalBorderProps}
                    {...modalAccessibleName}
                    {...modalSubtitleProps}
                  >
                    {DEMO_MODAL_BODY_TEXT}
                  </Modal>
                </>
              )}

              {renderWidgetCard(
                'card',
                <Card
                  background={card.background}
                  headerActions={card.headerActions.map(resolveIconButtonRowAction)}
                  {...cardActionBorderProps}
                  {...cardBorderProps}
                  {...cardTitleProps}
                  {...cardSubtitleProps}
                />
              )}

              {renderWidgetCard(
                'text',
                <Text
                  align={text.align}
                  ellipsis={text.ellipsis}
                  inlineSize={TEXT_DEMO_INLINE_SIZE}
                  italic={text.italic}
                  minInlineSize="0"
                  placeSelf="center"
                  size={text.size}
                  tone={text.tone}
                >
                  {text.children}
                </Text>
              )}

              {renderWidgetCard(
                'toolbar',
                <Toolbar
                  actions={toolbarActions}
                  ariaLabel={TOOLBAR_DEMO_ARIA_LABEL}
                  background={toolbar.background}
                  placeSelf="center"
                  shape={toolbar.shape}
                  size={toolbar.size}
                  {...toolbarActionBorderProps}
                  {...toolbarBorderProps}
                />
              )}

              {renderWidgetCard(
                'input',
                <Input
                  alignSelf="center"
                  disabled={input.disabled}
                  error={
                    input.invalid && input.error.trim() !== '' ? input.error : undefined
                  }
                  errorPlaceholder={
                    input.errorPlaceholder !== undefined &&
                    input.errorPlaceholder.trim() !== ''
                      ? input.errorPlaceholder
                      : undefined
                  }
                  invalid={input.invalid || undefined}
                  label={input.label.trim() !== '' ? input.label : undefined}
                  placeholder={
                    input.placeholder.trim() !== '' ? input.placeholder : undefined
                  }
                  reserveErrorSpace={input.reserveErrorSpace}
                  shape={input.shape}
                  size={input.size}
                  value={input.value}
                  onChange={(event) => updateInput('value', event.target.value)}
                  onClear={() => updateInput('value', '')}
                  {...inputBorderProps}
                  {...inputClearProps}
                />
              )}

              {renderWidgetCard(
                'search-field',
                <SearchField
                  alignSelf="center"
                  disabled={searchField.disabled}
                  iconFill={searchField.iconFill}
                  iconTone={searchField.iconTone}
                  label={searchField.label.trim() !== '' ? searchField.label : undefined}
                  placeholder={
                    searchField.placeholder.trim() !== ''
                      ? searchField.placeholder
                      : undefined
                  }
                  shape={searchField.shape}
                  size={searchField.size}
                  value={searchField.value}
                  onChange={(event) => updateSearchField('value', event.target.value)}
                  onClear={() => updateSearchField('value', '')}
                  {...searchFieldBorderProps}
                  {...searchFieldClearProps}
                  {...searchFieldShowIconProps}
                />
              )}

              {renderWidgetCard(
                'listbox',
                <Listbox
                  alignSelf="center"
                  disabled={listbox.disabled}
                  emptyMessage={
                    listbox.showSearch && listbox.emptyMessage.trim() !== ''
                      ? listbox.emptyMessage
                      : undefined
                  }
                  label={listbox.label.trim() !== '' ? listbox.label : undefined}
                  options={listboxDemoOptions}
                  placeItems={listbox.appearance === 'icon' ? 'center' : undefined}
                  placeholder={
                    listbox.placeholder.trim() !== '' ? listbox.placeholder : undefined
                  }
                  searchPlaceholder={
                    listbox.showSearch && listbox.searchPlaceholder.trim() !== ''
                      ? listbox.searchPlaceholder
                      : undefined
                  }
                  shape={listbox.shape}
                  showSearch={listbox.showSearch}
                  size={listbox.size}
                  value={listbox.value}
                  onChange={(value) => updateListbox('value', value)}
                  {...listboxAppearanceProps}
                  {...listboxMultipleProps}
                />
              )}

              {renderWidgetCard(
                'locale-picker',
                <LocalePicker
                  alignSelf="center"
                  disabled={localePicker.disabled}
                  emptyMessage={
                    localePicker.emptyMessage.trim() !== ''
                      ? localePicker.emptyMessage
                      : undefined
                  }
                  label={
                    localePicker.label.trim() !== '' ? localePicker.label : undefined
                  }
                  options={LOCALE_SLICE_OPTIONS}
                  placeItems={localePicker.appearance === 'icon' ? 'center' : undefined}
                  placeholder={
                    localePicker.placeholder.trim() !== ''
                      ? localePicker.placeholder
                      : undefined
                  }
                  searchPlaceholder={
                    localePicker.searchPlaceholder.trim() !== ''
                      ? localePicker.searchPlaceholder
                      : undefined
                  }
                  shape={localePicker.shape}
                  size={localePicker.size}
                  value={localePicker.value}
                  onChange={(value) =>
                    updateLocalePicker(
                      'value',
                      Array.isArray(value) ? (value[0] ?? '') : value
                    )
                  }
                  {...localePickerAppearanceProps}
                />
              )}

              {renderWidgetCard(
                'range-input',
                <RangeInput
                  alignSelf="center"
                  buttonShape={rangeInput.buttonShape}
                  buttonSize={rangeInput.buttonSize}
                  buttonText={rangeInput.buttonText}
                  buttonTextTone={rangeInput.buttonTextTone}
                  buttonTone={rangeInput.buttonTone}
                  disabled={rangeInput.disabled}
                  errorPlaceholder={
                    rangeInput.errorPlaceholder !== undefined &&
                    rangeInput.errorPlaceholder.trim() !== ''
                      ? rangeInput.errorPlaceholder
                      : undefined
                  }
                  formatActiveLabel={formatDemoRangeLabel}
                  fromPlaceholder={
                    rangeInput.fromPlaceholder.trim() !== ''
                      ? rangeInput.fromPlaceholder
                      : undefined
                  }
                  iconFill={rangeInput.iconFill}
                  iconPosition={rangeInput.iconPosition}
                  iconTone={rangeInput.iconTone}
                  inputShape={rangeInput.inputShape}
                  inputSize={rangeInput.inputSize}
                  label={rangeInput.label.trim() !== '' ? rangeInput.label : undefined}
                  placeholder={
                    rangeInput.placeholder.trim() !== ''
                      ? rangeInput.placeholder
                      : undefined
                  }
                  reserveErrorSpace={rangeInput.reserveErrorSpace}
                  shape={rangeInput.shape}
                  size={rangeInput.size}
                  toPlaceholder={
                    rangeInput.toPlaceholder.trim() !== ''
                      ? rangeInput.toPlaceholder
                      : undefined
                  }
                  {...rangeInputTitleProps}
                  validate={validateDemoRange}
                  {...(Object.keys(rangeInputValidationMessages).length > 0
                    ? { validationMessages: rangeInputValidationMessages }
                    : {})}
                  value={rangeInput.value}
                  onChange={(next) => updateRangeInput('value', next)}
                  {...rangeInputClearProps}
                />
              )}

              {renderWidgetCard(
                'date-range-input',
                <DateRangeInput
                  alignSelf="center"
                  buttonShape={dateRangeInput.buttonShape}
                  dayShape={dateRangeInput.dayShape}
                  disabled={dateRangeInput.disabled}
                  endDay={dateRangeInput.endDay}
                  label={dateRangeInput.label || undefined}
                  maxDay={dateRangeInput.maxDay || undefined}
                  minDay={dateRangeInput.minDay || undefined}
                  shape={dateRangeInput.shape}
                  size={dateRangeInput.size}
                  startDay={dateRangeInput.startDay}
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
                <Button
                  active={button.active}
                  alignSelf="center"
                  disabled={button.disabled}
                  label={button.label || undefined}
                  shape={button.shape}
                  size={button.size}
                  textTone={button.textTone}
                  tone={button.tone}
                  {...buttonIconProps}
                >
                  {button.text}
                </Button>
              )}

              {renderWidgetCard(
                'icon',
                <Icon
                  iconFill={icon.iconFill}
                  iconTone={icon.iconTone}
                  padding={icon.padding}
                  placeSelf="center"
                  shape={icon.shape}
                  showHover={icon.showHover}
                  size={icon.size}
                  {...iconBorderProps}
                  {...iconRoleProps}
                >
                  {getIcon(icon.iconKey)}
                </Icon>
              )}

              {renderWidgetCard(
                'segment-button',
                <SegmentButton
                  alignSelf="center"
                  center={
                    segmentButton.segmentCount === '3'
                      ? {
                          active: segmentButton.centerActive,
                          disabled: segmentButton.centerDisabled,
                          label: segmentButton.centerLabel,
                          textTone: segmentButton.centerTextTone,
                          tone: segmentButton.centerTone,
                          ...segmentButtonCenterIconProps,
                        }
                      : undefined
                  }
                  label={segmentButton.label || undefined}
                  left={{
                    active: segmentButton.leftActive,
                    disabled: segmentButton.leftDisabled,
                    label: segmentButton.leftLabel,
                    textTone: segmentButton.leftTextTone,
                    tone: segmentButton.leftTone,
                    ...segmentButtonLeftIconProps,
                  }}
                  right={{
                    active: segmentButton.rightActive,
                    disabled: segmentButton.rightDisabled,
                    label: segmentButton.rightLabel,
                    textTone: segmentButton.rightTextTone,
                    tone: segmentButton.rightTone,
                    ...segmentButtonRightIconProps,
                  }}
                  shape={segmentButton.shape}
                  size={segmentButton.size}
                />
              )}

              {renderWidgetCard(
                'tag',
                <Tag
                  placeSelf="center"
                  shape={tag.shape}
                  size={tag.size}
                  tinted={tag.tinted}
                  tone={tag.tone}
                  {...tagBorderProps}
                  {...tagShowDotProps}
                >
                  {tag.text.trim() !== '' ? tag.text : undefined}
                </Tag>
              )}

              {renderWidgetCard(
                'checkbox',
                <Checkbox
                  checked={checkbox.checked}
                  checkedMark={checkbox.checkedMark}
                  disabled={checkbox.disabled}
                  inverted={checkbox.inverted}
                  placeSelf="center"
                  size={checkbox.size}
                  uncheckedMark={checkbox.uncheckedMark}
                  onChange={(event) => updateCheckbox('checked', event.target.checked)}
                >
                  {checkbox.text.trim() !== '' ? checkbox.text : undefined}
                </Checkbox>
              )}

              {renderWidgetCard(
                'radio-button',
                <StyledRadioButtonDemo>
                  <RadioButton
                    checked={radioButton.selected === 'a'}
                    disabled={radioButton.disabledA}
                    name={RADIO_BUTTON_DEMO_NAME}
                    size={radioButton.size}
                    value="a"
                    onChange={() => updateRadioButton('selected', 'a')}
                  >
                    {radioButton.textA.trim() !== '' ? radioButton.textA : undefined}
                  </RadioButton>
                  <RadioButton
                    checked={radioButton.selected === 'b'}
                    disabled={radioButton.disabledB}
                    name={RADIO_BUTTON_DEMO_NAME}
                    size={radioButton.size}
                    value="b"
                    onChange={() => updateRadioButton('selected', 'b')}
                  >
                    {radioButton.textB.trim() !== '' ? radioButton.textB : undefined}
                  </RadioButton>
                </StyledRadioButtonDemo>
              )}

              {renderWidgetCard(
                'fieldset',
                <Fieldset
                  alignSelf="center"
                  borderTone={fieldset.borderTone}
                  inlineSize="100%"
                  minInlineSize="0"
                  {...(fieldset.legend.trim() !== '' ? { legend: fieldset.legend } : {})}
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
                <ProgressBar
                  aria-labelledby={PROGRESS_WIDGET_TITLE_ID}
                  showText={progress.showText}
                  size={progress.size}
                  tone={progress.tone}
                  value={progress.value}
                />,
                false,
                PROGRESS_WIDGET_TITLE_ID
              )}

              {renderWidgetCard(
                'spinner',
                <Spinner
                  minBlockSize="0"
                  placeSelf="center"
                  reserveTextSpace={spinner.reserveTextSpace}
                  size={spinner.size}
                  tone={spinner.tone}
                  {...spinnerTextProps}
                />
              )}

              {renderWidgetCard(
                'stepper',
                <Stepper
                  alignSelf="center"
                  disabled={stepper.disabled}
                  max={stepper.max}
                  min={stepper.min}
                  shape={stepper.shape}
                  size={stepper.size}
                  step={stepper.step}
                  suffix={stepper.suffix}
                  value={stepper.value}
                  onChange={(value) => updateStepper('value', value)}
                  {...(stepper.label.trim()
                    ? { label: stepper.label }
                    : { 'aria-label': DEMO_STEPPER_ARIA_LABEL })}
                />
              )}

              {renderWidgetCard(
                'switch',
                <Switch
                  checked={switchState.checked}
                  disabled={switchState.disabled}
                  placeSelf="center"
                  size={switchState.size}
                  tone={switchState.tone}
                  onChange={(event) => updateSwitch('checked', event.target.checked)}
                >
                  {switchState.text.trim() !== '' ? switchState.text : undefined}
                </Switch>
              )}

              {renderWidgetCard(
                'toast',
                <>
                  <Toast alignSelf="center" size={toast.size} tone={toast.tone}>
                    {toast.message}
                  </Toast>
                  <Button
                    alignSelf="center"
                    tone="primary"
                    onClick={() =>
                      showToast({
                        message: toast.message,
                        size: toast.size,
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
