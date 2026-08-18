/**
 * Файл: `src/ui/fieldset/index.tsx`
 * Предоставляет компонент Fieldset для отображения группы полей формы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - тон рамки через проп `borderTone`
 *  - заголовок группы через проп `label` в `<legend>`
 *  - тон заголовка через проп `legendTone`
 *  - размер заголовка через проп `legendSize`
 *  - курсив заголовка через проп `legendItalic`
 *  - выравнивание заголовка через проп `legendAlign`
 *  - содержимое группы через `children`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Fieldset
 * 2. Типизировать пропсы через `FieldsetProps`
 * 3. Реэкспортировать перечень тонов рамки `FIELDSET_BORDER_TONE_KEYS`
 *    и тип `FieldsetBorderTone`
 *
 * Потребители:
 *  - страницы и виджеты приложения — группируют поля формы
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import {
  Text,
  type TextNodeStyleProps,
  type TextSizePreset,
  type TextTone,
} from '@ui/text';

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
 */
type FieldsetProps = {
  children?: ReactNode;
  label: string;
} & TextNodeStyleProps<'legend'> &
  FieldsetStyleProps &
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
  children,
  label,
  legendAlign,
  legendItalic,
  legendSize = DEFAULT_FIELDSET_LEGEND_SIZE_PRESET,
  legendTone = DEFAULT_FIELDSET_LEGEND_TONE,
  ...rest
}: FieldsetProps) {
  return (
    <StyledFieldset {...rest}>
      <Text
        align={legendAlign}
        as="legend"
        italic={legendItalic}
        paddingInline={4}
        sizePreset={legendSize}
        tone={legendTone}
      >
        {label}
      </Text>
      {children}
    </StyledFieldset>
  );
}

export { FIELDSET_BORDER_TONE_KEYS, Fieldset, type FieldsetBorderTone };
