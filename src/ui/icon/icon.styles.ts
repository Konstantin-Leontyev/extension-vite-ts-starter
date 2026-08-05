/**
 * Файл: `src/ui/icon/icon.styles.ts`
 * Определяет внешний вид компонента Icon.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconStyleProps`, `IconPosition`, `IconShapePreset`
 *    и `IconSizePreset`
 * 2. Хранить локальные ряды габарита в `iconSize` и отступов в `iconPadding`;
 *    радиус `rounded` для `tiny` — в `ICON_TINY_ROUNDED_RADIUS`
 * 3. Предоставить функции `getIconSize` и `getIconPadding`, дефолт
 *    `DEFAULT_ICON_POSITION`, перечни `ICON_POSITION_KEYS`,
 *    `ICON_SHAPE_PRESET_KEYS`, `ICON_SIZE_PRESET_KEYS` и `ICON_SETTING_PROP_NAMES`,
 *    а также хелперы секции на родителе: `getIconPositionStyles` и
 *    `resolveIconStateBackground`
 * 4. Предоставить styled-узел `StyledIcon`
 *
 * Потребители:
 *  - `src/ui/icon/index.tsx` — собирает компонент Icon и реэкспортирует
 *    публичное API
 *  - контролы с секцией иконки, например Button, Listbox, Combobox и RangeInput —
 *    подключают хелперы секции и читают позицию через `@ui/icon`
 *  - `src/ui/card/card.styles.ts` — читает `getIconSize` для резерва высоты
 *    ряда действий шапки
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SIZE_PRESET,
  minBlockSize,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  type TonePreset,
} from '@ui/tones';

/**
 * IconSizePreset — представляет размерный ряд окна Icon.
 * Расширяет канонический `SizePreset` ключом `tiny` под бокс Checkbox размера
 * `small`, не добавляя его в общий ряд контролов.
 */
export type IconSizePreset = 'tiny' | SizePreset;

/**
 * iconSize — хранит габарит окна иконки для каждого размера ряда.
 * Ключи канона — квадрат контрола из `minBlockSize`; `tiny` — бокс Checkbox
 * размера `small`. Используется в иконочных кнопках Table: добавление строки
 * и шеврон группы.
 */
const iconSize = {
  tiny: 12,
  ...minBlockSize,
} as const satisfies Record<IconSizePreset, SpacingValue>;

/**
 * ICON_SIZE_PRESET_KEYS — формирует перечень размеров окна Icon из ключей `iconSize`.
 * Используется в панелях настроек витрины дизайн-системы: `SizeListbox`
 * принимает его пропом `sizes`.
 */
export const ICON_SIZE_PRESET_KEYS = Object.freeze(
  Object.keys(iconSize) as IconSizePreset[]
);

/**
 * getIconSize — возвращает ключ шкалы габарита окна иконки по `sizePreset`.
 *
 * @param sizePreset размер окна иконки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getIconSize(sizePreset: IconSizePreset): SpacingValue {
  return iconSize[sizePreset];
}

/**
 * iconPadding — хранит внутренний отступ окна иконки для каждого размера ряда.
 * Вместе с квадратом из `iconSize` задаёт окно под svg. У `tiny` отступ `0`:
 * глиф с оптическим внутренним отступом viewBox читается на боксе `tiny`
 * без дополнительного отступа.
 */
const iconPadding = {
  large: 8,
  normal: 6,
  small: 4,
  tiny: 0,
} as const satisfies Record<IconSizePreset, SpacingValue>;

/**
 * getIconPadding — возвращает ключ шкалы внутреннего отступа окна иконки по `sizePreset`.
 * Мост размера → отступ для витрины и вызывающего кода: без явного `padding` окно
 * берёт значение из ряда. Панель синхронизирует состояние при смене `sizePreset`.
 *
 * @param sizePreset размер окна иконки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getIconPadding(sizePreset: IconSizePreset): SpacingValue {
  return iconPadding[sizePreset];
}

/**
 * ICON_TINY_ROUNDED_RADIUS — задаёт радиус формы `rounded` для размера `tiny`.
 * Паритет с боксом Checkbox размера `small`; ключи канона берут радиус из
 * `resolveBlockRadius`.
 */
const ICON_TINY_ROUNDED_RADIUS = 4;

/**
 * IconShapePreset — представляет форму окна иконки.
 */
export type IconShapePreset = 'round' | 'rounded' | 'square';

/**
 * ICON_SHAPE_PRESET_KEYS — задаёт перечень форм окна иконки.
 * Используется в панелях настроек витрины дизайн-системы: `ShapeListbox`
 * принимает его пропом `shapes`.
 */
export const ICON_SHAPE_PRESET_KEYS = Object.freeze([
  'square',
  'rounded',
  'round',
] as const satisfies readonly IconShapePreset[]);

/**
 * resolveIconBorderRadius — возвращает значение для CSS-свойства `border-radius`
 * по `shape` и `sizePreset`.
 *
 * Как работает:
 * 1. Для `square` отдаёт `0`
 * 2. Для `round` отдаёт `50%`: круг при любом габарите, в том числе через layout
 *    `inlineSize`/`blockSize`
 * 3. Для `rounded` при `tiny` — `ICON_TINY_ROUNDED_RADIUS`; иначе —
 *    `resolveBlockRadius` с формой `rounded` и габаритом окна
 *
 * @param shape форма окна иконки
 * @param sizePreset размер окна иконки
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveIconBorderRadius(
  shape: IconShapePreset,
  sizePreset: IconSizePreset
): string {
  if (shape === 'square') {
    return '0';
  }

  if (shape === 'round') {
    return '50%';
  }

  if (sizePreset === 'tiny') {
    return getSpacingValue(ICON_TINY_ROUNDED_RADIUS);
  }

  return resolveBlockRadius('rounded', getSpacingValue(getIconSize(sizePreset)));
}

/**
 * IconSurface — представляет статичную поверхность окна иконки: заливку и цвет глифа.
 * Состояния наведения и нажатия поверхность не включает — их родитель или сам Icon
 * при `showHover` передаёт каналом `--icon-state-background`.
 *
 * @property backgroundColor — заливка окна в покое. Нейтральный тон заливку не красит
 * @property color — цвет глифа. Нейтральный тон без `iconFill` наследует цвет контекста
 */
type IconSurface = {
  backgroundColor?: string;
  color?: string;
};

/**
 * resolveIconSurface — возвращает статичную поверхность окна иконки
 * по `iconTone` и `iconFill`. Приватный генератор Icon: родители статику
 * не вычисляют, а состояния передают каналом `--icon-state-background`.
 *
 * Как работает:
 * 1. Цветной `iconTone` красит заливку тоном, глиф — `inverse`. `iconFill`
 *    игнорируется: двухцветность на контрастной заливке не работает
 * 2. Нейтральный `iconTone` с цветным `iconFill` красит только глиф
 * 3. Нейтральный без `iconFill` не пишет ничего: заливка прозрачна,
 *    глиф наследует цвет контекста
 *
 * @param theme текущая тема
 * @param iconTone тон заливки окна иконки
 * @param iconFill тон глифа иконки
 * @returns статичная заливка и цвет глифа окна иконки
 */
function resolveIconSurface(
  theme: AppTheme,
  iconTone: TonePreset,
  iconFill?: TonePreset
): IconSurface {
  const colorKey = getToneColorKey(iconTone);

  if (colorKey) {
    return {
      backgroundColor: theme.colors[colorKey],
      color: theme.colors.inverse,
    };
  }

  const fillColorKey = iconFill ? getToneColorKey(iconFill) : undefined;

  if (fillColorKey) {
    return { color: theme.colors[fillColorKey] };
  }

  return {};
}

/**
 * IconSectionNeutralChannelPolicy — представляет политику канала состояний
 * для нейтрального `iconTone`: вуаль или отсутствие значения, когда канал не ставят.
 */
type IconSectionNeutralChannelPolicy = 'none' | 'veil';

/**
 * resolveIconStateBackground — возвращает значение канала `--icon-state-background`
 * для секции иконки на родителе. Цветной `iconTone` — сдвиг к `shade`. Нейтральный —
 * вуаль или `undefined` по `neutralPolicy`. Button не ставит канал на нейтрали.
 *
 * @param theme текущая тема
 * @param iconTone тон секции иконки
 * @param neutralPolicy политика канала для нейтрального тона
 * @returns CSS-значение заливки канала или `undefined`
 */
export function resolveIconStateBackground(
  theme: AppTheme,
  iconTone: TonePreset,
  neutralPolicy: IconSectionNeutralChannelPolicy = 'veil'
): string | undefined {
  const colorKey = getToneColorKey(iconTone);

  if (colorKey) {
    return resolveColorMix(theme.colors[colorKey], theme.colors.shade);
  }

  return neutralPolicy === 'veil' ? theme.colors.veil : undefined;
}

/**
 * IconPosition — представляет позицию иконки относительно соседнего контента.
 */
export type IconPosition = 'end' | 'start';

/**
 * ICON_POSITION_KEYS — задаёт перечень позиций иконки.
 * Используется в панелях настроек витрины дизайн-системы: `IconGroup` собирает
 * из него опции для `Listbox`.
 */
export const ICON_POSITION_KEYS = Object.freeze([
  'start',
  'end',
] as const satisfies readonly IconPosition[]);

/**
 * DEFAULT_ICON_POSITION — задаёт позицию иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconPosition`.
 */
export const DEFAULT_ICON_POSITION: IconPosition = 'end';

/**
 * ICON_SETTING_PROP_NAMES — хранит имена пропсов настройки секции иконки.
 * Компоненты подключают набор спредом в свой `*_PROP_NAMES` вместе с остальными
 * пропсами стилизации.
 */
export const ICON_SETTING_PROP_NAMES = new Set(['iconFill', 'iconPosition', 'iconTone']);

/**
 * getIconPositionStyles — возвращает CSS-правила переворота колонок родителя
 * под позицию `[data-slot='icon']` и растяжение секции по высоте ряда.
 * Родитель задаёт `display: grid` сам: хелпер не зашивает display — у ряда
 * с кнопкой сброса свои треки.
 *
 * @returns CSS-правила, каждое с новой строки
 */
export function getIconPositionStyles(): string {
  return `
    grid-template-columns: minmax(0, 1fr) auto;
    &:has(> [data-slot='icon']:first-child) { grid-template-columns: auto minmax(0, 1fr); }
    [data-slot='icon'] {
      block-size: 100%;
    }
  `;
}

/**
 * IconStyleProps — представляет пропсы стилизации Icon и layout-пропсы.
 *
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconTone — тон заливки окна иконки
 * @property interactive — включает канал состояний `--icon-state-background`
 *   родителя
 * @property shape — форма окна иконки
 * @property showHover — включает запись канала состояний на `:hover` и
 *   `:focus-visible`. Внутри контрола с собственным слоем наведения выключается,
 *   чтобы не было двойной подсветки
 * @property sizePreset — размер окна иконки
 */
export type IconStyleProps = LayoutProps &
  BorderProps & {
    iconFill?: TonePreset;
    iconTone?: TonePreset;
    interactive?: boolean;
    shape?: IconShapePreset;
    showHover?: boolean;
    sizePreset?: IconSizePreset;
  };

/**
 * ICON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Icon.
 */
const ICON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'iconFill',
  'iconTone',
  'interactive',
  'shape',
  'showHover',
  'sizePreset',
]);

/**
 * DEFAULT_ICON_SHAPE — задаёт форму окна иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `shape`.
 */
const DEFAULT_ICON_SHAPE: IconShapePreset = 'square';

/**
 * DEFAULT_ICON_SHOW_BORDER — задаёт показ рамки окна иконки по умолчанию.
 * Рамка выключена: безрамные действия шапки и декоративные окна — норма без
 * явного `showBorder={false}`. Рамку включают точечно, например секция триггера
 * и аватар в ProfileMenu.
 */
const DEFAULT_ICON_SHOW_BORDER = false;

/**
 * DEFAULT_ICON_INTERACTIVE — задаёт отключённый канал состояний по умолчанию.
 * Используется, когда вызывающий код не передал проп `interactive`.
 */
const DEFAULT_ICON_INTERACTIVE = false;

/**
 * DEFAULT_ICON_SHOW_HOVER — задаёт запись канала наведения по умолчанию.
 * Используется, когда вызывающий код не передал проп `showHover`.
 */
const DEFAULT_ICON_SHOW_HOVER = true;

/**
 * getIconStyles — возвращает CSS-правила для корня `StyledIcon`: габарит,
 * внутренний отступ, форму, рамку, статичную поверхность и канал состояний.
 *
 * Как работает:
 * 1. Собирает квадрат окна через `getIconSize` и внутренний отступ через
 *    `getIconPadding` по `sizePreset`
 * 2. Задаёт `border-radius` через `resolveIconBorderRadius` по `shape` и
 *    `sizePreset`. Без `shape` подставляет `DEFAULT_ICON_SHAPE`
 * 3. Кладёт рамку с тенью через `getBorderStyles`. Без `showBorder` рамка
 *    выключена через `DEFAULT_ICON_SHOW_BORDER`
 * 4. Считает статичную заливку и цвет глифа через `resolveIconSurface`
 * 5. При `interactive` или `showHover` кладёт заливку через канал
 *    `--icon-state-background` с запасным значением на статику
 * 6. При `showHover` на `:not(:disabled):hover` и `:focus-visible` пишет
 *    значение канала через `resolveIconStateBackground`
 * 7. Для кнопки сброса `[data-slot='clear']` на `:focus-visible` снимает
 *    глобальный `outline` и ставит ту же заливку, что канал наведения
 *
 * @param props пропсы стилизации Icon и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getIconStyles(props: IconStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    borderTone,
    iconFill,
    iconTone = DEFAULT_TONE,
    interactive = DEFAULT_ICON_INTERACTIVE,
    shape = DEFAULT_ICON_SHAPE,
    showBorder = DEFAULT_ICON_SHOW_BORDER,
    showHover = DEFAULT_ICON_SHOW_HOVER,
    showShadow = DEFAULT_SHOW_SHADOW,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const size = getSpacingValue(getIconSize(sizePreset));
  const surface = resolveIconSurface(theme, iconTone, iconFill);
  const usesStateChannel = interactive || showHover;
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  const styles = [
    `inline-size: ${size};`,
    `block-size: ${size};`,
    `padding: ${getSpacingValue(getIconPadding(sizePreset))};`,
    `border-radius: ${resolveIconBorderRadius(shape, sizePreset)};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
  ];

  if (usesStateChannel) {
    styles.push(
      `background-color: var(--icon-state-background, ${surface.backgroundColor ?? 'transparent'});`
    );
  } else if (surface.backgroundColor) {
    styles.push(`background-color: ${surface.backgroundColor};`);
  }

  if (surface.color) {
    styles.push(`color: ${surface.color};`);
  }

  if (showHover) {
    styles.push(
      `&:not(:disabled):hover,`,
      `&:focus-visible {`,
      `--icon-state-background: ${stateBackground};`,
      '}'
    );
  }

  const clearFocusBackground = stateBackground ?? theme.colors.veil;

  styles.push(
    `&[data-slot='clear']:focus-visible {`,
    'outline: none;',
    `--icon-state-background: ${clearFocusBackground};`,
    '}'
  );

  return styles.join('\n');
}

/**
 * StyledIcon — задаёт корневой узел компонента Icon.
 * Базируется на `<span>` и поддерживает все пропсы из `IconStyleProps`.
 * Полиморфный `as` задаёт корневой тег, например `<button>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `place-items: center` — центрирует svg в окне
 *  - `flex-shrink: 0` — окно не сжимается во flex-рядах
 *  - `overflow: hidden` — обрезает квадратное окно по скруглению
 *
 * Генерация стилей:
 *  - `getIconStyles` — габарит, внутренний отступ, форма, рамка с тенью,
 *    поверхность и канал состояний
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Единственный узел проекта, создающий условия рендера svg: центрирующий бокс.
 * Зажим svg по обеим осям даёт глобальный сброс из `@ui/reset`.
 */
export const StyledIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !ICON_PROP_NAMES.has(prop),
})<IconStyleProps>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  ${(props) => getIconStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
