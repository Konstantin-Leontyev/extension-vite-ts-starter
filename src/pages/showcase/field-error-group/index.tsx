/**
 * Файл: `src/pages/showcase/field-error-group/index.tsx`
 * Предоставляет компонент FieldErrorGroup для настройки резерва полоски ошибки
 * и подсказки в зарезервированном месте в витрине дизайн-системы. Используется
 * только в витрине: в продуктовый код и `@ui/` не входит.
 *
 * Поддерживает:
 *  - резерв высоты полоски через проп `reserveErrorSpace`
 *  - подсказку в зарезервированном месте через проп `errorPlaceholder`
 *  - обработчик резерва через проп `onReserveErrorSpaceChange`
 *  - обработчик подсказки через проп `onErrorPlaceholderChange`
 *
 * Основные задачи:
 * 1. Экспортировать компонент FieldErrorGroup
 * 2. Типизировать пропсы через `FieldErrorGroupProps`
 * 3. Рендерить единый блок: `Reserve error space`, при включённом резерве —
 *    `Set Reserved space placeholder` через TextGroup. При выключении резерва
 *    сбрасывать подсказку
 *
 * Потребители:
 *  - панели настроек витрины — настраивают полоску FieldError:
 *     - `src/pages/showcase/input-settings/index.tsx`
 *     - `src/pages/showcase/range-input-settings/index.tsx`
 */

import { type ChangeEvent } from 'react';

import { Checkbox } from '@ui/checkbox';

import { TextGroup } from '../text-group';

/**
 * FieldErrorGroupProps — представляет пропсы компонента FieldErrorGroup.
 *
 * @property errorPlaceholder — подсказка в зарезервированной полоске, пока нет ошибки
 * @property onErrorPlaceholderChange — обработчик изменения подсказки
 * @property onReserveErrorSpaceChange — обработчик резерва высоты полоски
 * @property reserveErrorSpace — включает резерв высоты под строку ошибки
 */
type FieldErrorGroupProps = {
  errorPlaceholder?: string;
  onErrorPlaceholderChange: (value: string | undefined) => void;
  onReserveErrorSpaceChange: (reserve: true | undefined) => void;
  reserveErrorSpace?: boolean;
};

/**
 * FieldErrorGroup — отображает группу настроек резерва полоски ошибки в витрине.
 *
 * @example
 * <FieldErrorGroup
 *   errorPlaceholder={state.errorPlaceholder}
 *   reserveErrorSpace={state.reserveErrorSpace}
 *   onErrorPlaceholderChange={(value) => onChange('errorPlaceholder', value)}
 *   onReserveErrorSpaceChange={(reserve) => onChange('reserveErrorSpace', reserve)}
 * />
 */
export function FieldErrorGroup({
  errorPlaceholder,
  onErrorPlaceholderChange,
  onReserveErrorSpaceChange,
  reserveErrorSpace,
}: FieldErrorGroupProps) {
  const isReserved = Boolean(reserveErrorSpace);

  return (
    <>
      <Checkbox
        checked={isReserved}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const checked = event.target.checked;
          onReserveErrorSpaceChange(checked ? true : undefined);
          if (!checked) {
            onErrorPlaceholderChange(undefined);
          }
        }}
      >
        Reserve error space
      </Checkbox>

      {isReserved && (
        <TextGroup
          contents={[
            {
              label: 'Reserved space placeholder:',
              value: errorPlaceholder ?? '',
              onChange: (value) => onErrorPlaceholderChange(value || undefined),
            },
          ]}
          set={{ label: 'Set Reserved space placeholder' }}
        />
      )}
    </>
  );
}
