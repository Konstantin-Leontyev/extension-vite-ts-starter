import { useState, type ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { SearchIcon } from '@icons/search';
import { SettingsIcon } from '@icons/settings';
import { Button } from '@ui/button';
import { Card } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { Listbox } from '@ui/listbox';
import { RadioButton } from '@ui/radio-button';
import { ScrollPort } from '@ui/scroll-port';
import { SegmentButton } from '@ui/segment-button';
import { Sidebar } from '@ui/sidebar';
import { type ThemeColors } from '@ui/theme';

import { ButtonSettings, type ButtonWidgetState } from './button-settings';
import { CheckboxSettings, type CheckboxWidgetState } from './checkbox-settings';
import {
  StyledDesignSystemWidgets,
  StyledMain,
  StyledRadioButtonDemo,
} from './design-system.styles';
import { InputSettings, type InputWidgetState } from './input-settings';
import { ListboxSettings, type ListboxWidgetState } from './listbox-settings';
import { LISTBOX_DEMO_OPTIONS } from './listbox-settings/options';
import {
  RadioButtonSettings,
  type RadioButtonWidgetState,
} from './radio-button-settings';
import {
  SegmentButtonSettings,
  type SegmentButtonWidgetState,
  type SegmentTextColor,
} from './segment-button-settings';

const SIDEBAR_ID = 'design-system-sidebar';
const INPUT_WIDGET_TITLE_ID = 'design-system-input-heading';
const BUTTON_WIDGET_TITLE_ID = 'design-system-button-heading';
const LISTBOX_WIDGET_TITLE_ID = 'design-system-listbox-heading';
const CHECKBOX_WIDGET_TITLE_ID = 'design-system-checkbox-heading';
const RADIO_BUTTON_WIDGET_TITLE_ID = 'design-system-radio-button-heading';
const SEGMENT_BUTTON_WIDGET_TITLE_ID = 'design-system-segment-button-heading';
const RADIO_BUTTON_DEMO_NAME = 'design-system-radio-button-demo';

type WidgetSettingsKey =
  | 'input'
  | 'listbox'
  | 'button'
  | 'segment-button'
  | 'checkbox'
  | 'radio-button';

const SETTINGS_TITLES: Record<WidgetSettingsKey, string> = {
  input: 'Input',
  listbox: 'Listbox',
  button: 'Button',
  'segment-button': 'Segment button',
  checkbox: 'Checkbox',
  'radio-button': 'Radio button',
};

/**
 * Локальный definite-якорь высоты видимой области: вьюпорт минус шапка (4.5rem) и нижний
 * инсет (0.5rem). Один и тот же предел отдаём плейграунду и панели сайдбара, чтобы обе
 * области совпадали по высоте и подстраивались под resize. dvb не зависит от грид-каркаса
 * body, поэтому ScrollPort внутри скролит контент, не растягивая страницу. Каркасная
 * альтернатива — в @ui/sidebar.
 */
const PLAYGROUND_MAX_BLOCK_SIZE = 'calc(100dvb - 5rem)';

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
  iconPosition: 'end',
  iconTone: 'default',
  textColor: 'default',
  shape: 'default',
  sizePreset: 'large',
  text: 'Button',
  tone: 'default',
  withIcon: false,
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

function segmentTextColor(
  color: SegmentTextColor,
  colors: ThemeColors
): string | undefined {
  return color === 'default' ? undefined : colors[color];
}

export function DesignSystemPage() {
  const theme = useTheme();
  const [activeSettings, setActiveSettings] = useState<WidgetSettingsKey | null>(null);
  const [input, setInput] = useState<InputWidgetState>(DEFAULT_INPUT_STATE);
  const [button, setButton] = useState<ButtonWidgetState>(DEFAULT_BUTTON_STATE);
  const [listbox, setListbox] = useState<ListboxWidgetState>(DEFAULT_LISTBOX_STATE);
  const [checkbox, setCheckbox] = useState<CheckboxWidgetState>(DEFAULT_CHECKBOX_STATE);
  const [radioButton, setRadioButton] = useState<RadioButtonWidgetState>(
    DEFAULT_RADIO_BUTTON_STATE
  );
  const [segmentButton, setSegmentButton] = useState<SegmentButtonWidgetState>(
    DEFAULT_SEGMENT_BUTTON_STATE
  );

  const settingsOpen = activeSettings !== null;

  function activateSettings(target: WidgetSettingsKey): void {
    if (!settingsOpen) {
      return;
    }

    setActiveSettings(target);
  }

  function toggleSettings(target: WidgetSettingsKey): void {
    setActiveSettings((current) => (current === target ? null : target));
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

  function updateSegmentButton<K extends keyof SegmentButtonWidgetState>(
    key: K,
    value: SegmentButtonWidgetState[K]
  ): void {
    setSegmentButton((current) => ({ ...current, [key]: value }));
  }

  function renderSettingsPanel(): ReactNode {
    if (activeSettings === 'input') {
      return <InputSettings state={input} onChange={updateInput} />;
    }

    if (activeSettings === 'listbox') {
      return <ListboxSettings state={listbox} onChange={updateListbox} />;
    }

    if (activeSettings === 'button') {
      return <ButtonSettings state={button} onChange={updateButton} />;
    }

    if (activeSettings === 'segment-button') {
      return (
        <SegmentButtonSettings state={segmentButton} onChange={updateSegmentButton} />
      );
    }

    if (activeSettings === 'checkbox') {
      return <CheckboxSettings state={checkbox} onChange={updateCheckbox} />;
    }

    if (activeSettings === 'radio-button') {
      return <RadioButtonSettings state={radioButton} onChange={updateRadioButton} />;
    }

    return null;
  }

  return (
    <StyledMain>
      <Sidebar
        id={SIDEBAR_ID}
        maxBlockSize={PLAYGROUND_MAX_BLOCK_SIZE}
        open={settingsOpen}
        paddingBlockEnd={8}
        paddingInlineStart={8}
        title={activeSettings ? SETTINGS_TITLES[activeSettings] : undefined}
        sidebarContent={<ScrollPort>{renderSettingsPanel()}</ScrollPort>}
        onClose={() => setActiveSettings(null)}
      >
        <Card as="section" maxBlockSize={PLAYGROUND_MAX_BLOCK_SIZE}>
          <ScrollPort>
            <StyledDesignSystemWidgets>
              <Card
                as="article"
                aria-labelledby={INPUT_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'input'}
                iconAriaLabel={
                  activeSettings === 'input' ? 'Close settings' : 'Open settings'
                }
                title="Input"
                titleId={INPUT_WIDGET_TITLE_ID}
                onClick={() => activateSettings('input')}
                onIconClick={() => toggleSettings('input')}
              >
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
              </Card>

              <Card
                as="article"
                aria-labelledby={LISTBOX_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'listbox'}
                iconAriaLabel={
                  activeSettings === 'listbox' ? 'Close settings' : 'Open settings'
                }
                title="Listbox"
                titleId={LISTBOX_WIDGET_TITLE_ID}
                onClick={() => activateSettings('listbox')}
                onIconClick={() => toggleSettings('listbox')}
              >
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
              </Card>

              <Card
                as="article"
                aria-labelledby={BUTTON_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'button'}
                iconAriaLabel={
                  activeSettings === 'button' ? 'Close settings' : 'Open settings'
                }
                title="Button"
                titleId={BUTTON_WIDGET_TITLE_ID}
                onClick={() => activateSettings('button')}
                onIconClick={() => toggleSettings('button')}
              >
                <Button
                  active={button.active}
                  alignSelf="center"
                  disabled={button.disabled}
                  icon={button.withIcon ? <SearchIcon /> : undefined}
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
              </Card>

              <Card
                as="article"
                aria-labelledby={SEGMENT_BUTTON_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'segment-button'}
                iconAriaLabel={
                  activeSettings === 'segment-button'
                    ? 'Close settings'
                    : 'Open settings'
                }
                title="Segment button"
                titleId={SEGMENT_BUTTON_WIDGET_TITLE_ID}
                onClick={() => activateSettings('segment-button')}
                onIconClick={() => toggleSettings('segment-button')}
              >
                <SegmentButton
                  alignSelf="center"
                  shape={segmentButton.shape}
                  sizePreset={segmentButton.sizePreset}
                  center={
                    segmentButton.segmentCount === '3'
                      ? {
                          disabled: segmentButton.centerDisabled,
                          text: segmentButton.centerText,
                          textColor: segmentTextColor(
                            segmentButton.centerTextColor,
                            theme.colors
                          ),
                        }
                      : undefined
                  }
                  left={{
                    disabled: segmentButton.leftDisabled,
                    text: segmentButton.leftText,
                    textColor: segmentTextColor(
                      segmentButton.leftTextColor,
                      theme.colors
                    ),
                  }}
                  right={{
                    disabled: segmentButton.rightDisabled,
                    text: segmentButton.rightText,
                    textColor: segmentTextColor(
                      segmentButton.rightTextColor,
                      theme.colors
                    ),
                  }}
                />
              </Card>

              <Card
                as="article"
                aria-labelledby={CHECKBOX_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'checkbox'}
                iconAriaLabel={
                  activeSettings === 'checkbox' ? 'Close settings' : 'Open settings'
                }
                title="Checkbox"
                titleId={CHECKBOX_WIDGET_TITLE_ID}
                onClick={() => activateSettings('checkbox')}
                onIconClick={() => toggleSettings('checkbox')}
              >
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
              </Card>

              <Card
                as="article"
                aria-labelledby={RADIO_BUTTON_WIDGET_TITLE_ID}
                background="background"
                icon={<SettingsIcon />}
                iconAriaControls={SIDEBAR_ID}
                iconAriaExpanded={activeSettings === 'radio-button'}
                iconAriaLabel={
                  activeSettings === 'radio-button' ? 'Close settings' : 'Open settings'
                }
                title="Radio button"
                titleId={RADIO_BUTTON_WIDGET_TITLE_ID}
                onClick={() => activateSettings('radio-button')}
                onIconClick={() => toggleSettings('radio-button')}
              >
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
              </Card>
            </StyledDesignSystemWidgets>
          </ScrollPort>
        </Card>
      </Sidebar>
    </StyledMain>
  );
}
