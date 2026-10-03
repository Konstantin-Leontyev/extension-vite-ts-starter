/**
 * Файл: `src/ui/radio-button/radio-button.styles.ts`
 * Определяет внешний вид компонента RadioButton.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RadioButtonStyleProps`
 * 2. Хранить размер кружка в `radioSize`
 * 3. Предоставить styled-узлы `StyledRadioButtonRoot` и `StyledRadioButtonControl`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/radio-button/index.tsx` — собирает компонент RadioButton и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { getBorderStyles } from '@ui/border';
import { getChoiceControlRootStyles } from '@ui/choice-control';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/**
 * radioSize — хранит размер кружка для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 */
const radioSize = {
  small: 16,
  normal: 20,
  large: 24,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getRadioSize — возвращает CSS-размер стороны кружка.
 *
 * @param size размер из ряда контролов
 * @returns длина стороны в rem
 */
function getRadioSize(size: SizePreset): string {
  return getSpacingValue(radioSize[size]);
}

/**
 * StyledRadioButtonRoot — задаёт корневой узел компонента RadioButton.
 * Базируется на `<label>` и поддерживает пропсы из `LayoutProps`.
 *
 * Генерация стилей:
 *  - `getChoiceControlRootStyles` — ряд кружка и подписи, layout-пропсы
 */
export const StyledRadioButtonRoot = styled.label.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${(props) => getChoiceControlRootStyles(props)}
`;

/**
 * RadioButtonStyleProps — представляет пропсы стилизации RadioButton и layout-пропсы.
 *
 * @property size — размер кружка
 */
export type RadioButtonStyleProps = LayoutProps & {
  size?: SizePreset;
};

/**
 * RADIO_BUTTON_CONTROL_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации кружка RadioButton.
 */
const RADIO_BUTTON_CONTROL_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'size']);

/**
 * getRadioButtonControlStyles — возвращает CSS-правила для узла `StyledRadioButtonControl`:
 * габариты, рамку с тенью и состояние `checked`.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолт `size`
 * 2. Собирает габариты, сброс layout-рамки UA через `border: none`, заливку
 *    `surface`, рамку с тенью через `getBorderStyles` без флагов и
 *    `border-radius: 50%`
 * 3. В `&:checked` кладёт фоновую марку-точку цветом `primary` и рамку с
 *    тенью тона `primary` через `getBorderStyles`
 *
 * @param props пропсы стилизации RadioButton и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRadioButtonControlStyles(
  props: RadioButtonStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    inline-size: ${getRadioSize(size)};
    block-size: ${getRadioSize(size)};
    appearance: none;
    border: none;
    background-color: ${theme.colors.surface};
    ${getBorderStyles(theme)}
    border-radius: 50%;
    &:checked {
      background-image: radial-gradient(circle at center, ${theme.colors.primary} 48%, transparent 49%);
      ${getBorderStyles(theme, true, true, 'primary')}
    }
  `;
}

/**
 * StyledRadioButtonControl — задаёт нативный кружок RadioButton.
 * Базируется на `<input type="radio">` и поддерживает пропсы из `RadioButtonStyleProps`.
 *
 * Генерация стилей:
 *  - `getRadioButtonControlStyles` — габариты, рамка с тенью, состояние `checked`
 *  - `getLayoutStyles` — отступы, позиционирование, размеры при рендере без обёртки
 */
export const StyledRadioButtonControl = styled.input.withConfig({
  shouldForwardProp: (prop) => !RADIO_BUTTON_CONTROL_PROP_NAMES.has(prop),
})<RadioButtonStyleProps>`
  ${(props) => getRadioButtonControlStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
