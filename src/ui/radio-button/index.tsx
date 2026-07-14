/**
 * Файл: `src/ui/radio-button/index.tsx`
 * Предоставляет компонент RadioButton для выбора одного значения из группы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - подпись справа от кружка через `children`. Без `children` рендерится один кружок
 *    без обёртки
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RadioButton
 * 2. Типизировать пропсы через `RadioButtonProps`
 * 3. Разделять layout-пропсы между корнем и кружком в обычном режиме
 * 4. Реэкспортировать мост размера текста `getRadioButtonTextSize`
 *
 * Потребители:
 *  - страницы и виджеты приложения — рендерят поля выбора одного значения
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  StyledRadioButtonControl,
  StyledRadioButtonRoot,
  getRadioButtonTextSize,
  splitLayoutProps,
  type RadioButtonStyleProps,
} from './radio-button.styles';

/**
 * DEFAULT_RADIO_BUTTON_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_RADIO_BUTTON_TEXT_TONE: TextTone = 'muted';

/**
 * RadioButtonProps — представляет пропсы компонента RadioButton.
 *
 * @property children — подпись справа от кружка
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
type RadioButtonProps = RadioButtonStyleProps & {
  children?: ReactNode;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<
    ComponentPropsWithRef<'input'>,
    keyof RadioButtonStyleProps | 'children' | 'className' | 'style' | 'type'
  >;

/**
 * RadioButton — отображает переключатель одного значения с опциональной подписью.
 *
 * @example
 * <RadioButton name="plan" value="a">Option A</RadioButton>
 * <RadioButton name="plan" value="b" />
 */
function RadioButton({
  children,
  sizePreset,
  textItalic,
  textSize,
  textTone = DEFAULT_RADIO_BUTTON_TEXT_TONE,
  ...rest
}: RadioButtonProps) {
  if (!children) {
    return <StyledRadioButtonControl sizePreset={sizePreset} type="radio" {...rest} />;
  }

  const { layout, rest: control } = splitLayoutProps(rest);

  return (
    <StyledRadioButtonRoot {...layout}>
      <StyledRadioButtonControl sizePreset={sizePreset} type="radio" {...control} />
      <Text
        italic={textItalic}
        sizePreset={textSize ?? getRadioButtonTextSize(sizePreset)}
        tone={textTone}
      >
        {children}
      </Text>
    </StyledRadioButtonRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт моста размера текста */
export { RadioButton, getRadioButtonTextSize };
