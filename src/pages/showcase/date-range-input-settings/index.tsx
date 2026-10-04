/**
 * Файл: `src/pages/showcase/date-range-input-settings/index.tsx`
 * Определяет панель настроек компонента DateRangeInput в витрине дизайн-системы.
 * Содержит контролы для изменения подписи, размера, формы, границ дней,
 * формы подсветки дня, формы кнопок подвала и состояния `disabled` в реальном времени.
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
import { SHAPE_PRESET_KEYS, type ShapePreset, type SizePreset } from '@ui/presets';

import { ControlGroup } from '../control-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * DateRangeInputWidgetState — представляет состояние настроек компонента DateRangeInput в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента DateRangeInput.
 * Используется для синхронизации значений между панелью управления и демонстрационным DateRangeInput.
 *
 * @property buttonShape — форма кнопок подвала панели. Стартует с формы контрола
 * @property dayShape — форма подсветки дня в панели. Стартует с формы контрола
 * @property disabled — включает недоступное состояние
 * @property endDay — буфер конечного дня диапазона в превью. В панель не выносится
 * @property label — подпись над рядом сегментов
 * @property maxDay — верхняя граница допустимых дней в формате ISO
 * @property minDay — нижняя граница допустимых дней в формате ISO
 * @property shape — форма поверхности
 * @property size — размер компонента
 * @property startDay — буфер начального дня диапазона в превью. В панель не выносится
 */
export type DateRangeInputWidgetState = {
  buttonShape: ShapePreset;
  dayShape: ShapePreset;
  disabled: boolean;
  endDay: string;
  label: string;
  maxDay: string;
  minDay: string;
  shape: ShapePreset;
  size: SizePreset;
  startDay: string;
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
      <ControlGroup
        label={state.label}
        shape={state.shape}
        size={state.size}
        onLabelChange={(label) => onChange('label', label)}
        onShapeChange={(shape) => {
          onChange('shape', shape);
          onChange('dayShape', shape);
          onChange('buttonShape', shape);
        }}
        onSizeChange={(size) => onChange('size', size)}
      />

      <Input
        label="Min day:"
        value={state.minDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('minDay', event.target.value);
        }}
        onClear={() => onChange('minDay', '')}
      />

      <Input
        label="Max day:"
        value={state.maxDay}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange('maxDay', event.target.value);
        }}
        onClear={() => onChange('maxDay', '')}
      />

      <ShapeListbox
        label="Day shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.dayShape}
        onChange={(shape) => onChange('dayShape', shape)}
      />

      <ShapeListbox
        label="Button shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.buttonShape}
        onChange={(shape) => onChange('buttonShape', shape)}
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
