/**
 * Файл: `src/pages/showcase/segment-button-settings/index.tsx`
 * Определяет панель настроек компонента SegmentButton в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, числа сегментов, тона сегментов,
 * иконок, текстов, типографики и состояний `disabled` в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SegmentButtonWidgetState`
 * 2. Экспортировать компонент `SegmentButtonSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета SegmentButton
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { type IconPosition } from '@ui/icon';
import { Listbox, type ListboxOption } from '@ui/listbox';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSegmentButtonTextSize } from '@ui/segment-button';
import { type TextSizePreset, type TextTone } from '@ui/text';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { IconGroup } from '../icon-group';
import { ShapeListbox } from '../shape-listbox';
import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { ToneListbox } from '../tone-listbox';

/**
 * SegmentButtonWidgetState — представляет состояние настроек компонента SegmentButton в витрине дизайн-системы.
 * Часть ключей задаёт общие пропсы ряда, остальные — параметры сегментов A, B и C.
 * Витринные ключи: `segmentCount` управляет числом сегментов в превью, `*WithIcon` и
 * `*IconKey` выбирают иконки сегментов, `*Disabled` включает недоступность сегмента.
 * Используется для синхронизации значений между панелью управления и демонстрационным SegmentButton.
 *
 * @property centerDisabled — включает недоступность среднего сегмента
 * @property centerIconFill — тон глифа иконки среднего сегмента
 * @property centerIconKey — витринный ключ выбора иконки среднего сегмента
 * @property centerIconPosition — позиция иконки среднего сегмента
 * @property centerText — текст среднего сегмента
 * @property centerTextTone — тон текста среднего сегмента
 * @property centerTone — тон заливки среднего сегмента
 * @property centerWithIcon — витринный ключ показа иконки среднего сегмента. Выключенный — сегмент без иконки
 * @property leftDisabled — включает недоступность левого сегмента
 * @property leftIconFill — тон глифа иконки левого сегмента
 * @property leftIconKey — витринный ключ выбора иконки левого сегмента
 * @property leftIconPosition — позиция иконки левого сегмента
 * @property leftText — текст левого сегмента
 * @property leftTextTone — тон текста левого сегмента
 * @property leftTone — тон заливки левого сегмента
 * @property leftWithIcon — витринный ключ показа иконки левого сегмента. Выключенный — сегмент без иконки
 * @property rightDisabled — включает недоступность правого сегмента
 * @property rightIconFill — тон глифа иконки правого сегмента
 * @property rightIconKey — витринный ключ выбора иконки правого сегмента
 * @property rightIconPosition — позиция иконки правого сегмента
 * @property rightText — текст правого сегмента
 * @property rightTextTone — тон текста правого сегмента
 * @property rightTone — тон заливки правого сегмента
 * @property rightWithIcon — витринный ключ показа иконки правого сегмента. Выключенный — сегмент без иконки
 * @property segmentCount — витринный ключ числа сегментов в превью
 * @property shape — форма оболочки ряда
 * @property sizePreset — размер компонента
 * @property textItalic — включает курсив текста сегмента
 * @property textSize — размер текста сегмента
 */
export type SegmentButtonWidgetState = {
  centerDisabled: boolean;
  centerIconFill: TonePreset;
  centerIconKey: IconKey;
  centerIconPosition: IconPosition;
  centerText: string;
  centerTextTone: TextTone;
  centerTone: TonePreset;
  centerWithIcon: boolean;
  leftDisabled: boolean;
  leftIconFill: TonePreset;
  leftIconKey: IconKey;
  leftIconPosition: IconPosition;
  leftText: string;
  leftTextTone: TextTone;
  leftTone: TonePreset;
  leftWithIcon: boolean;
  rightDisabled: boolean;
  rightIconFill: TonePreset;
  rightIconKey: IconKey;
  rightIconPosition: IconPosition;
  rightText: string;
  rightTextTone: TextTone;
  rightTone: TonePreset;
  rightWithIcon: boolean;
  segmentCount: '2' | '3';
  shape: ShapePreset;
  sizePreset: SizePreset;
  textItalic: boolean;
  textSize: TextSizePreset;
};

/**
 * SEGMENT_COUNT_OPTIONS — задаёт опции листбокса числа сегментов.
 * Используется в `Listbox` числа сегментов внутри SegmentButtonSettings.
 */
const SEGMENT_COUNT_OPTIONS: ListboxOption[] = [
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];

/**
 * SegmentButtonSettingsProps — представляет пропсы компонента SegmentButtonSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек SegmentButton
 */
type SegmentButtonSettingsProps = {
  onChange: <K extends keyof SegmentButtonWidgetState>(
    key: K,
    value: SegmentButtonWidgetState[K]
  ) => void;
  state: SegmentButtonWidgetState;
};

/**
 * SegmentButtonSettings — отображает панель настроек SegmentButton в витрине дизайн-системы.
 *
 * @example
 * <SegmentButtonSettings state={segmentButton} onChange={updateSegmentButton} />
 */
export function SegmentButtonSettings({ onChange, state }: SegmentButtonSettingsProps) {
  const rightName = state.segmentCount === '3' ? 'C' : 'B';

  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => {
          onChange('sizePreset', size);
          onChange('textSize', getSegmentButtonTextSize(size));
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <Listbox
        label="Segments:"
        options={SEGMENT_COUNT_OPTIONS}
        value={state.segmentCount}
        onChange={(value) =>
          onChange('segmentCount', value as SegmentButtonWidgetState['segmentCount'])
        }
      />

      <ToneListbox
        label="Tone A:"
        tones={TONE_PRESET_KEYS}
        value={state.leftTone}
        onChange={(tone) => onChange('leftTone', tone)}
      />

      <IconGroup
        fill={state.leftIconFill}
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.leftIconKey}
        labelPrefix="Icon A"
        position={state.leftIconPosition}
        show={state.leftWithIcon}
        onFillChange={(tone) => onChange('leftIconFill', tone)}
        onIconChange={(value) => onChange('leftIconKey', value as IconKey)}
        onPositionChange={(position) => onChange('leftIconPosition', position)}
        onShowChange={(checked) => onChange('leftWithIcon', checked)}
      />

      {state.segmentCount === '3' && (
        <>
          <ToneListbox
            label="Tone B:"
            tones={TONE_PRESET_KEYS}
            value={state.centerTone}
            onChange={(tone) => onChange('centerTone', tone)}
          />

          <IconGroup
            fill={state.centerIconFill}
            iconOptions={COMBOBOX_OPTIONS}
            iconValue={state.centerIconKey}
            labelPrefix="Icon B"
            position={state.centerIconPosition}
            show={state.centerWithIcon}
            onFillChange={(tone) => onChange('centerIconFill', tone)}
            onIconChange={(value) => onChange('centerIconKey', value as IconKey)}
            onPositionChange={(position) => onChange('centerIconPosition', position)}
            onShowChange={(checked) => onChange('centerWithIcon', checked)}
          />
        </>
      )}

      <ToneListbox
        label={`Tone ${rightName}:`}
        tones={TONE_PRESET_KEYS}
        value={state.rightTone}
        onChange={(tone) => onChange('rightTone', tone)}
      />

      <IconGroup
        fill={state.rightIconFill}
        iconOptions={COMBOBOX_OPTIONS}
        iconValue={state.rightIconKey}
        labelPrefix={`Icon ${rightName}`}
        position={state.rightIconPosition}
        show={state.rightWithIcon}
        onFillChange={(tone) => onChange('rightIconFill', tone)}
        onIconChange={(value) => onChange('rightIconKey', value as IconKey)}
        onPositionChange={(position) => onChange('rightIconPosition', position)}
        onShowChange={(checked) => onChange('rightWithIcon', checked)}
      />

      <TextGroup
        contents={[
          {
            label: 'Text A:',
            value: state.leftText,
            onChange: (value) => onChange('leftText', value),
          },
          ...(state.segmentCount === '3'
            ? [
                {
                  label: 'Text B:',
                  value: state.centerText,
                  onChange: (value: string) => onChange('centerText', value),
                },
              ]
            : []),
          {
            label: state.segmentCount === '3' ? 'Text C:' : 'Text B:',
            value: state.rightText,
            onChange: (value) => onChange('rightText', value),
          },
        ]}
        italic={state.textItalic}
        size={state.textSize}
        tones={[
          {
            label: 'Text A tone:',
            value: state.leftTextTone,
            onChange: (tone) => onChange('leftTextTone', tone),
          },
          ...(state.segmentCount === '3'
            ? [
                {
                  label: 'Text B tone:',
                  value: state.centerTextTone,
                  onChange: (tone: TextTone) => onChange('centerTextTone', tone),
                },
              ]
            : []),
          {
            label: state.segmentCount === '3' ? 'Text C tone:' : 'Text B tone:',
            value: state.rightTextTone,
            onChange: (tone) => onChange('rightTextTone', tone),
          },
        ]}
        onItalicChange={(value) => onChange('textItalic', value)}
        onSizeChange={(size) => onChange('textSize', size)}
      />

      <Checkbox
        checked={state.leftDisabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('leftDisabled', event.target.checked)
        }
      >
        Disable A
      </Checkbox>

      {state.segmentCount === '3' && (
        <Checkbox
          checked={state.centerDisabled}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('centerDisabled', event.target.checked)
          }
        >
          Disable B
        </Checkbox>
      )}

      <Checkbox
        checked={state.rightDisabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('rightDisabled', event.target.checked)
        }
      >
        {state.segmentCount === '3' ? 'Disable C' : 'Disable B'}
      </Checkbox>
    </StyledSettingsForm>
  );
}
