/**
 * Файл: `src/pages/showcase/icon-row-group/index.tsx`
 * Предоставляет компонент IconRowGroup для настройки набора действий ряда
 * иконочных кнопок в витрине дизайн-системы.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - набор действий через проп `actions`
 *  - отступ окна нового действия через проп `defaultIconPadding`
 *  - обработчик изменения набора через проп `onActionsChange`
 *
 * Основные задачи:
 * 1. Экспортировать компонент IconRowGroup
 * 2. Типизировать пропсы через `IconRowGroupProps` и действие через `IconRowGroupAction`
 * 3. Рендерить блок каждого действия в порядке: глиф, отступ окна, отключение,
 *    удаление, затем кнопку добавления
 * 4. Добавлять, удалять и обновлять поле действия внутри сателлита
 *
 * Потребители:
 *  - панели настроек витрины — настраивают действия ряда:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { Fragment, type ChangeEvent } from 'react';

import { Button } from '@ui/button';
import { Checkbox } from '@ui/checkbox';
import { Combobox } from '@ui/combobox';
import { ICON_SIZE_PRESET_KEYS, getIconPadding, type IconSizePreset } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';

import { COMBOBOX_OPTIONS, type IconKey } from '../showcase-icon-options';
import { SizeListbox } from '../size-listbox';

/**
 * DEFAULT_ICON_ROW_GROUP_ICON_KEY — задаёт ключ глифа нового действия по умолчанию.
 * Используется при добавлении действия.
 */
const DEFAULT_ICON_ROW_GROUP_ICON_KEY: IconKey = 'settings';

/**
 * DEFAULT_ICON_ROW_GROUP_ICON_PADDING_SIZE — задаёт ключ ряда для контрола отступа
 * окна по умолчанию.
 * Используется, когда текущий отступ не совпадает ни с одним пресетом.
 */
const DEFAULT_ICON_ROW_GROUP_ICON_PADDING_SIZE: IconSizePreset = 'normal';

/**
 * IconRowGroupAction — представляет одно действие ряда в состоянии витрины.
 *
 * @property disabled — включает недоступное состояние
 * @property iconKey — ключ глифа из витринного набора
 * @property iconPadding — отступ окна Icon
 */
export type IconRowGroupAction = {
  disabled: boolean;
  iconKey: IconKey;
  iconPadding: SpacingValue;
};

/**
 * resolveIconPaddingSizePreset — возвращает ключ размерного ряда под текущий
 * `iconPadding`.
 *
 * @param iconPadding текущий отступ окна Icon
 * @returns ключ ряда для контрола отступа окна Icon
 */
function resolveIconPaddingSizePreset(iconPadding: SpacingValue): IconSizePreset {
  return (
    ICON_SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === iconPadding) ??
    DEFAULT_ICON_ROW_GROUP_ICON_PADDING_SIZE
  );
}

/**
 * IconRowGroupProps — представляет пропсы компонента IconRowGroup.
 *
 * @property actions — текущий набор действий
 * @property defaultIconPadding — отступ окна у нового действия
 * @property onActionsChange — обработчик изменения набора
 */
type IconRowGroupProps = {
  actions: readonly IconRowGroupAction[];
  defaultIconPadding: SpacingValue;
  onActionsChange: (actions: IconRowGroupAction[]) => void;
};

/**
 * IconRowGroup — отображает блоки настроек действий ряда и кнопку добавления
 * в витрине дизайн-системы.
 *
 * @example
 * <IconRowGroup
 *   actions={state.headerActions}
 *   defaultIconPadding={getIconPadding(CARD_HEADER_ACTION_SIZE_PRESET)}
 *   onActionsChange={(actions) => onChange('headerActions', actions)}
 * />
 */
export function IconRowGroup({
  actions,
  defaultIconPadding,
  onActionsChange,
}: IconRowGroupProps) {
  function updateAction(index: number, patch: Partial<IconRowGroupAction>): void {
    onActionsChange(
      actions.map((action, actionIndex) =>
        actionIndex === index ? { ...action, ...patch } : action
      )
    );
  }

  function handleAddAction(): void {
    onActionsChange([
      ...actions,
      {
        disabled: false,
        iconKey: DEFAULT_ICON_ROW_GROUP_ICON_KEY,
        iconPadding: defaultIconPadding,
      },
    ]);
  }

  function handleRemoveAction(index: number): void {
    onActionsChange(actions.filter((_action, actionIndex) => actionIndex !== index));
  }

  return (
    <>
      {actions.map((action, index) => (
        <Fragment key={index}>
          <Combobox
            label={`Action ${index + 1} icon:`}
            options={COMBOBOX_OPTIONS}
            value={action.iconKey}
            onChange={(value) => updateAction(index, { iconKey: value as IconKey })}
          />

          <SizeListbox
            label={`Action ${index + 1} icon padding:`}
            sizes={ICON_SIZE_PRESET_KEYS}
            value={resolveIconPaddingSizePreset(action.iconPadding)}
            onChange={(size) =>
              updateAction(index, { iconPadding: getIconPadding(size) })
            }
          />

          <Checkbox
            checked={action.disabled}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateAction(index, { disabled: event.target.checked })
            }
          >
            {`Disable action ${index + 1}`}
          </Checkbox>

          <Button
            tone="danger"
            onClick={() => {
              handleRemoveAction(index);
            }}
          >
            Remove action
          </Button>
        </Fragment>
      ))}

      <Button tone="primary" onClick={handleAddAction}>
        Add action
      </Button>
    </>
  );
}
