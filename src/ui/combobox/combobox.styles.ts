/**
 * Файл: `src/ui/combobox/combobox.styles.ts`
 * Определяет внешний вид компонента Combobox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ComboboxStyleProps` и `ComboboxSurfaceStyleProps`
 * 2. Предоставить функцию `getComboboxTextSize`
 * 3. Предоставить styled-узлы `StyledComboboxRoot`, `StyledComboboxTrigger`,
 *    `StyledComboboxValue`, `StyledComboboxPanel`, `StyledComboboxSearchRow`,
 *    `StyledComboboxList`, `StyledComboboxOption`, `StyledComboboxOptionIcon`
 *    и `StyledComboboxCheck`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/combobox/index.tsx` — собирает компонент Combobox
 */

import styled from 'styled-components';

import {
  ICON_SETTING_PROP_NAMES,
  getIconSectionSeamStyles,
  getIconSectionTrackStyles,
  resolveIconStateBackground,
} from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { MOTION_MICRO_DURATION, getTransitionStyles } from '@ui/motion';
import { getPortalPanelStyles } from '@ui/portal-panel';
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
import { STACKING_OPEN_CONTROL } from '@ui/stacking';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { DEFAULT_TONE, type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getComboboxTextSize — возвращает размер текста триггера и опций по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер Combobox
 * @returns метка размера текста из `TextSizePreset` для текста триггера и опций
 */
export function getComboboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * resolveComboboxBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveComboboxBlockRadius(shape: ShapePreset, sizePreset: SizePreset): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * ComboboxSurfaceStyleProps — представляет пропсы стилизации поверхности Combobox.
 *
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ComboboxSurfaceStyleProps = {
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * ComboboxStyleProps — представляет пропсы стилизации Combobox и layout-пропсы.
 */
export type ComboboxStyleProps = LayoutProps & ComboboxSurfaceStyleProps;

/**
 * COMBOBOX_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности Combobox.
 */
const COMBOBOX_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * COMBOBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки и панели Combobox.
 */
const COMBOBOX_BOX_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * getComboboxRootStyles — возвращает CSS-правила для корня `StyledComboboxRoot`:
 * раскладку, зазор, ширину и подъём слоя при открытой панели.
 *
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxRootStyles(): string {
  const styles = [
    'position: relative;',
    'display: grid;',
    `gap: ${getSpacingValue(8)};`,
    'inline-size: 100%;',
    'min-inline-size: 0;',
    `&[data-open='true'] { z-index: ${STACKING_OPEN_CONTROL}; }`,
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxRoot — задаёт корневой узел компонента Combobox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getComboboxRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledComboboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getComboboxRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * getComboboxValueStyles — возвращает CSS-правила для узла `StyledComboboxValue`:
 * раскладку значения и горизонтальный отступ. `display: flex` — оправданное
 * исключение: отсутствующая иконка опции не резервирует трек.
 *
 * @param props пропсы поверхности
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxValueStyles(props: ComboboxSurfaceStyleProps): string {
  const sizePreset = props.sizePreset ?? DEFAULT_SIZE_PRESET;

  const styles = [
    'display: flex;',
    `gap: ${getSpacingValue(8)};`,
    'align-items: center;',
    'min-inline-size: 0;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxValue — задаёт ячейку значения триггера: опциональная иконка опции и текст.
 * Базируется на `<span>` и принимает проп `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxValueStyles` — раскладка значения и отступ
 */
export const StyledComboboxValue = styled.span.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'sizePreset'>>`
  ${(props) => getComboboxValueStyles(props)}
`;

/**
 * getComboboxTriggerStyles — возвращает CSS-правила для узла `StyledComboboxTrigger`:
 * габариты, рамку, заливку, тень, шов и канал состояний секции шеврона.
 * Статику секции красит внутренний Icon своими пропсами.
 *
 * Как работает:
 * 1. Берёт тему и подставляет дефолты пропсов
 * 2. Собирает габариты триггера, заливку, рамку и тень
 * 3. Кладёт трек, шов и канал секции через хелперы `@ui/icon`
 * 4. На наведении триггера подсвечивается только индикатор — шеврон не
 *    самостоятельное действие
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxTriggerStyles(
  props: ComboboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const size = getMinBlockSize(sizePreset);
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  const styles = [
    'display: grid;',
    getIconSectionTrackStyles(),
    'align-items: center;',
    'inline-size: 100%;',
    `min-block-size: ${size};`,
    'min-inline-size: 0;',
    'overflow: hidden;',
    'text-align: start;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveComboboxBlockRadius(shape, sizePreset)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `&[data-open='true'] { visibility: hidden; }`,
    getIconSectionSeamStyles({ borderColor: theme.colors.border }),
    `&:not(:disabled):hover {`,
    `--icon-state-background: ${stateBackground};`,
    `}`,
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxTrigger — задаёт кнопку-триггер компонента Combobox.
 * Базируется на `<button>` и принимает пропсы из `ComboboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getComboboxTriggerStyles` — габариты, рамка, заливка, тень и секция шеврона
 *
 * Поверхность шеврона — правило по `[data-slot='icon']`.
 * При открытой панели триггер скрывается через `visibility: hidden`, чтобы панель
 * наследовала ширину якоря без двойного отображения.
 */
export const StyledComboboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_SURFACE_PROP_NAMES.has(prop),
})<ComboboxSurfaceStyleProps>`
  ${(props) => getComboboxTriggerStyles(props)}
`;

/**
 * getComboboxPanelStyles — возвращает CSS-правила для узла `StyledComboboxPanel`:
 * сетку поиска и списка, обрезку и оболочку портальной панели.
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxPanelStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'display: grid;',
    'grid-template-rows: auto minmax(0, 1fr);',
    'overflow: hidden;',
    getPortalPanelStyles({
      theme,
      borderRadius: resolveComboboxBlockRadius(shape, sizePreset),
    }),
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxPanel — задаёт панель поиска и списка опций компонента Combobox.
 * Базируется на `<div>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxPanelStyles` — сетка панели и оболочка портала
 */
export const StyledComboboxPanel = styled.div.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getComboboxPanelStyles(props)}
`;

/**
 * StyledComboboxSearchRow — задаёт строку поиска в панели Combobox.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — поле поиска на всю ширину строки
 *  - `border-block-end` — шов со списком вместо тени Input
 *  - у `input` нулевые нижние радиусы и `box-shadow: none` — без щели тени на стыке
 *  - `outline: none` на `input:focus-visible` — кольцо фокуса даёт панель, не поле
 */
export const StyledComboboxSearchRow = styled.div`
  display: grid;

  & input {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
    box-shadow: none;
  }

  & input:focus-visible {
    outline: none;
  }
`;

/**
 * StyledComboboxList — задаёт список опций компонента Combobox.
 * Базируется на `<ul>`.
 *
 * Встроенные стили:
 *  - `display: grid` — опции столбиком
 */
export const StyledComboboxList = styled.ul`
  display: grid;
`;

/**
 * StyledComboboxOptionIcon — задаёт слот иконки опции перед лейблом.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `display: inline-grid` и `place-items: center` — центрирует глиф в слоте
 *  - `flex-shrink: 0` — слот не сжимается рядом с текстом опции
 */
export const StyledComboboxOptionIcon = styled.span`
  display: inline-grid;
  flex-shrink: 0;
  place-items: center;
`;

/**
 * getComboboxCheckStyles — возвращает CSS-правила для узла `StyledComboboxCheck`:
 * размер и цвет галочки выбранной опции.
 *
 * @param props объект с текущей темой
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxCheckStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);

  const styles = [
    'position: relative;',
    'z-index: 1;',
    `inline-size: ${getSpacingValue(20)};`,
    `block-size: ${getSpacingValue(20)};`,
    'margin-inline-start: auto;',
    `color: ${theme.colors.primary};`,
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxCheck — задаёт глиф галочки выбранной опции компонента Combobox.
 * Базируется на `<span>`.
 *
 * Генерация стилей:
 *  - `getComboboxCheckStyles` — размер и цвет галочки
 */
export const StyledComboboxCheck = styled.span`
  ${(props) => getComboboxCheckStyles(props)}
`;

/**
 * getComboboxOptionStyles — возвращает CSS-правила для узла `StyledComboboxOption`:
 * поверхность опции, отступы и синюю подсветку наведения. `display: flex` —
 * оправданное исключение: иконка опции, текст и check в одном потоке с `gap`,
 * отсутствующие слоты не резервируют трек.
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getComboboxOptionStyles(
  props: Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'position: relative;',
    'z-index: 0;',
    'display: flex;',
    `gap: ${getSpacingValue(12)};`,
    'align-items: center;',
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    'text-align: start;',
    `background-color: ${theme.colors.surface};`,
    '&::before {',
    'position: absolute;',
    `inset: ${getSpacingValue(4)};`,
    'z-index: -1;',
    'pointer-events: none;',
    "content: '';",
    `border-radius: calc(${resolveComboboxBlockRadius(shape, sizePreset)} - ${getSpacingValue(4)});`,
    getTransitionStyles('background-color', MOTION_MICRO_DURATION),
    '}',
    '&:focus { outline: none; }',
    `&[data-active='true']::before,`,
    '&:hover:not(:disabled)::before,',
    '&:focus-visible::before {',
    `background-color: ${theme.colors.primary};`,
    '}',
    `&[data-active='true'],`,
    '&:hover:not(:disabled),',
    '&:focus-visible {',
    `color: ${theme.colors.inverse};`,
    '}',
    `&[data-active='true'] [data-slot='check'],`,
    `&:hover:not(:disabled) [data-slot='check'],`,
    `&:focus-visible [data-slot='check'] {`,
    'color: inherit;',
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledComboboxOption — задаёт кнопку опции компонента Combobox.
 * Базируется на `<button>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getComboboxOptionStyles` — поверхность, отступы и подсветка
 */
export const StyledComboboxOption = styled.button.withConfig({
  shouldForwardProp: (prop) => !COMBOBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ComboboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getComboboxOptionStyles(props)}
`;
