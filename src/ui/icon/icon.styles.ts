/**
 * Файл: `src/ui/icon/icon.styles.ts`
 * Определяет внешний вид компонента Icon.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconStyleProps` и `IconPosition`
 * 2. Хранить локальный ряд отступов в `iconPadding`
 * 3. Предоставить функцию `resolveIconSurface`, дефолт `DEFAULT_ICON_POSITION`,
 *    а также перечни `ICON_POSITION_KEYS` и `ICON_SETTING_PROP_NAMES`
 * 4. Предоставить styled-узел `StyledIcon`
 *
 * Потребители:
 *  - `src/ui/icon/index.tsx` — собирает компонент Icon и реэкспортирует
 *    публичное API
 *  - контролы с секцией иконки, например Button и RangeInput — читают позицию,
 *    дефолт и резолвер поверхности через `@ui/icon`
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET, getMinBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { type AppTheme } from '@ui/theme';
import {
  DEFAULT_TONE,
  VARIANT_SURFACE_MIX_PERCENT,
  getToneColorKey,
  resolveColorMix,
  resolveVeilBackground,
  type TonePreset,
} from '@ui/tones';

/**
 * IconPosition — представляет позицию иконки относительно соседнего контента.
 */
export type IconPosition = 'end' | 'start';

/**
 * ICON_POSITION_KEYS — задаёт перечень позиций иконки.
 * Используется в панелях настроек витрины дизайн-системы: `IconGroup` собирает
 * из него опции для `Listbox` позиции.
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
 * IconSurface — представляет заливки и цвет глифа секции иконки.
 *
 * @property activeBackground — заливка секции в состоянии `active`
 * @property backgroundColor — заливка секции в покое
 * @property color — цвет глифа во всех состояниях
 * @property hoverBackground — заливка секции при наведении
 */
type IconSurface = {
  activeBackground: string;
  backgroundColor: string;
  color: string;
  hoverBackground: string;
};

/**
 * resolveIconSurface — возвращает заливки и цвет глифа секции иконки
 * по `iconTone` и `iconFill`. Подсветка `hover` меняет только заливку,
 * тон глифа от состояния не зависит. Для нейтральной секции в состоянии
 * `active` смешивает `primary` с `surface` через `VARIANT_SURFACE_MIX_PERCENT`.
 *
 * Как работает:
 * 1. Берёт цвет секции по `iconTone`
 * 2. Для нейтральной секции задаёт `surface` и вуаль, в `active` смешивает
 *    `primary` с `surface` через `VARIANT_SURFACE_MIX_PERCENT`
 * 3. Для цветной секции берёт цвет из темы и сдвигает наведение и `active` к `shade`
 * 4. Если `iconFill` задан, не `default` и отличен от `iconTone` — красит только глиф
 *
 * @param theme текущая тема
 * @param iconTone тон секции иконки
 * @param iconFill тон глифа иконки
 * @returns заливки и цвет глифа секции иконки
 */
export function resolveIconSurface(
  theme: AppTheme,
  iconTone: TonePreset = DEFAULT_TONE,
  iconFill?: TonePreset
): IconSurface {
  const colorKey = getToneColorKey(iconTone);

  let backgroundColor: string;
  let color: string;
  let hoverBackground: string;
  let activeBackground: string;

  if (!colorKey) {
    backgroundColor = theme.colors.surface;
    color = theme.colors.default;
    hoverBackground = resolveVeilBackground(theme, theme.colors.surface);
    activeBackground = resolveColorMix(
      theme.colors.primary,
      theme.colors.surface,
      VARIANT_SURFACE_MIX_PERCENT
    );
  } else {
    const iconToneColor = theme.colors[colorKey];

    backgroundColor = iconToneColor;
    color = theme.colors.inverse;
    hoverBackground = resolveColorMix(iconToneColor, theme.colors.shade);
    activeBackground = resolveColorMix(iconToneColor, theme.colors.shade);
  }

  // iconFill красит только глиф и применяется, если задан, не default и отличен от iconTone.
  const fillColorKey =
    iconFill && iconFill !== DEFAULT_TONE && iconFill !== iconTone
      ? getToneColorKey(iconFill)
      : undefined;

  if (fillColorKey) {
    return {
      activeBackground,
      backgroundColor,
      color: theme.colors[fillColorKey],
      hoverBackground,
    };
  }

  return {
    activeBackground,
    backgroundColor,
    color,
    hoverBackground,
  };
}

/**
 * iconPadding — хранит внутренний отступ окна иконки для каждого размера ряда.
 * Ключ — размер из `SizePreset`, значение — ключ шкалы отступов из `@ui/spacing`.
 * Вместе с квадратом из `getMinBlockSize` задаёт окно под svg: 24/32/32
 * для small/medium/large — значения подобраны зрительно.
 */
const iconPadding = {
  small: 4,
  medium: 4,
  large: 8,
} as const satisfies Record<SizePreset, SpacingValue>;

/**
 * getIconPadding — возвращает CSS-значение внутреннего отступа окна иконки.
 *
 * @param sizePreset размер из ряда контролов
 * @returns значение для CSS-свойства `padding`, например `0.25rem`
 */
function getIconPadding(sizePreset: SizePreset): string {
  return getSpacingValue(iconPadding[sizePreset]);
}

/**
 * IconStyleProps — представляет пропсы стилизации Icon и layout-пропсы.
 *
 * @property sizePreset — размер окна иконки
 */
export type IconStyleProps = LayoutProps & {
  sizePreset?: SizePreset;
};

/**
 * ICON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Icon.
 */
const ICON_PROP_NAMES = new Set<string>([...LAYOUT_PROP_NAMES, 'sizePreset']);

/**
 * getIconStyles — возвращает CSS-правила для корня `StyledIcon`: габарит
 * и внутренний отступ.
 *
 * @param props пропсы стилизации Icon
 * @returns CSS-правила, каждое с новой строки
 */
function getIconStyles(props: IconStyleProps): string {
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;
  const size = getMinBlockSize(sizePreset);

  const styles = [
    `inline-size: ${size};`,
    `block-size: ${size};`,
    `padding: ${getIconPadding(sizePreset)};`,
  ];

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
 *  - `max-block-size: 100%` на `& svg` — вертикальный зажим svg; reset зажимает
 *    только `max-inline-size`
 *
 * Генерация стилей:
 *  - `getIconStyles` — габарит и внутренний отступ
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Единственный узел проекта, создающий условия рендера svg: центрирующий бокс
 * и зажим svg по обеим осям.
 */
export const StyledIcon = styled.span.withConfig({
  shouldForwardProp: (prop) => !ICON_PROP_NAMES.has(prop),
})<IconStyleProps>`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  ${(props) => getIconStyles(props)}
  ${(props) => getLayoutStyles(props)}

  & svg {
    max-block-size: 100%;
  }
`;
