/**
 * Файл: `src/pages/showcase/control-group/index.tsx`
 * Предоставляет компонент ControlGroup для настройки подписи, размера
 * и формы контрола в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - подпись контрола через проп `label`
 *  - обработчик изменения подписи через проп `onLabelChange`
 *  - обработчик изменения формы через проп `onShapeChange`
 *  - обработчик изменения размера через проп `onSizeChange`
 *  - форму контрола через проп `shape`
 *  - размер контрола через проп `size`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ControlGroup
 * 2. Типизировать пропсы через `ControlGroupProps`
 * 3. Рендерить единый блок настроек контрола в порядке: подпись через TextGroup
 *    с `labelPrefix="Label"`, затем `Size:` и `Shape:`. Порядок `Size:` → `Shape:` →
 *    `Label:` запрещён
 *
 * Потребители:
 *  - панели настроек витрины — настраивают подпись, размер и форму контрола:
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/listbox-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/date-range-input-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *     - `src/pages/showcase/stepper-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/locale-picker-settings/index.tsx`
 */

import {
  SHAPE_PRESET_KEYS,
  SIZE_PRESET_KEYS,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';

import { ShapeListbox } from '../shape-listbox';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * ControlGroupProps — представляет пропсы компонента ControlGroup.
 *
 * @property label — текущая подпись контрола
 * @property onLabelChange — обработчик изменения подписи
 * @property onShapeChange — обработчик изменения формы
 * @property onSizeChange — обработчик изменения размера
 * @property shape — текущая форма контрола
 * @property size — текущий размер контрола
 */
type ControlGroupProps = {
  label: string;
  onLabelChange: (label: string) => void;
  onShapeChange: (shape: ShapePreset) => void;
  onSizeChange: (size: SizePreset) => void;
  shape: ShapePreset;
  size: SizePreset;
};

/**
 * ControlGroup — отображает блок настроек подписи, размера и формы контрола
 * в витрине дизайн-системы.
 *
 * @example
 * <ControlGroup
 *   label={state.label}
 *   shape={state.shape}
 *   size={state.size}
 *   onLabelChange={(label) => onChange('label', label)}
 *   onShapeChange={(shape) => onChange('shape', shape)}
 *   onSizeChange={(size) => onChange('size', size)}
 * />
 */
export function ControlGroup({
  label,
  onLabelChange,
  onShapeChange,
  onSizeChange,
  shape,
  size,
}: ControlGroupProps) {
  return (
    <>
      <TextGroup
        contents={[
          {
            value: label,
            onChange: onLabelChange,
          },
        ]}
        labelPrefix="Label"
      />

      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={size}
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
