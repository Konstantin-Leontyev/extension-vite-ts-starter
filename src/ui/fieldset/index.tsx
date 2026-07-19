/**
 * Файл: `src/ui/fieldset/index.tsx`
 * Предоставляет компонент Fieldset для отображения группы полей формы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - тон рамки через проп `borderTone`
 *  - заголовок группы через проп `label` в `<legend>`
 *  - тон заголовка через проп `legendTone`
 *  - размер заголовка через проп `legendSizePreset`
 *  - курсив заголовка через проп `legendItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Fieldset
 * 2. Типизировать пропсы через `FieldsetProps`
 * 3. Реэкспортировать перечень тонов рамки `FIELDSET_BORDER_TONE_KEYS`
 *    и тип `FieldsetBorderTone`
 *
 * Потребители:
 *  - страницы и виджеты приложения — группируют поля формы
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  FIELDSET_BORDER_TONE_KEYS,
  StyledFieldset,
  type FieldsetBorderTone,
  type FieldsetStyleProps,
} from './fieldset.styles';

/**
 * DEFAULT_FIELDSET_LEGEND_SIZE_PRESET — задаёт размер заголовка по умолчанию.
 * Заголовок группы — служебный текст, поэтому мельче основного.
 */
const DEFAULT_FIELDSET_LEGEND_SIZE_PRESET: TextSizePreset = 'thin';

/**
 * DEFAULT_FIELDSET_LEGEND_TONE — задаёт тон заголовка по умолчанию.
 * Заголовок группы — вторичный текст, поэтому `muted`.
 */
const DEFAULT_FIELDSET_LEGEND_TONE: TextTone = 'muted';

/**
 * FieldsetProps — представляет пропсы компонента Fieldset.
 *
 * @property children — содержимое группы
 * @property label — заголовок в `<legend>`
 * @property legendItalic — включает курсив заголовка
 * @property legendSizePreset — размер заголовка
 * @property legendTone — тон заголовка
 */
type FieldsetProps = {
  children?: ReactNode;
  label: string;
  legendItalic?: boolean;
  legendSizePreset?: TextSizePreset;
  legendTone?: TextTone;
} & FieldsetStyleProps &
  Omit<
    ComponentPropsWithRef<'fieldset'>,
    'className' | 'style' | keyof FieldsetStyleProps
  >;

/**
 * Fieldset — отображает группу полей с заголовком в `<legend>`.
 *
 * @example
 * <Fieldset label="Notifications">
 *   <Checkbox checked={email}>Email</Checkbox>
 * </Fieldset>
 */
function Fieldset({
  borderTone,
  children,
  label,
  legendItalic,
  legendSizePreset = DEFAULT_FIELDSET_LEGEND_SIZE_PRESET,
  legendTone = DEFAULT_FIELDSET_LEGEND_TONE,
  ...rest
}: FieldsetProps) {
  return (
    <StyledFieldset borderTone={borderTone} {...rest}>
      <legend>
        <Text italic={legendItalic} sizePreset={legendSizePreset} tone={legendTone}>
          {label}
        </Text>
      </legend>
      {children}
    </StyledFieldset>
  );
}

export { FIELDSET_BORDER_TONE_KEYS, Fieldset, type FieldsetBorderTone };
