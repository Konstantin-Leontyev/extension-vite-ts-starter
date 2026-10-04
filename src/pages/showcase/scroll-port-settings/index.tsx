/**
 * Файл: `src/pages/showcase/scroll-port-settings/index.tsx`
 * Определяет панель настроек компонента ScrollPort в витрине дизайн-системы.
 * Содержит контролы для изменения вуали и её выступа в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ScrollPortWidgetState`
 * 2. Экспортировать компонент `ScrollPortSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета прокрутки
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { Listbox } from '@ui/listbox';
import { type SpacingValue } from '@ui/spacing';

import { getListboxOptions } from '../get-listbox-options';
import { StyledSettingsForm } from '../showcase.styles';

/**
 * SCROLL_PORT_VEIL_INSET_VALUES — задаёт перечень выступов вуали для контрола панели.
 * Шкала отступов в `@ui/spacing` наружу перечень ключей не отдаёт.
 * Используется в `ScrollPortSettings` как опции листбокса `Veil inset:`.
 */
const SCROLL_PORT_VEIL_INSET_VALUES = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80,
] as const satisfies readonly SpacingValue[];

/**
 * ScrollPortWidgetState — представляет состояние настроек компонента ScrollPort в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента ScrollPort.
 * Используется для синхронизации значений между панелью управления и демонстрационной областью прокрутки.
 *
 * @property showVeil — включает градиентные вуали на краях при прокрутке
 * @property veilInsetInline — выступ вуали за inline-край
 */
export type ScrollPortWidgetState = {
  showVeil: boolean;
  veilInsetInline: SpacingValue;
};

/**
 * ScrollPortSettingsProps — представляет пропсы компонента ScrollPortSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек области прокрутки
 */
type ScrollPortSettingsProps = {
  onChange: <K extends keyof ScrollPortWidgetState>(
    key: K,
    value: ScrollPortWidgetState[K]
  ) => void;
  state: ScrollPortWidgetState;
};

/**
 * getVeilInsetInline — возвращает выступ вуали, если строка есть в перечне панели.
 *
 * @param value строка выбранной опции
 * @returns метка шкалы отступов или `undefined`
 */
function getVeilInsetInline(value: string): SpacingValue | undefined {
  return SCROLL_PORT_VEIL_INSET_VALUES.find((inset) => String(inset) === value);
}

/**
 * ScrollPortSettings — отображает панель настроек ScrollPort в витрине дизайн-системы.
 *
 * @example
 * <ScrollPortSettings state={scrollPort} onChange={updateScrollPort} />
 */
export function ScrollPortSettings({ onChange, state }: ScrollPortSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <Checkbox
        checked={state.showVeil}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showVeil', event.target.checked)
        }
      >
        Show veil
      </Checkbox>

      {state.showVeil && (
        <Listbox
          label="Veil inset:"
          options={getListboxOptions(SCROLL_PORT_VEIL_INSET_VALUES.map(String))}
          value={String(state.veilInsetInline)}
          onChange={(value) => {
            if (typeof value !== 'string') {
              return;
            }

            const veilInsetInline = getVeilInsetInline(value);

            if (veilInsetInline !== undefined) {
              onChange('veilInsetInline', veilInsetInline);
            }
          }}
        />
      )}
    </StyledSettingsForm>
  );
}
