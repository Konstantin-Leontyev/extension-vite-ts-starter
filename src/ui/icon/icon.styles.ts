/**
 * Файл: `src/ui/icon/icon.styles.ts`
 * Определяет внешний вид компонента Icon.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconStyleProps` и `IconPosition`
 * 2. Хранить локальные ряды габарита в `iconSize` и отступов в `iconPadding`
 * 3. Предоставить функцию `getIconPadding`, дефолт `DEFAULT_ICON_POSITION`,
 *    перечни `ICON_POSITION_KEYS` и `ICON_SETTING_PROP_NAMES`, а также хелперы
 *    секции на родителе: `getIconSectionTrackStyles`, `getIconSectionSeamStyles`
 *    и `resolveIconStateBackground`
 * 4. Предоставить styled-узел `StyledIcon`
 *
 * Потребители:
 *  - `src/ui/icon/index.tsx` — собирает компонент Icon и реэкспортирует
 *    публичное API
 *  - контролы с секцией иконки, например Button, Listbox, Combobox и RangeInput —
 *    подключают хелперы секции и читают позицию через `@ui/icon`
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, minBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  type TonePreset,
} from '@ui/tones';

/**
 * IconSizePreset — представляет размерный ряд окна иконки.
 * Расширяет канонический `SizePreset` ключом `huge`, не добавляя его
 * в общий ряд контролов: `huge` доступен только там, где родитель передаёт
 * свой расширенный ряд, например RoundButton.
 */
type IconSizePreset = 'huge' | SizePreset;

/**
 * iconSize — хранит габарит окна иконки для каждого размера ряда.
 * Расширяет `minBlockSize` из `@ui/presets` спредом, добавляя локальный ключ `huge`:
 * окно повторяет квадрат контрола своего размера.
 */
const iconSize = {
  ...minBlockSize,
  huge: 80,
} as const satisfies Record<IconSizePreset, SpacingValue>;

/**
 * getIconSize — возвращает ключ шкалы габарита окна иконки по `sizePreset`.
 *
 * @param sizePreset размер окна иконки
 * @returns ключ шкалы отступов из `@ui/spacing`
 */
function getIconSize(sizePreset: IconSizePreset): SpacingValue {
  return iconSize[sizePreset];
}

/**
 * iconPadding — хранит внутренний отступ окна иконки для каждого размера ряда.
 * Ключ — размер из `IconSizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Вместе с квадратом из `iconSize` задаёт окно под svg: 24/28/32/64
 * для `small`/`normal`/`large`/`huge` по контракту оси иконки.
 */
const iconPadding = {
  small: 4,
  normal: 6,
  large: 8,
  huge: 8,
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
 * IconSurface — представляет статичную поверхность окна иконки: заливку и цвет глифа.
 * Состояния наведения и нажатия поверхность не включает — их родитель передаёт
 * каналом `--icon-state-background`.
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
 * ICON_SECTION_SEAM_SLOT — задаёт `data-slot` секции шва, когда вызывающий код
 * не передал `slot`.
 */
const ICON_SECTION_SEAM_SLOT = 'icon';

/**
 * getIconSectionTrackStyles — возвращает CSS-правила переворота колонок родителя
 * под позицию `[data-slot='icon']` и растяжение секции по высоте ряда.
 * Родитель задаёт `display: grid` сам: хелпер не зашивает display — у ряда
 * с кнопкой сброса свои треки.
 *
 * @returns CSS-правила, каждое с новой строки
 */
export function getIconSectionTrackStyles(): string {
  const styles = [
    'grid-template-columns: minmax(0, 1fr) auto;',
    `&:has(> [data-slot='icon']:first-child) { grid-template-columns: auto minmax(0, 1fr); }`,
    `[data-slot='icon'] {`,
    'block-size: 100%;',
    `}`,
  ];

  return styles.join('\n');
}

/**
 * getIconSectionSeamStyles — возвращает CSS-правила шва секции по
 * `:first-child` / `:last-child` через `box-shadow: inset …` без сдвига бокса.
 *
 * @param options цвет шва и опциональный `data-slot` секции
 * @returns CSS-правила, каждое с новой строки
 */
export function getIconSectionSeamStyles(options: {
  borderColor: string;
  slot?: string;
}): string {
  const { borderColor, slot = ICON_SECTION_SEAM_SLOT } = options;

  const styles = [
    `[data-slot='${slot}']:first-child {`,
    `box-shadow: inset -1px 0 0 ${borderColor};`,
    `}`,
    `[data-slot='${slot}']:last-child {`,
    `box-shadow: inset 1px 0 0 ${borderColor};`,
    `}`,
  ];

  return styles.join('\n');
}

/**
 * IconStyleProps — представляет пропсы стилизации Icon и layout-пропсы.
 *
 * @property iconFill — тон глифа иконки при нейтральном `iconTone`
 * @property iconTone — тон заливки окна иконки
 * @property interactive — включает канал состояний `--icon-state-background`
 *   родителя
 * @property sizePreset — размер окна иконки
 */
export type IconStyleProps = LayoutProps & {
  iconFill?: TonePreset;
  iconTone?: TonePreset;
  interactive?: boolean;
  sizePreset?: IconSizePreset;
};

/**
 * ICON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Icon.
 */
const ICON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'iconFill',
  'iconTone',
  'interactive',
  'sizePreset',
]);

/**
 * DEFAULT_ICON_INTERACTIVE — задаёт отключённый канал состояний по умолчанию.
 * Используется, когда вызывающий код не передал проп `interactive`.
 */
const DEFAULT_ICON_INTERACTIVE = false;

/**
 * getIconStyles — возвращает CSS-правила для корня `StyledIcon`: габарит,
 * внутренний отступ и статичную поверхность по `iconTone` и `iconFill`.
 *
 * Как работает:
 * 1. Собирает квадрат окна и внутренний отступ по `sizePreset`
 * 2. Считает статичную поверхность через `resolveIconSurface`
 * 3. При `interactive` кладёт заливку через канал `--icon-state-background`
 *    с запасным значением на статику: переменную выставляет родитель в своих
 *    состояниях
 * 4. Без `interactive` красит только статичную заливку, когда она есть
 *
 * @param props пропсы стилизации Icon и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getIconStyles(props: IconStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    iconFill,
    iconTone = DEFAULT_TONE,
    interactive = DEFAULT_ICON_INTERACTIVE,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const size = getSpacingValue(getIconSize(sizePreset));
  const surface = resolveIconSurface(theme, iconTone, iconFill);

  const styles = [
    `inline-size: ${size};`,
    `block-size: ${size};`,
    `padding: ${getSpacingValue(getIconPadding(sizePreset))};`,
  ];

  if (interactive) {
    styles.push(
      `background-color: var(--icon-state-background, ${surface.backgroundColor ?? 'transparent'});`
    );
  } else if (surface.backgroundColor) {
    styles.push(`background-color: ${surface.backgroundColor};`);
  }

  if (surface.color) {
    styles.push(`color: ${surface.color};`);
  }

  return styles.join('\n');
}

/**
 * StyledIcon — задаёт корневой узел компонента Icon.
 * Базируется на `<span>` и поддерживает все пропсы из `IconStyleProps`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `place-items: center` — центрирует svg в окне
 *  - `flex-shrink: 0` — окно не сжимается во flex-рядах
 *
 * Генерация стилей:
 *  - `getIconStyles` — габарит, внутренний отступ и поверхность
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
  ${(props) => getIconStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
