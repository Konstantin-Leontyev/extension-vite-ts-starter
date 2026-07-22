/**
 * Файл: `src/ui/range-input/range-input.styles.ts`
 * Определяет внешний вид компонента RangeInput.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `RangeInputStyleProps` и `RangeInputSurfaceStyleProps`
 * 2. Предоставить функцию `getRangeInputTextSize` и дефолты `DEFAULT_RANGE_INPUT_SHAPE`
 *    и `DEFAULT_RANGE_INPUT_SIZE_PRESET`
 * 3. Предоставить styled-узлы `StyledRangeInputRoot`, `StyledRangeInputTriggerRow`,
 *    `StyledRangeInputTrigger`, `StyledRangeInputValue`, `StyledRangeInputClearButton`,
 *    `StyledRangeInputPanel`, `StyledRangeInputPresetList`, `StyledRangeInputPresetButton`,
 *    `StyledRangeInputCustomSection`, `StyledRangeInputFields` и `StyledRangeInputButtonRow`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/range-input/index.tsx` — собирает компонент RangeInput и реэкспортирует публичное API
 */

import styled from 'styled-components';

import {
  DEFAULT_ICON_POSITION,
  ICON_SETTING_PROP_NAMES,
  resolveIconSurface,
  type IconPosition,
} from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  getPaddingInline,
  getTextSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getRangeInputTextSize — возвращает размер текста триггера и пресетов по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер компонента
 * @returns метка размера текста из `TextSizePreset` для текста триггера и пресетов
 */
export function getRangeInputTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * RangeInputSurfaceStyleProps — представляет пропсы стилизации поверхности RangeInput.
 *
 * @property iconFill — тон глифа шеврона и кнопки сброса
 * @property iconPosition — позиция шеврона и кнопки сброса относительно значения
 * @property iconTone — тон секции шеврона и кнопки сброса
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
export type RangeInputSurfaceStyleProps = {
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * RangeInputStyleProps — представляет пропсы стилизации RangeInput и layout-пропсы.
 */
export type RangeInputStyleProps = LayoutProps & RangeInputSurfaceStyleProps;

/**
 * RANGE_INPUT_ROOT_PROP_NAMES — хранит имена layout-пропсов корня RangeInput.
 */
const RANGE_INPUT_ROOT_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES]);

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
 * DEFAULT_RANGE_INPUT_SIZE_PRESET — задаёт размер RangeInput по умолчанию.
 * Используется, когда вызывающий код не передал проп `sizePreset`.
 */
export const DEFAULT_RANGE_INPUT_SIZE_PRESET: SizePreset = DEFAULT_SIZE_PRESET;

/**
 * DEFAULT_RANGE_INPUT_SHAPE — задаёт форму RangeInput по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
export const DEFAULT_RANGE_INPUT_SHAPE: ShapePreset = DEFAULT_SHAPE_PRESET;

/**
 * resolveRangeInputBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param props пропсы поверхности
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveRangeInputBlockRadius(props: RangeInputSurfaceStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;

  return resolveBlockRadius(
    props.shape ?? DEFAULT_RANGE_INPUT_SHAPE,
    getMinBlockSize(sizePreset)
  );
}

/**
 * getRangeInputRootStyles — возвращает CSS-правила для корня `StyledRangeInputRoot`:
 * раскладку, зазор, ширину и подъём слоя при открытой панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputRootStyles(): string {
  const styles = [
    'position: relative;',
    'display: grid;',
    `gap: ${getSpacingValue(8)};`,
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `&[data-open='true'] { z-index: 50; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputRoot — задаёт корневой узел компонента RangeInput.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getRangeInputRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledRangeInputRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_ROOT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getRangeInputRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * getRangeInputTriggerRowStyles — возвращает CSS-правила для узла
 * `StyledRangeInputTriggerRow`: габариты, рамку, заливку и кольцо фокуса.
 *
 * Как работает:
 * 1. Берёт тему и размер, подставляет дефолт `iconPosition`
 * 2. Собирает CSS-правила ряда: сетка, габариты, заливка, рамка и тень
 * 3. Без clear оставляет одну колонку. При `data-has-clear` переключает сетку
 *    на две колонки с учётом позиции иконки
 * 4. Не красит рамку в `primary` — как Listbox и Combobox: акцент даёт `outline`
 *    фокуса на ряде при `:focus-within`, потому что `overflow` обрезает outline
 *    детей, как у Stepper
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputTriggerRowStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;
  const isIconStart = (props.iconPosition ?? DEFAULT_ICON_POSITION) === 'start';

  const clearColumns = isIconStart ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr) auto';

  const styles = [
    'display: grid;',
    'grid-template-columns: minmax(0, 1fr);',
    `&[data-has-clear] { grid-template-columns: ${clearColumns}; }`,
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'overflow: hidden;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveRangeInputBlockRadius(props)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `&[data-open='true'] { visibility: hidden; }`,
    '&:focus-within {',
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputTriggerRow — задаёт ряд триггера компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputTriggerRowStyles` — габариты, рамка, заливка и кольцо фокуса
 *
 * При открытой панели ряд скрывается через `visibility: hidden`, чтобы панель
 * наследовала ширину якоря без двойного отображения триггера.
 */
export const StyledRangeInputTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputTriggerRowStyles(props)}
`;

/**
 * getRangeInputTriggerStyles — возвращает CSS-правила для узла
 * `StyledRangeInputTrigger`: раскладку кнопки-триггера и поверхность секции шеврона
 * по `[data-slot='icon']`.
 * Ховер секции — от ховера всего триггера: шеврон не самостоятельное действие,
 * а индикатор выпадашки.
 *
 * Как работает:
 * 1. Берёт тему, размер и позицию иконки, считает поверхность шеврона
 * 2. Собирает сетку триггера и центрирует значение через `align-items: center`:
 *    высоту ряда держит `min-block-size` родителя. `stretch` прижимал Text к верху
 *    ячейки, секция иконки тянется через `block-size: 100%`
 * 3. Красит секцию шеврона по `[data-slot='icon']` и подсвечивает её при наведении
 *    триггера
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputTriggerStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;
  const size = getMinBlockSize(sizePreset);
  const isIconStart = (props.iconPosition ?? DEFAULT_ICON_POSITION) === 'start';
  const iconSurface = resolveIconSurface(
    theme,
    props.iconTone ?? DEFAULT_TONE,
    props.iconFill ?? DEFAULT_TONE
  );
  const seam = isIconStart ? 'border-inline-end' : 'border-inline-start';

  const styles = [
    'display: grid;',
    `grid-template-columns: ${isIconStart ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr) auto'};`,
    'align-items: center;',
    'min-inline-size: 0;',
    'text-align: center;',
    '&:focus-visible { outline: none; }',
    `[data-slot='icon'] {`,
    `block-size: 100%;`,
    `inline-size: ${size};`,
    `min-inline-size: ${size};`,
    `color: ${iconSurface.color};`,
    `background-color: ${iconSurface.backgroundColor};`,
    `${seam}: 1px solid ${theme.colors.border};`,
    `}`,
    `&:not(:disabled):hover [data-slot='icon'] {`,
    `background: ${iconSurface.hoverBackground};`,
    `}`,
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputTrigger — задаёт кнопку-триггер компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputTriggerStyles` — раскладка и секция шеврона
 *
 * Поверхность шеврона — правило по `[data-slot='icon']`.
 */
export const StyledRangeInputTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputTriggerStyles(props)}
`;

/**
 * getRangeInputValueStyles — возвращает CSS-правила для узла `StyledRangeInputValue`:
 * сжатие текста и внутренние отступы по размеру.
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputValueStyles(props: RangeInputSurfaceStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;

  const styles = [
    'display: block;',
    'min-inline-size: 0;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
  ];

  return styles.join('\n');
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
 * getRangeInputClearButtonStyles — возвращает CSS-правила для узла
 * `StyledRangeInputClearButton`: квадрат сброса, разделитель и подсветку вуалью.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputClearButtonStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;
  const size = getMinBlockSize(sizePreset);
  const isIconStart = (props.iconPosition ?? DEFAULT_ICON_POSITION) === 'start';
  const iconSurface = resolveIconSurface(
    theme,
    props.iconTone ?? DEFAULT_TONE,
    props.iconFill ?? DEFAULT_TONE
  );
  const seam = isIconStart ? 'border-inline-end' : 'border-inline-start';

  const styles = [
    `inline-size: ${size};`,
    `min-inline-size: ${size};`,
    `color: ${iconSurface.color};`,
    `background-color: ${iconSurface.backgroundColor};`,
    `${seam}: 1px solid ${theme.colors.border};`,
    `&:not(:disabled):hover { background: ${iconSurface.hoverBackground}; }`,
    '&:focus-visible {',
    'outline: none;',
    `background: ${iconSurface.hoverBackground};`,
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputClearButton — задаёт кнопку сброса компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputClearButtonStyles` — квадрат сброса, разделитель и подсветка
 */
export const StyledRangeInputClearButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputClearButtonStyles(props)}
`;

/**
 * getRangeInputPanelStyles — возвращает CSS-правила для узла `StyledRangeInputPanel`:
 * фиксированное положение, заливку, рамку, тень и кольцо фокуса.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputPanelStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);

  const styles = [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    'z-index: 2000;',
    'overflow: hidden auto;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveRangeInputBlockRadius(props)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputPanel — задаёт панель выбора диапазона компонента RangeInput.
 * Базируется на `<div>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` и `gap` — вертикальный стек пресетов и кастомной секции
 *  - `padding` — внутренний отступ панели
 *
 * Генерация стилей:
 *  - `getRangeInputPanelStyles` — позиция, заливка, рамка, тень и кольцо фокуса
 */
export const StyledRangeInputPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  display: grid;
  gap: ${getSpacingValue(12)};
  padding: ${getSpacingValue(12)};
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
 * getRangeInputPresetButtonStyles — возвращает CSS-правила для узла
 * `StyledRangeInputPresetButton`: габарит строки и вуаль наведения через `::before`.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getRangeInputPresetButtonStyles(
  props: RangeInputSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const sizePreset = props.sizePreset ?? DEFAULT_RANGE_INPUT_SIZE_PRESET;
  const borderRadius = resolveRangeInputBlockRadius(props);

  const styles = [
    'position: relative;',
    'z-index: 0;',
    'display: grid;',
    'align-items: center;',
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'text-align: start;',
    `background-color: ${theme.colors.surface};`,
    '&::before {',
    'position: absolute;',
    `inset: ${getSpacingValue(4)};`,
    'z-index: -1;',
    'pointer-events: none;',
    "content: '';",
    `border-radius: calc(${borderRadius} - ${getSpacingValue(4)});`,
    'transition: background-color 0.12s ease;',
    '}',
    `&:focus { outline: none; }`,
    `&:not(:disabled):hover::before, &:focus-visible::before { background-color: ${theme.colors.veil}; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledRangeInputPresetButton — задаёт кнопку пресета компонента RangeInput.
 * Базируется на `<button>` и принимает пропсы из `RangeInputSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getRangeInputPresetButtonStyles` — габарит строки и вуаль наведения
 */
export const StyledRangeInputPresetButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !RANGE_INPUT_SURFACE_PROP_NAMES.has(prop),
})<RangeInputSurfaceStyleProps>`
  ${(props) => getRangeInputPresetButtonStyles(props)}
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
  gap: ${getSpacingValue(12)};
`;

/**
 * StyledRangeInputFields — задаёт ряд полей from и to компонента RangeInput.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)` — две равные колонки полей
 *  - `gap` — зазор между полями
 *  - гашение `outline` у валидного Input на фокусе — кольцо несёт панель, как у Combobox
 */
export const StyledRangeInputFields = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: ${getSpacingValue(12)};

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
