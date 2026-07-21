/**
 * Файл: `src/ui/button/button.styles.ts`
 * Определяет внешний вид компонента Button.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ButtonStyleProps`
 * 2. Предоставить функцию `getButtonTextSize`
 * 3. Предоставить styled-узел `StyledButton`
 *
 * Потребители:
 *  - `src/ui/button/index.tsx` — собирает компонент Button и реэкспортирует публичное API
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
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import {
  BORDER_SURFACE_MIX_PERCENT,
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
  resolveVeilBackground,
  type TonePreset,
} from '@ui/tones';

/**
 * getButtonTextSize — возвращает размер лейбла по `sizePreset`.
 * Подставляет `DEFAULT_SIZE_PRESET`, когда размер не задан.
 *
 * @param sizePreset размер кнопки
 * @returns метка размера текста из `TextSizePreset` для лейбла кнопки
 */
export function getButtonTextSize(sizePreset?: SizePreset): TextSizePreset {
  return getTextSize(sizePreset ?? DEFAULT_SIZE_PRESET);
}

/**
 * ButtonSurface — представляет заливки и цвет текста кнопки.
 *
 * @property activeBackground — заливка в состоянии `active`
 * @property backgroundColor — заливка в покое
 * @property color — цвет текста
 * @property hoverBackground — заливка при наведении
 */
type ButtonSurface = {
  activeBackground: string;
  backgroundColor: string;
  color: string;
  hoverBackground: string;
};

/**
 * resolveButtonSurface — возвращает заливки и цвет текста кнопки по `tone`.
 * Для нейтрального тона основа `surface`, наведение — вуаль поверх неё,
 * `active` — смесь `border` с `surface` через `BORDER_SURFACE_MIX_PERCENT`.
 * Для цветного — цвет из темы со сдвигом состояний к `shade`.
 *
 * @param theme текущая тема
 * @param tone семантический тон кнопки
 * @returns заливки и цвет текста для корня и секции лейбла
 */
function resolveButtonSurface(theme: AppTheme, tone: TonePreset): ButtonSurface {
  const colorKey = getToneColorKey(tone);

  if (!colorKey) {
    return {
      activeBackground: resolveColorMix(
        theme.colors.border,
        theme.colors.surface,
        BORDER_SURFACE_MIX_PERCENT
      ),
      backgroundColor: theme.colors.surface,
      color: theme.colors.default,
      hoverBackground: resolveVeilBackground(theme, theme.colors.surface),
    };
  }

  const color = theme.colors[colorKey];

  return {
    activeBackground: resolveColorMix(color, theme.colors.shade),
    backgroundColor: color,
    color: theme.colors.inverse,
    hoverBackground: resolveColorMix(color, theme.colors.shade),
  };
}

/**
 * ButtonStyleProps — представляет пропсы стилизации Button и layout-пропсы.
 *
 * @property active — включает зафиксированное нажатое состояние
 * @property iconFill — тон глифа иконки
 * @property iconPosition — позиция иконки относительно лейбла
 * @property iconTone — тон секции иконки
 * @property shape — форма кнопки
 * @property sizePreset — размер компонента
 * @property tone — семантический тон
 */
export type ButtonStyleProps = LayoutProps & {
  active?: boolean;
  iconFill?: TonePreset;
  iconPosition?: IconPosition;
  iconTone?: TonePreset;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  tone?: TonePreset;
};

/**
 * ButtonStyledProps — представляет пропсы стилизации корня `StyledButton`.
 *
 * @property hasIcon — включает split-раскладку с секцией иконки. Выключенный —
 *   корень рисуется solid-заливкой
 */
type ButtonStyledProps = ButtonStyleProps & { hasIcon: boolean };

/**
 * BUTTON_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Button.
 */
const BUTTON_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...ICON_SETTING_PROP_NAMES,
  'active',
  'hasIcon',
  'shape',
  'sizePreset',
  'tone',
]);

/**
 * DEFAULT_BUTTON_ACTIVE — задаёт зафиксированное нажатое состояние по умолчанию.
 * Используется, когда вызывающий код не передал проп `active`.
 */
const DEFAULT_BUTTON_ACTIVE = false;

/**
 * getButtonSplitStyles — возвращает CSS-правила поверхности секций лейбла и иконки
 * корня `StyledButton` по `[data-slot]`: заливка, шов, радиусы и состояния по `iconPosition`.
 * Раскладку слота лейбла задаёт `getButtonStyles`.
 *
 * Как работает:
 * 1. Берёт тему, подставляет дефолты пропсов и считает поверхность лейбла и иконки
 * 2. Собирает правила секций `label` и `icon`: отступы, заливка и радиусы
 * 3. Добавляет шов, только когда тон кнопки и тон секции нейтральны — иначе
 *    контраста цвета секций достаточно
 * 4. Добавляет наведение и при `active` — зафиксированную заливку секций
 *
 * @param props пропсы стилизации корня и текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
function getButtonSplitStyles(props: ButtonStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_BUTTON_ACTIVE,
    iconFill,
    iconPosition = DEFAULT_ICON_POSITION,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const size = getMinBlockSize(sizePreset);
  const borderRadius = resolveBlockRadius(shape, size);
  const surface = resolveButtonSurface(theme, tone);
  const iconSurface = resolveIconSurface(theme, iconTone, iconFill);
  const isIconStart = iconPosition === 'start';

  const showSeam = tone === DEFAULT_TONE && iconTone === DEFAULT_TONE;

  const styles = [
    `[data-slot='label'] {`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    `background-color: ${surface.backgroundColor};`,
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
    `&:not(:disabled):hover [data-slot='label'] {`,
    `background: ${surface.hoverBackground};`,
    `}`,
    `&:not(:disabled):hover [data-slot='icon'] {`,
    `background: ${iconSurface.hoverBackground};`,
    `}`
  );

  if (active) {
    styles.push(
      `&:not(:disabled) [data-slot='label'] {`,
      `background: ${surface.activeBackground};`,
      `}`,
      `&:not(:disabled) [data-slot='icon'] {`,
      `background: ${iconSurface.activeBackground};`,
      `}`
    );
  }

  return styles.join('\n');
}

/**
 * getButtonStyles — возвращает CSS-правила для корня `StyledButton`: размер, рамка,
 * радиус, тень, цвет текста, раскладку слота лейбла и заливку в solid- или split-раскладке.
 *
 * Как работает:
 * 1. Собирает общие правила корня: размер, рамка, радиус, тень и цвет
 * 2. Задаёт раскладку слота лейбла на корне: Text остаётся контентом без
 *    layout-пропсов
 * 3. При `hasIcon` делегирует поверхность секций в `getButtonSplitStyles` —
 *    заливка на секциях
 * 4. Без иконки красит solid-заливку и наведение на корне
 *
 * @param props пропсы стилизации корня и текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
function getButtonStyles(props: ButtonStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_BUTTON_ACTIVE,
    hasIcon,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveButtonSurface(theme, tone);
  const minBlockSize = getMinBlockSize(sizePreset);

  const styles = [
    `min-block-size: ${minBlockSize};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${resolveBlockRadius(shape, minBlockSize)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `color: ${surface.color};`,
    `[data-slot='label'] {`,
    `flex: 1 1 auto;`,
    `align-content: center;`,
    `min-inline-size: 0;`,
    `}`,
  ];

  if (hasIcon) {
    styles.push(getButtonSplitStyles(props));

    return styles.join('\n');
  }

  styles.push(`padding-inline: ${getPaddingInline(sizePreset)};`);
  styles.push(`background-color: ${surface.backgroundColor};`);
  styles.push(`&:not(:disabled):hover { background: ${surface.hoverBackground}; }`);

  if (active) {
    styles.push(`&:not(:disabled) { background: ${surface.activeBackground}; }`);
  }

  return styles.join('\n');
}

/**
 * StyledButton — задаёт корневой узел компонента Button.
 * Базируется на `<button>` и поддерживает все пропсы из `ButtonStyledProps`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: ряд
 *    иконка-лейбл без динамических шаблонов колонок под наличие и позицию иконки
 *  - `inline-size: 100%` — кнопка занимает ширину контейнера
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнере
 *
 * Генерация стилей:
 *  - `getButtonStyles` — размер, рамка, радиус, тень, цвет, заливка solid или split
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 *
 * Слоты: раскладку лейбла и поверхность секций задаёт корень по `[data-slot]`.
 */
export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !BUTTON_PROP_NAMES.has(prop),
})<ButtonStyledProps>`
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
