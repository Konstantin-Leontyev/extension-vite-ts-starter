/**
 * Файл: `src/ui/radio-button/radio-button.styles.ts`
 * Определяет внешний вид компонента RadioButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RadioButtonStyleProps`
 * 2. Хранить размер кружка в `radioSize`
 * 3. Предоставить функцию `getRadioButtonTextSize`
 * 4. Предоставить styled-узлы `StyledRadioButtonRoot` и `StyledRadioButtonControl`
 * 5. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/radio-button/index.tsx` — собирает компонент RadioButton
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getTextSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * radioSize — хранит размер кружка для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 */
const radioSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getRadioSize — возвращает CSS-размер стороны кружка.
 *
 * @param sizePreset размер из ряда контролов
 * @returns длина стороны в rem
 */
function getRadioSize(sizePreset: SizePreset): string {
  return getSpacingValue(radioSize[sizePreset]);
}

/**
 * getRadioButtonTextSize — возвращает размер подписи по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер кружка
 * @returns метка размера текста из `TextSizePreset` для подписи справа от кружка
 */
export function getRadioButtonTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * RadioButtonStyleProps — представляет пропсы стилизации RadioButton и layout-пропсы.
 *
 * @property sizePreset — размер кружка
 */
export type RadioButtonStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
};

/**
 * RADIO_BUTTON_ROOT_PROP_NAMES — объединяет имена layout-пропсов корня RadioButton.
 */
const RADIO_BUTTON_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

/**
 * StyledRadioButtonRoot — задаёт корневой узел компонента RadioButton.
 * Базируется на `<label>` и поддерживает пропсы из `LayoutProps`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` — раскладка по дефолту проекта
 *  - `grid-auto-flow: column` — кружок и подпись в одной строке
 *  - `justify-content: start` — при растяжении родителем подпись остаётся у кружка
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRadioButtonRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !RADIO_BUTTON_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  display: inline-grid;
  grid-auto-flow: column;
  gap: ${getSpacingValue(8)};
  align-items: center;
  justify-content: start;
  cursor: pointer;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * RADIO_BUTTON_CONTROL_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации кружка.
 */
const RADIO_BUTTON_CONTROL_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'sizePreset',
]);

/**
 * getRadioButtonControlStyles — возвращает CSS-правила для кружка `StyledRadioButtonControl`:
 * габариты, рамку и состояние `checked`.
 *
 * @param props пропсы стилизации RadioButton и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRadioButtonControlStyles(
  props: RadioButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;
  const size = getRadioSize(sizePreset);

  const styles = [
    'flex-shrink: 0;',
    `inline-size: ${size};`,
    `block-size: ${size};`,
    'appearance: none;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    'border-radius: 50%;',
    `box-shadow: ${theme.shadow.surface};`,
    `&:checked {
      background-color: ${theme.colors.surface};
      background-image: radial-gradient(circle at center, ${theme.colors.primary} 48%, transparent 49%);
      border-color: ${theme.colors.primary};
    }`,
  ];

  return styles.join('\n');
}

/**
 * StyledRadioButtonControl — задаёт нативный кружок RadioButton.
 * Базируется на `<input type="radio">` и поддерживает пропсы из `RadioButtonStyleProps`.
 *
 * Генерация стилей:
 *  - `getRadioButtonControlStyles` — габариты, рамка, состояние `checked`
 *  - `getLayoutStyles` — отступы, позиционирование, размеры при рендере без обёртки
 */
export const StyledRadioButtonControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !RADIO_BUTTON_CONTROL_PROP_NAMES.has(prop),
})<RadioButtonStyleProps>`
  ${(props) => getRadioButtonControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
