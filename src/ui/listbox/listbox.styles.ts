/**
 * Файл: `src/ui/listbox/listbox.styles.ts`
 * Определяет внешний вид компонента Listbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ListboxStyleProps` и `ListboxSurfaceStyleProps`
 * 2. Предоставить функцию `getListboxTextSize`
 * 3. Предоставить styled-узлы `StyledListboxRoot`, `StyledListboxTriggerRow`,
 *    `StyledListboxTrigger`, `StyledListboxPanel`, `StyledListboxOptionButton`
 *    и `StyledListboxOptionRow`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — собирает компонент Listbox
 */

import styled from 'styled-components';

import { getCssAnchorBindingStyles } from '@ui/anchored-portal';
import { ICON_SETTING_PROP_NAMES } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  OPEN_CONTROL_ROW_GAP,
  getOpenControlOptionsListScrollStyles,
  getOpenControlPortalPanelStyles,
  getOpenControlRootStyles,
  getOpenControlSelectableRowSurfaceStyles,
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
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { type TonePreset } from '@ui/tones';

export { splitLayoutProps } from '@ui/layout';

/**
 * getListboxTextSize — возвращает размер текста триггера и опций по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер Listbox
 * @returns метка размера текста из `TextSizePreset` для текста триггера и опций
 */
export function getListboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * ListboxSurfaceStyleProps — представляет пропсы стилизации поверхности Listbox.
 *
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ListboxSurfaceStyleProps = OpenControlSurfaceStyleProps & {
  iconTone?: TonePreset;
};

/**
 * ListboxStyleProps — представляет пропсы стилизации Listbox и layout-пропсы.
 */
export type ListboxStyleProps = LayoutProps & ListboxSurfaceStyleProps;

/**
 * StyledListboxRoot — задаёт корневой узел компонента Listbox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Генерация стилей:
 *  - `getOpenControlRootStyles` — раскладка, зазор, ширина и подъём при открытии
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledListboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  ${getOpenControlRootStyles()}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * LISTBOX_SURFACE_PROP_NAMES — объединяет имена настроек иконки и пропсов
 * стилизации поверхности Listbox.
 */
const LISTBOX_SURFACE_PROP_NAMES = new Set<string>([
  ...ICON_SETTING_PROP_NAMES,
  'shape',
  'sizePreset',
]);

/**
 * StyledListboxTriggerRow — задаёт ряд триггера компонента Listbox.
 * Базируется на `<div>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getOpenControlTriggerRowStyles` — габариты, заливка, рамка с тенью и `outline` фокуса
 */
export const StyledListboxTriggerRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  ${(props) => getOpenControlTriggerRowStyles(props)}
`;

/**
 * getListboxTriggerStyles — возвращает CSS-правила для узла `StyledListboxTrigger`:
 * раскладку лейбла и хром кнопки-триггера через `getOpenControlTriggerStyles`.
 *
 * Как работает:
 * 1. Подставляет дефолт `sizePreset`
 * 2. Подставляет хром кнопки-триггера через `getOpenControlTriggerStyles`:
 *    раскладку позиции иконки и канал `--icon-state-background`
 * 3. Задаёт слоту лейбла `min-inline-size: 0` и `padding-inline` по размеру
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxTriggerStyles(
  props: ListboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getOpenControlTriggerStyles(props)}
    [data-slot='label'] {
      min-inline-size: 0;
      padding-inline: ${getPaddingInline(sizePreset)};
    }
  `;
}

/**
 * StyledListboxTrigger — задаёт кнопку-триггер компонента Listbox.
 * Базируется на `<button>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Генерация стилей:
 *  - `getListboxTriggerStyles` — раскладка лейбла и хром кнопки-триггера
 */
export const StyledListboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  ${(props) => getListboxTriggerStyles(props)}
`;

/**
 * LISTBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки опции Listbox.
 */
const LISTBOX_BOX_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * ListboxPanelStyleProps — представляет пропсы стилизации выпадающей панели опций Listbox.
 *
 * @property $drumShift — сдвиг барабана относительно якоря
 */
type ListboxPanelStyleProps = Pick<
  ListboxSurfaceStyleProps,
  'shape' | 'sizePreset'
> & {
  $drumShift: string;
};

/**
 * LISTBOX_PANEL_PROP_NAMES — хранит имена пропсов стилизации панели Listbox.
 */
const LISTBOX_PANEL_PROP_NAMES = new Set<string>([
  '$drumShift',
  ...LISTBOX_BOX_PROP_NAMES,
]);

/**
 * LISTBOX_DRUM_SHIFT_CUSTOM_PROPERTY — задаёт имя CSS-свойства сдвига барабана.
 * Используется в `getListboxPanelStyles` для смещения панели относительно якоря.
 */
const LISTBOX_DRUM_SHIFT_CUSTOM_PROPERTY = '--listbox-drum-shift';

/**
 * getListboxPanelStyles — возвращает CSS-правила для узла `StyledListboxPanel`:
 * хром портала через `getOpenControlPortalPanelStyles`, CSS-привязку к якорю,
 * сдвиг барабана и прокрутку списка через `getOpenControlOptionsListScrollStyles`.
 *
 * Как работает:
 * 1. Подставляет дефолт `sizePreset`
 * 2. Подставляет хром панели через `getOpenControlPortalPanelStyles`
 * 3. Привязывает панель к триггеру через `getCssAnchorBindingStyles`,
 *    `anchor(start)`, `anchor-size(width)` и сдвиг `--listbox-drum-shift`
 * 4. Ограничивает высоту и включает прокрутку через
 *    `getOpenControlOptionsListScrollStyles`
 *
 * @param props пропсы формы, размера, сдвига барабана и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxPanelStyles(
  props: ListboxPanelStyleProps & { theme: AppTheme }
): string {
  const { $drumShift, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getOpenControlPortalPanelStyles(props)}
    ${getCssAnchorBindingStyles()}
    ${LISTBOX_DRUM_SHIFT_CUSTOM_PROPERTY}: ${$drumShift};
    inset-block-start: calc(anchor(start) + var(${LISTBOX_DRUM_SHIFT_CUSTOM_PROPERTY}));
    inset-inline-start: anchor(start);
    inline-size: anchor-size(width);
    ${getOpenControlOptionsListScrollStyles(sizePreset)}
  `;
}

/**
 * StyledListboxPanel — задаёт выпадающую панель опций компонента Listbox.
 * Базируется на `<ul>` и принимает пропсы `$drumShift`, `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxPanelStyles` — хром портала через `getOpenControlPortalPanelStyles`,
 *    CSS-привязка к якорю, сдвиг барабана, высота и прокрутка
 */
export const StyledListboxPanel = styled.ul.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_PANEL_PROP_NAMES.has(prop),
})<ListboxPanelStyleProps>`
  ${(props) => getListboxPanelStyles(props)}
`;

/**
 * getListboxOptionSurfaceBaseStyles — возвращает CSS-правила общей поверхности
 * строки опции: хром выбираемой строки и слой слота лейбла.
 *
 * Как работает:
 * 1. Подставляет поверхность через `getOpenControlSelectableRowSurfaceStyles`:
 *    раскладку, габариты, заливку и подложку наведения через `::before`
 * 2. Готовит слот лейбла: `min-inline-size: 0` и слой над подложкой
 *
 * @param props пропсы формы, размера и тема
 * @param highlightWhen селектор записи цвета в `::before`
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionSurfaceBaseStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme },
  highlightWhen?: string
): string {
  return `
    ${getOpenControlSelectableRowSurfaceStyles(props, {
      display: 'grid',
      gap: OPEN_CONTROL_ROW_GAP,
      highlight: 'primary',
      highlightWhen,
    })}
    [data-slot='label'] {
      min-inline-size: 0;
      z-index: 1;
    }
  `;
}

/**
 * getListboxOptionButtonStyles — возвращает CSS-правила для узла
 * `StyledListboxOptionButton`: базовую поверхность, отступы и синюю подсветку.
 *
 * Как работает:
 * 1. Берёт базовую поверхность через `getListboxOptionSurfaceBaseStyles`: раскладку,
 *    габариты, заливку и подложку наведения через `::before`
 * 2. Задаёт колонки лейбла и галочки, отступы лейбла
 * 3. На `:not(:disabled):hover` и `:focus-visible` красит текст в `inverse`,
 *    включая слот галочки
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionButtonStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getListboxOptionSurfaceBaseStyles(props)}
    grid-template-columns: minmax(0, 1fr) auto;
    padding-inline: ${getPaddingInline(sizePreset)};
    &:not(:disabled):hover,
    &:focus-visible {
      color: ${theme.colors.inverse};
    }
    &:not(:disabled):hover [data-slot='check'],
    &:focus-visible [data-slot='check'] {
      color: ${theme.colors.inverse};
    }
  `;
}

/**
 * StyledListboxOptionButton — задаёт кнопку опции компонента Listbox.
 * Базируется на `<button>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxOptionButtonStyles` — поверхность, отступы и подсветка
 */
export const StyledListboxOptionButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxOptionButtonStyles(props)}
`;

/**
 * getListboxOptionRowStyles — возвращает CSS-правила для узла `StyledListboxOptionRow`:
 * базовую поверхность опции, курсор и синюю подсветку наведения.
 *
 * Как работает:
 * 1. Берёт базовую поверхность через `getListboxOptionSurfaceBaseStyles`: раскладку,
 *    габариты, заливку и подложку наведения через `::before`
 * 2. Задаёт `cursor: pointer` на строке-метке: сброс даёт `pointer` только button
 * 3. Задаёт отступы и красит текст в `inverse` при наведении и фокусе внутри
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionRowStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  return `
    ${getListboxOptionSurfaceBaseStyles(
      props,
      `&:not(:has(input:disabled)):hover::before,
    &:focus-within::before`
    )}
    grid-template-columns: auto minmax(0, 1fr);
    cursor: pointer;
    padding-inline: ${getPaddingInline(sizePreset)};
    &:not(:has(input:disabled)):hover,
    &:focus-within {
      color: ${theme.colors.inverse};
    }
  `;
}

/**
 * StyledListboxOptionRow — задаёт строку опции с чекбоксом компонента Listbox.
 * Базируется на `<label>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxOptionRowStyles` — поверхность, курсор и подсветка
 */
export const StyledListboxOptionRow = styled.label.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxOptionRowStyles(props)}
`;
