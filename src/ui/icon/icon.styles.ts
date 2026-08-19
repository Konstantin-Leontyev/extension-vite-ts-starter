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
 *    а также хелперы секции на родителе: `getIconPositionStyles`,
 *    `resolveIconShape` и `resolveIconStateBackground`
 * 4. Предоставить styled-узел `StyledIcon`
 *
 * Потребители:
 *  - `src/ui/icon/index.tsx` — собирает компонент Icon и реэкспортирует
 *    публичное API
 *  - контролы с секцией иконки, например Button, Listbox, Combobox, RangeInput,
 *    SearchField и SegmentButtonParts — подключают хелперы секции и читают
 *    позицию через `@ui/icon`
 *  - `@ui/toolbar` — читает `resolveIconShape` для формы действий
 *  - `@ui/button`, `@ui/input` и `@ui/search-field` — читают `resolveIconShape`
 *    для формы секции иконки или сброса; SearchField — для обоих
 *  - `@ui/listbox`, `@ui/combobox` и `@ui/range-input` —
 *    читают `resolveIconShape` для формы окна сброса и шеврона
 *  - `src/pages/showcase` — читает `getIconPadding`
 *  - `src/ui/card/card.styles.ts` — читает `getIconSize` для резерва высоты
 *    ряда действий шапки
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type ShowBorderProps,
} from '@ui/border';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  minBlockSize,
  resolveBlockRadius,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  resolvePressedBackground,
  resolveVeilBackground,
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
 * getIconSize — возвращает ключ шкалы габарита окна иконки по `size`.
 *
 * @param size размер окна иконки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getIconSize(size: IconSizePreset): SpacingValue {
  return iconSize[size];
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
 * getIconPadding — возвращает ключ шкалы внутреннего отступа окна иконки по `size`.
 * Мост размера → отступ для витрины и вызывающего кода: без явного `padding` окно
 * берёт значение из ряда.
 *
 * @param size размер окна иконки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
export function getIconPadding(size: IconSizePreset): SpacingValue {
  return iconPadding[size];
}

/**
 * ICON_TINY_ROUNDED_RADIUS — задаёт радиус формы `rounded` для размера `tiny`.
 * Паритет с боксом Checkbox размера `small`. Ключи канона берут радиус из
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
 * resolveIconShape — принимает форму контрола и возвращает форму окна иконки.
 * `pill` даёт `round`, иначе `rounded`.
 *
 * @param shape форма контрола
 * @returns форма окна иконки
 */
export function resolveIconShape(
  shape: ShapePreset = DEFAULT_SHAPE_PRESET
): IconShapePreset {
  return shape === 'pill' ? 'round' : 'rounded';
}

/**
 * resolveIconBorderRadius — возвращает значение для CSS-свойства `border-radius`
 * по `shape` и `size`.
 *
 * Как работает:
 * 1. Для `square` отдаёт `0`
 * 2. Для `round` отдаёт `50%`: круг при любом габарите, в том числе через layout
 *    `inlineSize`/`blockSize`
 * 3. Для `rounded` при `tiny` — `ICON_TINY_ROUNDED_RADIUS`; иначе —
 *    `resolveBlockRadius` с формой `rounded` и габаритом окна
 *
 * @param shape форма окна иконки
 * @param size размер окна иконки
 * @returns значение для CSS-свойства `border-radius`
 */
function resolveIconBorderRadius(shape: IconShapePreset, size: IconSizePreset): string {
  if (shape === 'square') {
    return '0';
  }

  if (shape === 'round') {
    return '50%';
  }

  if (size === 'tiny') {
    return getSpacingValue(ICON_TINY_ROUNDED_RADIUS);
  }

  return resolveBlockRadius('rounded', getSpacingValue(getIconSize(size)));
}

/**
 * IconSurface — представляет статичную поверхность окна иконки: заливку и цвет глифа.
 * Состояния наведения и нажатия поверхность не включает. Секция-окно передаёт
 * их каналом `--icon-state-background`. Кнопка красит заливку сама.
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
 * вуаль или `undefined` по `neutralPolicy`. Политика `'none'` оставляет канал
 * пустым, когда подсветку нейтрали несёт заливка узла.
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
 * @property active — включает зафиксированное нажатое состояние у `as="button"`
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconTone — тон заливки окна иконки
 * @property interactive — включает канал состояний `--icon-state-background`
 *   родителя
 * @property shape — форма окна иконки
 * @property showHover — включает запись канала состояний на `:hover` и
 *   `:focus-visible`. Внутри контрола с собственным слоем наведения выключается,
 *   чтобы не было двойной подсветки
 * @property size — размер окна иконки
 */
export type IconStyleProps = LayoutProps &
  ShowBorderProps & {
    active?: boolean;
    iconFill?: TonePreset;
    iconTone?: TonePreset;
    interactive?: boolean;
    shape?: IconShapePreset;
    showHover?: boolean;
    size?: IconSizePreset;
  };

/**
 * IconStyledProps — представляет пропсы стилизации узла `StyledIcon`.
 *
 * @property isButton — включает ветку заливки и тени как у Button
 */
type IconStyledProps = IconStyleProps & { isButton?: boolean };

/**
 * ICON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Icon.
 */
const ICON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'active',
  'iconFill',
  'iconTone',
  'interactive',
  'isButton',
  'shape',
  'showHover',
  'size',
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
 * DEFAULT_ICON_ACTIVE — задаёт зафиксированное нажатое состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `active`.
 */
const DEFAULT_ICON_ACTIVE = false;

/**
 * DEFAULT_ICON_IS_BUTTON — задаёт ветку кнопки по умолчанию.
 * Используется, когда вызывающий код не передал проп `isButton`.
 */
const DEFAULT_ICON_IS_BUTTON = false;

/**
 * getIconStyles — возвращает CSS-правила для корня `StyledIcon`: габарит,
 * внутренний отступ, форму, рамку с тенью, статичную поверхность, канал
 * состояний, ветку `isButton` и фокус кнопки сброса.
 *
 * Как работает:
 * 1. Собирает квадрат окна через `getIconSize` и внутренний отступ через
 *    `getIconPadding` по `size`
 * 2. Задаёт `border-radius` через `resolveIconBorderRadius` по `shape` и
 *    `size`. Без `shape` подставляет `DEFAULT_ICON_SHAPE`
 * 3. Кладёт рамку с тенью через `getBorderStyles`. Без `showBorder` рамка
 *    выключена через `DEFAULT_ICON_SHOW_BORDER`
 * 4. Считает статичную заливку и цвет глифа через `resolveIconSurface`
 * 5. При `isButton` красит окно как кнопку: нейтраль — `surface`, цветной —
 *    тон. Наведение — вуаль поверх заливки или сдвиг к `shade`. На `:active` и
 *    при `active` — заливка из `resolvePressedBackground` и `shadow.pressed`
 *    через `getBorderStyles`. Без рамки снаружи пусто, вдавленность остаётся.
 *    Наведение тень не меняет. `Icon` ставит проп только при `as="button"`.
 *    Секция-`span` ветку не берёт
 * 6. Иначе при `interactive` или `showHover` кладёт заливку через канал
 *    `--icon-state-background` с запасным значением на статику
 * 7. При `showHover` без `isButton` на `:not(:disabled):hover` и
 *    `:focus-visible` пишет значение канала через `resolveIconStateBackground`
 * 8. Для кнопки сброса `[data-slot='clear']` на `:focus-visible` снимает
 *    глобальный `outline` и красит `background-color` декларацией тем же
 *    цветом, что возвращает `resolveIconStateBackground`, не через канал
 *    `--icon-state-background`
 *
 * @param props пропсы стилизации Icon и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getIconStyles(props: IconStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_ICON_ACTIVE,
    borderTone,
    iconFill,
    iconTone = DEFAULT_TONE,
    interactive = DEFAULT_ICON_INTERACTIVE,
    isButton = DEFAULT_ICON_IS_BUTTON,
    shape = DEFAULT_ICON_SHAPE,
    showBorder = DEFAULT_ICON_SHOW_BORDER,
    showHover = DEFAULT_ICON_SHOW_HOVER,
    showShadow = DEFAULT_SHOW_SHADOW,
    size = DEFAULT_SIZE_PRESET,
  } = props;
  const surface = resolveIconSurface(theme, iconTone, iconFill);
  const usesStateChannel = !isButton && (interactive || showHover);
  const stateBackground = resolveIconStateBackground(theme, iconTone);

  const styles = [
    `inline-size: ${getSpacingValue(getIconSize(size))};`,
    `block-size: ${getSpacingValue(getIconSize(size))};`,
    `padding: ${getSpacingValue(getIconPadding(size))};`,
    `border-radius: ${resolveIconBorderRadius(shape, size)};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
  ];

  if (isButton) {
    const restBackground = surface.backgroundColor ?? theme.colors.surface;
    const colorKey = getToneColorKey(iconTone);
    const hoverBackground = colorKey
      ? resolveColorMix(theme.colors[colorKey], theme.colors.shade)
      : resolveVeilBackground(theme, restBackground);
    const pressedBackground = resolvePressedBackground(theme, iconTone);
    const pressedBorder = getBorderStyles(
      theme,
      showBorder,
      showShadow,
      borderTone,
      true
    );

    styles.push(`background-color: ${restBackground};`);

    if (!surface.color) {
      styles.push(`color: ${theme.colors.default};`);
    }

    if (showHover) {
      styles.push(
        `&:not(:disabled):hover,`,
        `&:focus-visible {`,
        `background: ${hoverBackground};`,
        '}'
      );
    }

    styles.push(
      `&:not(:disabled):active {`,
      `background: ${pressedBackground};`,
      pressedBorder,
      '}'
    );

    if (active) {
      styles.push(
        `&:not(:disabled) {`,
        `background: ${pressedBackground};`,
        pressedBorder,
        '}'
      );
    }
  } else if (usesStateChannel) {
    styles.push(
      `background-color: var(--icon-state-background, ${surface.backgroundColor ?? 'transparent'});`
    );
  } else if (surface.backgroundColor) {
    styles.push(`background-color: ${surface.backgroundColor};`);
  }

  if (surface.color) {
    styles.push(`color: ${surface.color};`);
  }

  if (!isButton && showHover) {
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
    `background-color: ${clearFocusBackground};`,
    '}'
  );

  return styles.join('\n');
}

/**
 * StyledIcon — задаёт корневой узел компонента Icon.
 * Базируется на `<span>` и поддерживает все пропсы из `IconStyledProps`.
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
 *    поверхность, канал состояний, ветка `isButton` и фокус кнопки сброса
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Единственный узел проекта, создающий условия рендера svg: центрирующий бокс.
 * Зажим svg по обеим осям даёт глобальный сброс из `@ui/reset`.
 */
export const StyledIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !ICON_PROP_NAMES.has(prop),
})<IconStyledProps>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  overflow: hidden;
  ${(props) => getIconStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
