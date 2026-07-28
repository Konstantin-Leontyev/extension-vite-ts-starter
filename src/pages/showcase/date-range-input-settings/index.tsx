/**
 * Файл: `src/pages/showcase/date-range-input-settings/index.tsx`
 * Определяет панель настроек компонента DateRangeInput в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, текстов `title` сегментов,
 * границ диапазона, границ дней, формы подсветки дня и состояния `disabled`
 * в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `DateRangeInputWidgetState`
 * 2. Экспортировать компонент `DateRangeInputSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета DateRangeInput
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';

import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * DateRangeInputWidgetState — представляет состояние настроек компонента DateRangeInput в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента DateRangeInput.
 * Используется для синхронизации значений между панелью управления и демонстрационным DateRangeInput.
 *
 * @property dayShape — форма подсветки дня в панели. Без значения превью берёт `shape`
 * @property disabled — включает недоступное состояние
 * @property endDay — конечный день диапазона в превью в формате ISO
 * @property endLabel — текст `title` конечного сегмента и фрагмент `aria-label` сброса
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 * @property startDay — начальный день диапазона в превью в формате ISO
 * @property startLabel — текст `title` начального сегмента и фрагмент `aria-label` сброса
 */
export type DateRangeInputWidgetState = {
  dayShape?: ShapePreset;
  disabled: boolean;
  endDay: string;
  endLabel: string;
  maxDay: string;
  minDay: string;
  shape: ShapePreset;
  sizePreset: SizePreset;
  startDay: string;
  startLabel: string;
};

/**
 * DateRangeInputSettingsProps — представляет пропсы компонента DateRangeInputSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек DateRangeInput
 */
type DateRangeInputSettingsProps = {
  onChange: <K extends keyof DateRangeInputWidgetState>(
    key: K,
    value: DateRangeInputWidgetState[K]
  ) => void;
  state: DateRangeInputWidgetState;
};

/**
 * DateRangeInputSettings — отображает панель настроек DateRangeInput в витрине дизайн-системы.
 *
 * @example
 * <DateRangeInputSettings state={dateRangeInput} onChange={updateDateRangeInput} />
 */
export function DateRangeInputSettings({
  onChange,
  state,
}: DateRangeInputSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <Input
        label="Start label:"
        reserveErrorSpace={false}
        value={state.startLabel}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('startLabel', event.target.value);
        }}
      />

      <Input
        label="End label:"
        reserveErrorSpace={false}
        value={state.endLabel}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('endLabel', event.target.value);
        }}
      />

      <Input
        label="Start day:"
        reserveErrorSpace={false}
        value={state.startDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('startDay', event.target.value);
        }}
      />

      <Input
        label="End day:"
        reserveErrorSpace={false}
        value={state.endDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('endDay', event.target.value);
        }}
      />

      <Input
        label="Min day:"
        reserveErrorSpace={false}
        value={state.minDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('minDay', event.target.value);
        }}
      />

      <Input
        label="Max day:"
        reserveErrorSpace={false}
        value={state.maxDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('maxDay', event.target.value);
        }}
      />

      <ShapeListbox
        label="Day shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.dayShape ?? state.shape}
        onChange={(shape) => onChange('dayShape', shape)}
      />

      <Checkbox
        checked={state.disabled}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('disabled', event.target.checked);
        }}
      >
        Disabled
      </Checkbox>
    </StyledSettingsForm>
  );
}
