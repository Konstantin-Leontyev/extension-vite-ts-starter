/**
 * Файл: `src/pages/showcase/control-group/index.tsx`
 * Предоставляет компонент ControlGroup для настройки подписи и осей размера
 * и формы контрола в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись контрола через проп `label`
 *  - обработчик изменения подписи через проп `onLabelChange`
 *  - обработчик изменения формы через проп `onShapeChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - форму контрола через проп `shape`
 *  - размер контрола через проп `sizePreset`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ControlGroup
 * 2. Типизировать пропсы через `ControlGroupProps`
 * 3. Рендерить единый блок настроек контрола в порядке: подпись, размер и форма —
 *    `Label:` → `Size:` → `Shape:`. Порядок `Size:` → `Shape:` → `Label:` запрещён
 *
 * Потребители:
 *  - панели настроек витрины — настраивают подпись и оси контрола:
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/combobox-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Input } from '@ui/input';
import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';

import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';

/**
 * ControlGroupProps — представляет пропсы компонента ControlGroup.
 *
 * @property label — текущая подпись контрола
 * @property onLabelChange — обработчик изменения подписи
 * @property onShapeChange — обработчик изменения формы
 * @property onSizeChange — обработчик изменения размера
 * @property shape — текущая форма контрола
 * @property sizePreset — текущий размер контрола
 */
type ControlGroupProps = {
  label: string;
  onLabelChange: (label: string) => void;
  onShapeChange: (shape: ShapePreset) => void;
  onSizeChange: (size: SizePreset) => void;
  shape: ShapePreset;
  sizePreset: SizePreset;
};

/**
 * ControlGroup — отображает блок настроек подписи, размера и формы контрола
 * в витрине дизайн-системы.
 *
 * @example
 * <ControlGroup
 *   label={state.label}
 *   shape={state.shape}
 *   sizePreset={state.sizePreset}
 *   onLabelChange={(label) => onChange('label', label)}
 *   onShapeChange={(shape) => onChange('shape', shape)}
 *   onSizeChange={(size) => onChange('sizePreset', size)}
 * />
 */
export function ControlGroup({
  label,
  onLabelChange,
  onShapeChange,
  onSizeChange,
  shape,
  sizePreset,
}: ControlGroupProps) {
  return (
    <>
      <Input
        label="Label:"
        reserveErrorSpace={false}
        value={label}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onLabelChange(event.target.value)
        }
      />

      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={sizePreset}
        onChange={onSizeChange}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={shape}
        onChange={onShapeChange}
      />
    </>
  );
}
