/**
 * Файл: `src/ui/radio-button/index.tsx`
 * Предоставляет компонент RadioButton для отображения переключателя одного значения
 * из группы.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - подпись справа от кружка через `children`. Без `children` рендерится один кружок
 *    без обёртки
 *  - текстовую метку через проп `aria-label`
 *  - id метки через проп `aria-labelledby`
 *
 * Основные задачи:
 * 1. Экспортировать компонент RadioButton
 * 2. Типизировать пропсы через `RadioButtonProps`
 *
 * Потребители:
 *  - страницы и виджеты приложения — рендерят поля выбора одного значения
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { type ChildrenAccessibleName } from '@ui/a11y';
import { getTextSize } from '@ui/presets';
import { Text } from '@ui/text';

import {
  StyledRadioButtonControl,
  StyledRadioButtonRoot,
  splitLayoutProps,
  type RadioButtonStyleProps,
} from './radio-button.styles';

/**
 * RadioButtonProps — представляет пропсы компонента RadioButton.
 */
type RadioButtonProps = RadioButtonStyleProps &
  ChildrenAccessibleName &
  Omit<
    ComponentPropsWithRef<'input'>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'children'
    | 'className'
    | 'style'
    | 'type'
    | keyof RadioButtonStyleProps
  >;

/**
 * RadioButton — отображает переключатель одного значения с опциональной подписью.
 *
 * @example
 * <RadioButton name="plan" value="a">Option A</RadioButton>
 * <RadioButton aria-label="Option B" name="plan" value="b" />
 */
function RadioButton({ children, size, ...rest }: RadioButtonProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);

  const control = (
    <StyledRadioButtonControl
      size={size}
      type="radio"
      {...(children ? restProps : rest)}
    />
  );

  if (!children) {
    return control;
  }

  return (
    <StyledRadioButtonRoot {...layoutProps}>
      {control}
      <Text size={getTextSize(size)}>{children}</Text>
    </StyledRadioButtonRoot>
  );
}

export { RadioButton };
