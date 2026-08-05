/**
 * Файл: `src/pages/showcase/table-settings/index.tsx`
 * Определяет панель настроек компонента Table в витрине дизайн-системы.
 * Содержит контролы для изменения размера, рамки, полос, нумерации, выбора строк
 * и режима редактирования в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `TableWidgetState`
 * 2. Экспортировать компонент `TableSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета таблицы
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

/**
 * TableWidgetState — представляет состояние настроек компонента Table в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Table, кроме витринных ключей:
 * `showIndexColumn` управляет колонкой нумерации каталога в превью, `continuousNumbering`
 * задаёт сквозную нумерацию членов групп, `separateCheckboxColumn` выносит чекбокс
 * в отдельную колонку.
 * Используется для синхронизации значений между панелью управления и демонстрационной таблицей.
 *
 * @property checkable — включает режим выбора строк
 * @property continuousNumbering — витринный ключ сквозной нумерации членов групп. Выключенный —
 *   нумерация сбрасывается в каждой группе
 * @property editable — включает добавление и редактирование строк
 * @property hoverHighlight — включает подсветку строки при наведении
 * @property separateCheckboxColumn — витринный ключ отдельной колонки чекбокса. Выключенный —
 *   чекбокс рендерится в колонке Product
 * @property showBorder — включает рамку вокруг таблицы
 * @property showIndexColumn — витринный ключ показа колонки нумерации каталога. Выключенный —
 *   таблица без колонки `#`
 * @property sizePreset — размер таблицы
 * @property striped — включает чередование фона строк
 */
export type TableWidgetState = {
  checkable: boolean;
  continuousNumbering: boolean;
  editable: boolean;
  hoverHighlight: boolean;
  separateCheckboxColumn: boolean;
  showBorder: boolean;
  showIndexColumn: boolean;
  sizePreset: SizePreset;
  striped: boolean;
};

/**
 * TableSettingsProps — представляет пропсы компонента TableSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек таблицы
 */
type TableSettingsProps = {
  onChange: <K extends keyof TableWidgetState>(
    key: K,
    value: TableWidgetState[K]
  ) => void;
  state: TableWidgetState;
};

/**
 * TableSettings — отображает панель настроек Table в витрине дизайн-системы.
 *
 * @example
 * <TableSettings state={table} onChange={updateTable} />
 */
export function TableSettings({ onChange, state }: TableSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <Checkbox
        checked={state.showBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showBorder', event.target.checked)
        }
      >
        Show border
      </Checkbox>

      <Checkbox
        checked={state.striped}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('striped', event.target.checked)
        }
      >
        Striped
      </Checkbox>

      <Checkbox
        checked={state.showIndexColumn}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showIndexColumn', event.target.checked)
        }
      >
        Index column
      </Checkbox>

      {state.showIndexColumn && (
        <Checkbox
          checked={state.continuousNumbering}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('continuousNumbering', event.target.checked)
          }
        >
          Continuous numbering
        </Checkbox>
      )}

      <Checkbox
        checked={state.checkable}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('checkable', event.target.checked)
        }
      >
        Checkable
      </Checkbox>

      {state.checkable && (
        <Checkbox
          checked={state.separateCheckboxColumn}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('separateCheckboxColumn', event.target.checked)
          }
        >
          Separate checkbox column
        </Checkbox>
      )}

      <Checkbox
        checked={state.hoverHighlight}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('hoverHighlight', event.target.checked)
        }
      >
        Hover highlight
      </Checkbox>

      <Checkbox
        checked={state.editable}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('editable', event.target.checked)
        }
      >
        Editable (add / edit)
      </Checkbox>
    </StyledSettingsForm>
  );
}
