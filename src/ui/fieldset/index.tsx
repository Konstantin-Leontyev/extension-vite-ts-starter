/**
 * Файл: `src/ui/fieldset/index.tsx`
 * Предоставляет компонент Fieldset для отображения группы полей формы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - тон рамки через проп `borderTone`
 *  - заголовок группы через проп `label` в `<legend>`. Без `label` рамка без разрыва
 *  - содержимое группы через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Fieldset
 * 2. Типизировать пропсы через `FieldsetProps`
 * 3. Реэкспортировать перечень тонов рамки `FIELDSET_BORDER_TONE_PRESET_KEYS`
 *    и тип `FieldsetBorderTonePreset`
 *
 * Потребители:
 *  - страницы и виджеты приложения — группируют поля формы
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { Text, type TextSizePreset, type TextTonePreset } from '@ui/text';

import {
  FIELDSET_BORDER_TONE_PRESET_KEYS,
  StyledFieldset,
  type FieldsetBorderTonePreset,
  type FieldsetStyleProps,
} from './fieldset.styles';

/**
 * FIELDSET_LEGEND_SIZE_PRESET — задаёт размер заголовка.
 * Заголовок группы — служебный текст, поэтому мельче основного.
 */
const FIELDSET_LEGEND_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * FIELDSET_LEGEND_TONE — задаёт тон заголовка.
 * Заголовок группы — вторичный текст, поэтому `muted`.
 */
const FIELDSET_LEGEND_TONE: TextTonePreset = 'muted';

/**
 * FieldsetProps — представляет пропсы компонента Fieldset.
 *
 * @property label — заголовок в `<legend>`. Пустая или пробельная строка не рендерит `<legend>`
 */
type FieldsetProps = {
  label?: string;
} & FieldsetStyleProps &
  Omit<
    ComponentPropsWithRef<'fieldset'>,
    'className' | 'style' | keyof FieldsetStyleProps
  >;

/**
 * Fieldset — отображает группу полей с опциональным заголовком в `<legend>`.
 *
 * @example
 * <Fieldset label="Notifications">
 *   <Checkbox checked={email}>Email</Checkbox>
 * </Fieldset>
 */
function Fieldset({ children, label, ...rest }: FieldsetProps) {
  const hasLegend = Boolean(label?.trim());

  return (
    <StyledFieldset {...rest}>
      {hasLegend && (
        <Text
          as="legend"
          paddingInline={4}
          size={FIELDSET_LEGEND_SIZE_PRESET}
          tone={FIELDSET_LEGEND_TONE}
        >
          {label}
        </Text>
      )}
      {children}
    </StyledFieldset>
  );
}

export { FIELDSET_BORDER_TONE_PRESET_KEYS, Fieldset, type FieldsetBorderTonePreset };
