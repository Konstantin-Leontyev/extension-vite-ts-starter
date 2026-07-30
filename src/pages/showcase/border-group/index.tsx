/**
 * Файл: `src/pages/showcase/border-group/index.tsx`
 * Предоставляет компонент BorderGroup для настройки рамки и тени компонента
 * в витрине дизайн-системы. Используется только в витрине: в продуктовый код
 * и `@ui/` не входит.
 *
 * Поддерживает:
 *  - тон рамки через проп `borderTone`
 *  - показ рамки через проп `showBorder`
 *  - показ тени через проп `showShadow`
 *  - обработчик изменения тона рамки через проп `onBorderToneChange`
 *  - обработчик показа рамки через проп `onShowBorderChange`
 *  - обработчик показа тени через проп `onShowShadowChange`
 *
 * Основные задачи:
 * 1. Экспортировать компонент BorderGroup
 * 2. Типизировать пропсы через `BorderGroupProps`
 * 3. Рендерить единый блок настроек рамки: показ рамки, при включённой рамке —
 *    показ тени и тон рамки
 *
 * Потребители:
 *  - панели настроек витрины — настраивают рамку компонента:
 *     - `src/pages/showcase/card-settings/index.tsx`
 *     - `src/pages/showcase/icon-button-settings/index.tsx`
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/tag-settings/index.tsx`
 *     - `src/pages/showcase/toast-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';
import { TONE_PRESET_KEYS, type TonePreset } from '@ui/tones';

import { ToneListbox } from '../tone-listbox';

/**
 * BorderGroupProps — представляет пропсы компонента BorderGroup.
 *
 * @property borderTone — текущий тон рамки
 * @property onBorderToneChange — обработчик изменения тона рамки
 * @property onShowBorderChange — обработчик показа рамки
 * @property onShowShadowChange — обработчик показа тени
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 */
type BorderGroupProps = {
  borderTone: TonePreset;
  onBorderToneChange: (tone: TonePreset) => void;
  onShowBorderChange: (show: boolean) => void;
  onShowShadowChange: (show: boolean) => void;
  showBorder: boolean;
  showShadow: boolean;
};

/**
 * BorderGroup — отображает группу настроек рамки и тени в витрине дизайн-системы.
 *
 * @example
 * <BorderGroup
 *   borderTone={state.borderTone}
 *   showBorder={state.showBorder}
 *   showShadow={state.showShadow}
 *   onBorderToneChange={(tone) => onChange('borderTone', tone)}
 *   onShowBorderChange={(show) => onChange('showBorder', show)}
 *   onShowShadowChange={(show) => onChange('showShadow', show)}
 * />
 */
export function BorderGroup({
  borderTone,
  onBorderToneChange,
  onShowBorderChange,
  onShowShadowChange,
  showBorder,
  showShadow,
}: BorderGroupProps) {
  return (
    <>
      <Checkbox
        checked={showBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onShowBorderChange(event.target.checked)
        }
      >
        Show border
      </Checkbox>

      {showBorder && (
        <>
          <Checkbox
            checked={showShadow}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onShowShadowChange(event.target.checked)
            }
          >
            Show shadow
          </Checkbox>

          <ToneListbox
            label="Border tone:"
            tones={TONE_PRESET_KEYS}
            value={borderTone}
            onChange={onBorderToneChange}
          />
        </>
      )}
    </>
  );
}
