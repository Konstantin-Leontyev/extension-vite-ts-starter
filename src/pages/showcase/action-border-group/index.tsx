/**
 * Файл: `src/pages/showcase/action-border-group/index.tsx`
 * Предоставляет компонент ActionBorderGroup для настройки рамки и тени окон ряда
 * действий в витрине дизайн-системы.
 * Отделяет рамку окон ряда действий от рамки поверхности Card и панели Toolbar.
 * Оставляет рамку поверхности в BorderGroup.
 * Используется только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - показ рамки окон ряда через проп `showActionBorder`
 *  - показ тени окон ряда через проп `showActionShadow`
 *  - обработчик показа рамки окон ряда через проп `onShowActionBorderChange`
 *  - обработчик показа тени окон ряда через проп `onShowActionShadowChange`
 *
 * Основные задачи:
 * 1. Экспортировать компонент ActionBorderGroup
 * 2. Типизировать пропсы через `ActionBorderGroupProps`
 * 3. Рендерить пару чекбоксов рамки окон ряда: показ рамки, при включённой рамке —
 *    показ тени
 *
 * Потребители:
 *  - панели настроек витрины — настраивают рамку окон ряда действий:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/toolbar-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';

/**
 * ActionBorderGroupProps — представляет пропсы компонента ActionBorderGroup.
 *
 * @property onShowActionBorderChange — обработчик показа рамки окон ряда
 * @property onShowActionShadowChange — обработчик показа тени окон ряда
 * @property showActionBorder — включает рамку окон ряда
 * @property showActionShadow — включает тень окон ряда при включённой рамке
 */
type ActionBorderGroupProps = {
  onShowActionBorderChange: (show: boolean) => void;
  onShowActionShadowChange: (show: boolean) => void;
  showActionBorder: boolean;
  showActionShadow: boolean;
};

/**
 * ActionBorderGroup — отображает группу настроек рамки и тени окон ряда действий
 * в витрине дизайн-системы.
 *
 * @example
 * <ActionBorderGroup
 *   showActionBorder={state.showActionBorder}
 *   showActionShadow={state.showActionShadow}
 *   onShowActionBorderChange={(show) => onChange('showActionBorder', show)}
 *   onShowActionShadowChange={(show) => onChange('showActionShadow', show)}
 * />
 */
export function ActionBorderGroup({
  onShowActionBorderChange,
  onShowActionShadowChange,
  showActionBorder,
  showActionShadow,
}: ActionBorderGroupProps) {
  return (
    <>
      <Checkbox
        checked={showActionBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onShowActionBorderChange(event.target.checked)
        }
      >
        Show action border
      </Checkbox>

      {showActionBorder && (
        <Checkbox
          checked={showActionShadow}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onShowActionShadowChange(event.target.checked)
          }
        >
          Show action shadow
        </Checkbox>
      )}
    </>
  );
}
