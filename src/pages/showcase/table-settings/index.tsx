// TODO: ручное ревью — pages/showcase/table-settings/index.tsx
import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';

import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';

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

type TableSettingsProps = {
  onChange: <K extends keyof TableWidgetState>(
    key: K,
    value: TableWidgetState[K]
  ) => void;
  state: TableWidgetState;
};

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
