/**
 * Файл: `src/ui/checkbox/index.tsx`
 * Предоставляет компонент Checkbox для отображения поля множественного выбора.
 *
 * Поддерживает:
 *  - layout-пропсы: отступы, позиционирование, размеры
 *  - размерный ряд через проп `sizePreset`
 *  - подпись справа от бокса через `children`. Без `children` рендерится один бокс
 *    без обёртки
 *  - тон подписи через проп `textTone`
 *  - размер подписи через проп `textSize`
 *  - курсив подписи через проп `textItalic`
 *  - инвертированную палитру через проп `inverted`
 *  - марку checked-состояния через проп `checkedMark`
 *  - марку unchecked-состояния через проп `uncheckedMark`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Checkbox
 * 2. Типизировать пропсы через `CheckboxProps`
 * 3. Реэкспортировать пресеты `checkboxSizePresets`, перечни марок и типы
 *    `CheckboxCheckedMark` и `CheckboxUncheckedMark`
 * 4. Реэкспортировать мост размера текста `getCheckboxTextSize`
 *
 * Потребители:
 *  - контролы, например Listbox и Table — рендерят чекбоксы
 *  - панели настроек витрины дизайн-системы, например SwitchSettings и ButtonSettings —
 *    рендерят чекбоксы настроек
 *  - `@ui/table` и `@ui/table/table-group-expander` — читают `checkboxSizePresets`
 *  - страницы и виджеты приложения — рендерят поля множественного выбора
 *  - `src/pages/showcase` — демонстрирует состояния в витрине
 */

import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { Text, type TextSizePreset, type TextTone } from '@ui/text';

import {
  CHECKBOX_CHECKED_MARK_KEYS,
  CHECKBOX_UNCHECKED_MARK_KEYS,
  StyledCheckboxControl,
  StyledCheckboxRoot,
  checkboxSizePresets,
  getCheckboxTextSize,
  splitLayoutProps,
  type CheckboxCheckedMark,
  type CheckboxStyleProps,
  type CheckboxUncheckedMark,
} from './checkbox.styles';

/**
 * DEFAULT_CHECKBOX_TEXT_TONE — задаёт тон подписи по умолчанию.
 * Подпись контрола — вторичный текст, поэтому `muted`.
 */
const DEFAULT_CHECKBOX_TEXT_TONE: TextTone = 'muted';

/**
 * CheckboxProps — представляет пропсы компонента Checkbox.
 *
 * @property children — подпись справа от бокса
 * @property textItalic — включает курсив подписи
 * @property textSize — размер подписи
 * @property textTone — тон подписи
 */
type CheckboxProps = CheckboxStyleProps & {
  children?: ReactNode;
  textItalic?: boolean;
  textSize?: TextSizePreset;
  textTone?: TextTone;
} & Omit<
    ComponentPropsWithRef<'input'>,
    'children' | 'className' | 'style' | 'type' | keyof CheckboxStyleProps
  >;

/**
 * Checkbox — отображает чекбокс с опциональной подписью.
 *
 * @example
 * <Checkbox checked={agreed} onChange={handleChange}>Согласен</Checkbox>
 * <Checkbox checked={selected} onChange={handleChange} />
 * <Checkbox inverted checkedMark="minus">Опция</Checkbox>
 */
function Checkbox({
  checkedMark,
  children,
  inverted,
  sizePreset,
  textItalic,
  textSize,
  textTone = DEFAULT_CHECKBOX_TEXT_TONE,
  uncheckedMark,
  ...rest
}: CheckboxProps) {
  const { layoutProps, restProps } = splitLayoutProps(rest);

  const control = (
    <StyledCheckboxControl
      checkedMark={checkedMark}
      inverted={inverted}
      sizePreset={sizePreset}
      type="checkbox"
      uncheckedMark={uncheckedMark}
      {...(children ? restProps : rest)}
    />
  );

  if (!children) {
    return control;
  }

  return (
    <StyledCheckboxRoot {...layoutProps}>
      {control}
      <Text
        italic={textItalic}
        sizePreset={textSize ?? getCheckboxTextSize(sizePreset)}
        tone={textTone}
      >
        {children}
      </Text>
    </StyledCheckboxRoot>
  );
}

/* eslint-disable react-refresh/only-export-components -- реэкспорт пресетов, перечней марок и моста размера текста */
export {
  CHECKBOX_CHECKED_MARK_KEYS,
  CHECKBOX_UNCHECKED_MARK_KEYS,
  Checkbox,
  checkboxSizePresets,
  getCheckboxTextSize,
  type CheckboxCheckedMark,
  type CheckboxUncheckedMark,
};
