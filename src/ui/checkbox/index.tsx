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
 *  - иконку checked-состояния через проп `checkedMark`
 *  - иконку unchecked-состояния через проп `uncheckedMark`
 *
 * Основные задачи:
 * 1. Экспортировать компонент Checkbox
 * 2. Типизировать пропсы через `CheckboxProps`
 * 3. Разделять layout-пропсы между корнем и боксом в обычном режиме
 * 4. Реэкспортировать пресеты `checkboxSizePresets`, перечни марок и мост размера текста
 *    `getCheckboxTextSize`
 *
 * Потребители:
 *  - контролы и панели настроек витрины дизайн-системы, например FieldsetSettings и SwitchSettings —
 *    рендерят чекбоксы настроек
 *  - страницы и виджеты приложения — рендерят поля множественного выбора
 *  - `src/pages/design-system` — демонстрирует состояния в витрине
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
  if (!children) {
    return (
      <StyledCheckboxControl
        checkedMark={checkedMark}
        inverted={inverted}
        sizePreset={sizePreset}
        type="checkbox"
        uncheckedMark={uncheckedMark}
        {...rest}
      />
    );
  }

  const { layoutProps, restProps } = splitLayoutProps(rest);

  return (
    <StyledCheckboxRoot {...layoutProps}>
      <StyledCheckboxControl
        checkedMark={checkedMark}
        inverted={inverted}
        sizePreset={sizePreset}
        type="checkbox"
        uncheckedMark={uncheckedMark}
        {...restProps}
      />
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
