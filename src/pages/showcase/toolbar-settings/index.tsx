/**
 * Файл: `src/pages/showcase/toolbar-settings/index.tsx`
 * Определяет панель настроек компонента Toolbar в витрине дизайн-системы.
 * Содержит контролы для изменения размера, формы, рамки, тени, заливки,
 * рамки и тени действий и набора действий в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ToolbarWidgetState`
 * 2. Экспортировать компонент `ToolbarSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Toolbar
 */

import { ICON_SIZE_PRESET_KEYS, getIconPadding, type IconSizePreset } from '@ui/icon';
import { SHAPE_PRESET_KEYS, type ShapePreset } from '@ui/presets';
import { type SurfaceBackgroundPreset } from '@ui/surface';
import { type TonePreset } from '@ui/tones';

import { ActionBorderGroup } from '../action-border-group';
import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { IconRowGroup, type IconRowGroupAction } from '../icon-row-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * ToolbarWidgetState — представляет состояние настроек компонента Toolbar в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Toolbar.
 * `actions` хранит демо-ряд действий с ключом иконки, подсказкой, отступом окна
 * Icon и флагами `active` и `disabled` вместо `ReactNode` и обработчика.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Toolbar.
 *
 * @property actions — демо-ряд действий
 * @property background — заливка панели инструментов
 * @property borderTone — тон рамки
 * @property shape — форма панели
 * @property showActionBorder — включает рамку действий
 * @property showActionShadow — включает тень действий при включённой рамке
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 * @property size — размер окна действия
 */
export type ToolbarWidgetState = {
  actions: IconRowGroupAction[];
  background: SurfaceBackgroundPreset;
  borderTone: TonePreset;
  shape: ShapePreset;
  showActionBorder: boolean;
  showActionShadow: boolean;
  showBorder: boolean;
  showShadow: boolean;
  size: IconSizePreset;
};

/**
 * ToolbarSettingsProps — представляет пропсы компонента ToolbarSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек панели инструментов
 */
type ToolbarSettingsProps = {
  onChange: <K extends keyof ToolbarWidgetState>(
    key: K,
    value: ToolbarWidgetState[K]
  ) => void;
  state: ToolbarWidgetState;
};

/**
 * ToolbarSettings — отображает панель настроек Toolbar в витрине дизайн-системы.
 *
 * @example
 * <ToolbarSettings state={toolbar} onChange={updateToolbar} />
 */
export function ToolbarSettings({ onChange, state }: ToolbarSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={ICON_SIZE_PRESET_KEYS}
        value={state.size}
        onChange={(size) => {
          onChange('size', size);
          onChange(
            'actions',
            state.actions.map((action) => ({
              ...action,
              iconPadding: getIconPadding(size),
            }))
          );
        }}
      />

      <ShapeListbox
        label="Shape:"
        shapes={SHAPE_PRESET_KEYS}
        value={state.shape}
        onChange={(shape) => onChange('shape', shape)}
      />

      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <BackgroundListbox
        label="Background:"
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      <ActionBorderGroup
        showActionBorder={state.showActionBorder}
        showActionShadow={state.showActionShadow}
        onShowActionBorderChange={(show) => onChange('showActionBorder', show)}
        onShowActionShadowChange={(show) => onChange('showActionShadow', show)}
      />

      <IconRowGroup
        actions={state.actions}
        defaultIconPadding={getIconPadding(state.size)}
        onActionsChange={(actions) => onChange('actions', actions)}
      />
    </StyledSettingsForm>
  );
}
