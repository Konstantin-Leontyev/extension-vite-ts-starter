/**
 * Файл: `src/ui/range-input/range-input.styles.ts`
 * Определяет внешний вид компонента RangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RangeInputStyleProps` и `RangeInputSurfaceStyleProps`
 * 2. Предоставить функцию `getRangeInputTextSize`
 * 3. Предоставить styled-узлы `StyledRangeInputRoot`, `StyledRangeInputTriggerRow`,
 *    `StyledRangeInputTrigger`, `StyledRangeInputValue`,
 *    `StyledRangeInputPanel`, `StyledRangeInputPresetList`, `StyledRangeInputPresetButton`,
 *    `StyledRangeInputCustomSection`, `StyledRangeInputFields` и `StyledRangeInputButtonRow`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/range-input/index.tsx` — собирает компонент RangeInput
 */

import styled from 'styled-components';

import { getCssAnchorBindingStyles } from '@ui/anchored-portal';
import { ICON_SETTING_PROP_NAMES } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_ROW_GAP,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
  getOpenControlStackedPortalPanelStyles,
  getOpenControlTriggerRowStyles,
  getOpenControlTriggerStyles,
  type OpenControlSurfaceStyleProps,
} from '@ui/open-control';
import {
  DEFAULT_SIZE_PRESET,
  getPaddingInline,
  getTextSize,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getRangeInputTextSize — возвращает размер текста триггера и пресетов по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер RangeInput
 * @returns метка размера текста из `TextSizePreset` для текста триггера и пресетов
 */
export function getRangeInputTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * RangeInputSurfaceStyleProps — представляет пропсы стилизации поверхности RangeInput.
 *
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type RangeInputSurfaceStyleProps = OpenControlSurfaceStyleProps & {
  iconTone?: TonePreset;
};

/**
 * RangeInputStyleProps — представляет пропсы стилизации RangeInput и layout-пропсы.
 */
export type RangeInputStyleProps = LayoutProps & RangeInputSurfaceStyleProps;

/**
 * StyledRangeInputRoot — задаёт корневой узел компонента RangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * RANGE_INPUT_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности RangeInput.
 */
const RANGE_INPUT_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * StyledRangeInputTriggerRow — задаёт ряд триггера компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props)}
`;

/**
 * StyledRangeInputTrigger — задаёт кнопку-триггер компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerStyles` — раскладка позиции иконки и канал
 *    `--icon-state-background`
 */
export const StyledRangeInputTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerStyles(props, 'center')}
`;

/**
 * getRangeInputValueStyles — возвращает CSS-правила для узла `StyledRangeInputValue`:
 * сжатие текста и внутренние отступы по размеру.
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputValueStyles(props: RangeInputSurfaceStyleProps): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    display: block;
    min-inline-size: 0;
    padding-inline: ${getPaddingInline(sizePreset)};
  `;
}

/**
 * StyledRangeInputValue — задаёт ячейку текста триггера и пресета компонента RangeInput.
 * Базируется на `<span>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputValueStyles` — сжатие текста и отступы по размеру
 */
export const StyledRangeInputValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputValueStyles(props)}
`;

/**
 * getRangeInputPanelStyles — возвращает CSS-правила для узла `StyledRangeInputPanel`:
 * стековый хром портала через `getOpenControlStackedPortalPanelStyles`, CSS-привязку
 * к триггеру и прокрутку.
 *
 * Как работает:
 * 1. Подставляет стековый хром панели через `getOpenControlStackedPortalPanelStyles`
 * 2. Привязывает панель к триггеру через `getCssAnchorBindingStyles`, `anchor(start)`
 *    и `anchor-size(width)`
 * 3. Включает прокрутку `overflow: hidden auto`
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputPanelStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  return `
    ${getOpenControlStackedPortalPanelStyles(props)}
    ${getCssAnchorBindingStyles()}
    inset-block-start: anchor(start);
    inset-inline-start: anchor(start);
    inline-size: anchor-size(width);
    overflow: hidden auto;
  `;
}

/**
 * StyledRangeInputPanel — задаёт панель выбора диапазона компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputPanelStyles` — стековый хром портала, CSS-привязка к триггеру
 *    и прокрутка
 */
export const StyledRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputPanelStyles(props)}
`;

/**
 * StyledRangeInputPresetList — задаёт список пресетов компонента RangeInput.
 * Базируется на `<ul>`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный перечень пресетов
 */
export const StyledRangeInputPresetList = styled.ul`
  display: grid;
`;

/**
 * StyledRangeInputPresetButton — задаёт кнопку пресета компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlSelectableRowSurfaceStyles` — габарит строки и вуаль наведения
 */
export const StyledRangeInputPresetButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) =>
    getOpenControlSelectableRowSurfaceStyles(props, {
      display: 'grid',
      highlight: 'veil',
    })}
`;

/**
 * StyledRangeInputCustomSection — задаёт секцию ручного ввода границ компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `gap` — стек заголовка, полей, ошибки и кнопки
 */
export const StyledRangeInputCustomSection = styled.div`
  display: grid;
  gap: ${getSpacingValue(OPEN_CONTROL_ROW_GAP)};
`;

/**
 * StyledRangeInputFields — задаёт ряд полей `from` и `to` компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` — две равные колонки полей
 *  - `gap` — зазор между полями
 *  - `outline: none` на валидном `input:focus-visible` — фокус-контур несёт панель, как у Combobox
 */
export const StyledRangeInputFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${getSpacingValue(OPEN_CONTROL_ROW_GAP)};

  & input:focus-visible:not([aria-invalid='true']) {
    outline: none;
  }
`;

/**
 * StyledRangeInputButtonRow — задаёт ряд кнопки применения компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `justify-items: center` — центрирует кнопку применения
 */
export const StyledRangeInputButtonRow = styled.div`
  display: grid;
  justify-items: center;
`;
