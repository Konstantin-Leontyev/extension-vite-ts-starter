/**
 * Файл: `src/ui/listbox/listbox.styles.ts`
 * Определяет внешний вид компонента Listbox.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ListboxStyleProps` и `ListboxSurfaceStyleProps`
 * 2. Предоставить функцию `getListboxTextSize`
 * 3. Предоставить styled-узлы `StyledListboxRoot`, `StyledListboxTrigger`,
 *    `StyledListboxPanel`, `StyledListboxOptionButton`, `StyledListboxCheck`
 *    и `StyledListboxOptionRow`
 * 4. Реэкспортировать `splitLayoutProps` для сборки в `index.tsx`
 *
 * Потребители:
 *  - `src/ui/listbox/index.tsx` — собирает компонент Listbox
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
 * getListboxTextSize — возвращает размер текста триггера и опций по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер компонента
 * @returns метка размера текста из `TextSizePreset` для текста триггера и опций
 */
export function getListboxTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * resolveListboxBlockRadius — возвращает скругление поверхности по `shape` и `sizePreset`.
 *
 * @param shape форма поверхности
 * @param sizePreset размер компонента
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveListboxBlockRadius(shape: ShapePreset, sizePreset: SizePreset): string {
  return resolveBlockRadius(shape, getMinBlockSize(sizePreset));
}

/**
 * ListboxSurfaceStyleProps — представляет пропсы стилизации поверхности Listbox.
 *
 * @property iconFill — тон глифа шеврона
 * @property iconPosition — позиция шеврона относительно значения
 * @property iconTone — тон секции шеврона
 * @property shape — форма поверхности
 * @property sizePreset — размер компонента
 */
type ListboxSurfaceStyleProps = {
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/**
 * ListboxStyleProps — представляет пропсы стилизации Listbox и layout-пропсы.
 */
export type ListboxStyleProps = LayoutProps & ListboxSurfaceStyleProps;

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
 * LISTBOX_BOX_PROP_NAMES — хранит имена пропсов стилизации строки и панели Listbox.
 */
const LISTBOX_BOX_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/**
 * StyledListboxRoot — задаёт корневой узел компонента Listbox.
 * Базируется на `<div>` и поддерживает layout-пропсы.
 *
 * Встроенные стили:
 *  - `position: relative` — якорь для позиционирования панели
 *  - `display: grid` — вертикальный поток подписи, триггера и резерва ошибки
 *  - `gap` — отступ между подписью, триггером и резервом ошибки
 *  - `inline-size: 100%` — контрол занимает ширину родителя
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 *  - `z-index: 50` при `data-open` — поднимает корень над соседями при открытой панели
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledListboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  position: relative;
  display: grid;
  gap: ${getSpacingValue(8)};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}

  &[data-open='true'] {
    z-index: 50;
  }
`;

/**
 * getListboxTriggerStyles — возвращает CSS-правила для узла `StyledListboxTrigger`:
 * габариты, рамку, заливку, тень, раскладку лейбла и поверхность секции шеврона.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты пропсов и считает поверхность шеврона
 * 2. Собирает габариты триггера, заливку, рамку и тень
 * 3. Красит лейбл и секцию шеврона: отступы, радиусы и цвет по `iconPosition`
 * 4. Добавляет шов, только когда тон секции нейтрален
 * 5. Подсвечивает секцию шеврона при наведении триггера
 *
 * @param props пропсы поверхности и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxTriggerStyles(
  props: ListboxSurfaceStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    iconFill,
    iconPosition = DEFAULT_ICON_POSITION,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const size = getMinBlockSize(sizePreset);
  const borderRadius = resolveBlockRadius(shape, size);
  const iconSurface = resolveIconSurface(theme, iconTone, iconFill);
  const isIconStart = iconPosition === 'start';
  const showSeam = iconTone === DEFAULT_TONE;

  const styles = [
    `min-block-size: ${size};`,
    `border-radius: ${borderRadius};`,
    'inline-size: 100%;',
    'min-inline-size: 0;',
    'text-align: start;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
    `[data-slot='label'] {`,
    'flex: 1 1 auto;',
    'align-content: center;',
    'min-inline-size: 0;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    isIconStart
      ? `border-start-end-radius: ${borderRadius};\nborder-end-end-radius: ${borderRadius};`
      : `border-start-start-radius: ${borderRadius};\nborder-end-start-radius: ${borderRadius};`,
    `}`,
    `[data-slot='icon'] {`,
    `inline-size: ${size};`,
    `min-inline-size: ${size};`,
    `color: ${iconSurface.color};`,
    `background-color: ${iconSurface.backgroundColor};`,
    isIconStart
      ? `border-start-start-radius: ${borderRadius};\nborder-end-start-radius: ${borderRadius};`
      : `border-start-end-radius: ${borderRadius};\nborder-end-end-radius: ${borderRadius};`,
  ];

  if (showSeam) {
    styles.push(
      isIconStart
        ? `box-shadow: inset -1px 0 0 ${theme.colors.border};`
        : `box-shadow: inset 1px 0 0 ${theme.colors.border};`
    );
  }

  styles.push(
    `}`,
    `&:not(:disabled):hover [data-slot='icon'] {`,
    `background: ${iconSurface.hoverBackground};`,
    `}`
  );

  return styles.join('\n');
}

/**
 * StyledListboxTrigger — задаёт кнопку-триггер компонента Listbox.
 * Базируется на `<button>` и принимает пропсы из `ListboxSurfaceStyleProps`.
 *
 * Встроенные стили:
 *  - `display: flex` — лейбл и шеврон в ряд
 *  - `visibility: hidden` при `data-open` — скрывает триггер при открытой панели,
 *    чтобы панель наследовала ширину якоря без двойного отображения
 *
 * Генерация стилей:
 *  - `getListboxTriggerStyles` — габариты, рамка, заливка, тень, лейбл и секция шеврона
 */
export const StyledListboxTrigger = styled.button.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_SURFACE_PROP_NAMES.has(prop),
})<ListboxSurfaceStyleProps>`
  display: flex;
  ${(props) => getListboxTriggerStyles(props)}

  &[data-open='true'] {
    visibility: hidden;
  }
`;

/**
 * getListboxPanelStyles — возвращает CSS-правила для узла `StyledListboxPanel`:
 * фиксированное положение, ограничение высоты шестью строками, прокрутку,
 * заливку, рамку, тень, радиус и кольцо фокуса.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты `shape` и `sizePreset`
 * 2. Собирает позицию, z-index и `max-block-size` в шесть строк опции с прокруткой
 * 3. Красит заливку, рамку, тень, радиус и кольцо фокуса
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxPanelStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    'z-index: 2000;',
    `max-block-size: calc(${getMinBlockSize(sizePreset)} * 6);`,
    'overflow: hidden auto;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `box-shadow: ${theme.shadow.surface};`,
    `border-radius: ${resolveListboxBlockRadius(shape, sizePreset)};`,
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
  ];

  return styles.join('\n');
}

/**
 * StyledListboxPanel — задаёт выпадающую панель опций компонента Listbox.
 * Базируется на `<ul>` и принимает пропсы `shape` и `sizePreset`.
 *
 * Генерация стилей:
 *  - `getListboxPanelStyles` — позиция, высота, заливка, рамка, тень и кольцо фокуса
 */
export const StyledListboxPanel = styled.ul.withConfig({
  shouldForwardProp: (prop) => !LISTBOX_BOX_PROP_NAMES.has(prop),
})<Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'>>`
  ${(props) => getListboxPanelStyles(props)}
`;

/**
 * getListboxOptionSurfaceBaseStyles — возвращает CSS-правила общей поверхности
 * строки опции: раскладку, габариты и подложку наведения через `::before`.
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionSurfaceBaseStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { shape = DEFAULT_SHAPE_PRESET, sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    'position: relative;',
    'z-index: 0;',
    'display: flex;',
    `gap: ${getSpacingValue(12)};`,
    'align-items: center;',
    'justify-content: space-between;',
    'inline-size: 100%;',
    `min-block-size: ${getMinBlockSize(sizePreset)};`,
    'text-align: start;',
    `background-color: ${theme.colors.surface};`,
    `[data-slot='label'] {`,
    'min-inline-size: 0;',
    'z-index: 1;',
    '}',
    '&::before {',
    '  position: absolute;',
    `  inset: ${getSpacingValue(4)};`,
    '  z-index: -1;',
    '  pointer-events: none;',
    "  content: '';",
    `  border-radius: calc(${resolveListboxBlockRadius(shape, sizePreset)} - ${getSpacingValue(4)});`,
    '  transition: background-color 0.12s ease;',
    '}',
  ];

  return styles.join('\n');
}

/**
 * getListboxOptionButtonStyles — возвращает CSS-правила для узла
 * `StyledListboxOptionButton`: базовую поверхность, отступы и подсветку
 * наведения и фокуса.
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionButtonStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    getListboxOptionSurfaceBaseStyles(props),
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    '&:focus {',
    '  outline: none;',
    '}',
    '&:hover:not(:disabled)::before,',
    '&:focus-visible::before {',
    `  background-color: ${theme.colors.primary};`,
    '}',
    '&:hover:not(:disabled),',
    '&:focus-visible {',
    `  color: ${theme.colors.inverse};`,
    '}',
    `&:hover:not(:disabled) [data-slot='check'],`,
    `&:focus-visible [data-slot='check'] {`,
    `  color: ${theme.colors.inverse};`,
    '}',
  ];

  return styles.join('\n');
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
 * getListboxCheckStyles — возвращает CSS-правила для узла `StyledListboxCheck`:
 * размер глифа галочки и акцентный цвет.
 *
 * @param props объект с текущей темой
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxCheckStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);

  const styles = [
    'position: relative;',
    'z-index: 1;',
    'flex-shrink: 0;',
    `inline-size: ${getSpacingValue(20)};`,
    `block-size: ${getSpacingValue(20)};`,
    `color: ${theme.colors.primary};`,
  ];

  return styles.join('\n');
}

/**
 * StyledListboxCheck — задаёт глиф галочки выбранной опции компонента Listbox.
 * Базируется на `<span>`.
 *
 * Генерация стилей:
 *  - `getListboxCheckStyles` — размер и цвет галочки
 */
export const StyledListboxCheck = styled.span`
  ${(props) => getListboxCheckStyles(props)}
`;

/**
 * getListboxOptionRowStyles — возвращает CSS-правила для узла `StyledListboxOptionRow`:
 * базовую поверхность опции, курсор и подсветку наведения.
 *
 * Как работает:
 * 1. Берёт базовую поверхность через `getListboxOptionSurfaceBaseStyles`
 * 2. Задаёт `cursor: pointer` на строке-метке: сброс даёт `pointer` только button
 * 3. Добавляет отступы, растяжение лейбла и подсветку при наведении и фокусе внутри
 *
 * @param props пропсы формы, размера и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getListboxOptionRowStyles(
  props: Pick<ListboxSurfaceStyleProps, 'shape' | 'sizePreset'> & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;

  const styles = [
    getListboxOptionSurfaceBaseStyles(props),
    'cursor: pointer;',
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    `[data-slot='label'] {`,
    'flex: 1 1 auto;',
    '}',
    '&:not(:has(input:disabled)):hover::before,',
    '&:focus-within::before {',
    `  background-color: ${theme.colors.primary};`,
    '}',
    '&:not(:has(input:disabled)):hover,',
    '&:focus-within {',
    `  color: ${theme.colors.inverse};`,
    '}',
  ];

  return styles.join('\n');
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
