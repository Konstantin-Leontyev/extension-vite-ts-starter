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
 * 2. Типизировать пропсы через `IconRowGroupProps`
 * 3. Реэкспортировать тип `IconRowGroupAction`
 * 4. Рендерить блок каждого действия в порядке: глиф, подсказка, отступ окна,
 *    Active, отключение, удаление, затем кнопку добавления
 * 5. Добавлять, удалять и обновлять поле действия внутри сателлита
 * 6. Собирать подписи контролов через `resolveGroupFieldLabel`,
 *    `resolveGroupContentLabel` и `resolveGroupFlagLabel` из
 *    `src/pages/showcase/showcase-labels.ts`
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

import {
  COMBOBOX_OPTIONS,
  resolveIconPaddingSizePreset,
  type IconKey,
} from '../showcase-icon-options';
import {
  resolveGroupContentLabel,
  resolveGroupFieldLabel,
  resolveGroupFlagLabel,
} from '../showcase-labels';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';
import { type IconRowGroupAction } from './icon-row-group';

export type { IconRowGroupAction };

/**
 * ICON_ROW_GROUP_ICON_KEY — задаёт ключ глифа нового действия.
 * Используется при добавлении действия.
 */
const ICON_ROW_GROUP_ICON_KEY: IconKey = 'settings';

/**
 * ICON_ROW_GROUP_ICON_PADDING_SIZE — задаёт запасной ключ ряда для контрола отступа
 * окна.
 * Используется, когда текущий отступ не совпадает ни с одним пресетом.
 */
const ICON_ROW_GROUP_ICON_PADDING_SIZE: IconSizePreset = 'normal';

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
        active: false,
        disabled: false,
        iconKey: ICON_ROW_GROUP_ICON_KEY,
        iconPadding: defaultIconPadding,
        title: '',
      },
    ]);
  }

  function handleRemoveAction(index: number): void {
    onActionsChange(actions.filter((_action, actionIndex) => actionIndex !== index));
  }

  return (
    <>
      {actions.map((action, index) => {
        const actionPrefix = `Action ${index + 1}`;

        return (
          <Fragment key={index}>
            <Combobox
              label={resolveGroupContentLabel(actionPrefix, 'Icon')}
              options={COMBOBOX_OPTIONS}
              value={action.iconKey}
              onChange={(value) => updateAction(index, { iconKey: value as IconKey })}
            />

            <TextGroup
              contents={[
                {
                  onChange: (value) => updateAction(index, { title: value }),
                  value: action.title,
                },
              ]}
              labelPrefix={`${actionPrefix} tooltip`}
            />

            <SizeListbox
              label={resolveGroupFieldLabel(actionPrefix, 'padding')}
              sizes={ICON_SIZE_PRESET_KEYS}
              value={resolveIconPaddingSizePreset(
                action.iconPadding,
                ICON_ROW_GROUP_ICON_PADDING_SIZE
              )}
              onChange={(size) =>
                updateAction(index, { iconPadding: getIconPadding(size) })
              }
            />

            <Checkbox
              checked={action.active}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateAction(index, { active: event.target.checked })
              }
            >
              Active
            </Checkbox>

            <Checkbox
              checked={action.disabled}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                updateAction(index, { disabled: event.target.checked })
              }
            >
              {resolveGroupFlagLabel(actionPrefix, 'Action', 'Disable')}
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
        );
      })}

      <Button tone="primary" onClick={handleAddAction}>
        Add action
      </Button>
    </>
  );
}
