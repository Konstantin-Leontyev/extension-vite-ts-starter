/**
 * Файл: `src/ui/checkbox/index.tsx`
 * Предоставляет компонент Checkbox для отображения поля множественного выбора.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `size`
 *  - подпись справа от бокса через `children`. Без `children` рендерится один бокс
 *    без обёртки
 *  - текстовую метку через проп `aria-label`
 *  - id метки через проп `aria-labelledby`
 *  - рамку тона `primary` в покое и окраску марок через проп `inverted`
 *  - марку checked-состояния через проп `checkedMark`
 *  - марку unchecked-состояния через проп `uncheckedMark`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Checkbox
 * 2. Типизировать пропсы через `CheckboxProps`
 * 3. Реэкспортировать пресеты `checkboxSizePresets`, перечни марок и типы
 *    `CheckboxCheckedMark` и `CheckboxUncheckedMark`
 *
 * Потребители:
 *  - контролы, например Listbox и Table — рендерят чекбоксы
 *  - панели настроек витрины дизайн-системы, например SwitchSettings и ButtonSettings —
 *    рендерят чекбоксы настроек
 *  - `@ui/table` — читает `checkboxSizePresets`
 *  - страницы и виджеты приложения — рендерят поля множественного выбора
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef } from 'react';

import { type ChildrenAccessibleName } from '@ui/a11y';
import { getTextSize } from '@ui/presets';
import { Text } from '@ui/text';

import {
  CHECKBOX_CHECKED_MARK_KEYS,
  CHECKBOX_UNCHECKED_MARK_KEYS,
  StyledCheckboxControl,
  StyledCheckboxRoot,
  checkboxSizePresets,
  splitLayoutProps,
  type CheckboxCheckedMark,
  type CheckboxStyleProps,
  type CheckboxUncheckedMark,
} from './checkbox.styles';

/**
 * CheckboxProps — представляет пропсы компонента Checkbox.
 */
type CheckboxProps = CheckboxStyleProps &
  ChildrenAccessibleName &
  Omit<
    ComponentPropsWithRef<'input'>,
    | 'aria-label'
    | 'aria-labelledby'
    | 'children'
    | 'className'
    | 'style'
    | 'type'
    | keyof CheckboxStyleProps
  >;

/**
 * Checkbox — отображает чекбокс с опциональной подписью.
 *
 * @example
 * <Checkbox checked={agreed} onChange={handleChange}>Согласен</Checkbox>
 * <Checkbox aria-label="Selected" checked={selected} onChange={handleChange} />
 * <Checkbox inverted checkedMark="minus">Опция</Checkbox>
 */
function Checkbox({
  checkedMark,
  children,
  inverted,
  size,
  uncheckedMark,
  ...rest
}: CheckboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);
  const hasText = Boolean(children);

  const control = (
    <StyledCheckboxControl
      checkedMark={checkedMark}
      inverted={inverted}
      size={size}
      type="checkbox"
      uncheckedMark={uncheckedMark}
      {...(hasText ? restProps : rest)}
    />
  );

  if (!hasText) {
    return control;
  }

  return (
    <StyledCheckboxRoot {...layoutProps}>
      {control}
      <Text size={getTextSize(size)}>{children}</Text>
    </StyledCheckboxRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт пресетов, перечней марок и публичных типов */
export {
  CHECKBOX_CHECKED_MARK_KEYS,
  CHECKBOX_UNCHECKED_MARK_KEYS,
  Checkbox,
  checkboxSizePresets,
  type CheckboxCheckedMark,
  type CheckboxUncheckedMark,
};
