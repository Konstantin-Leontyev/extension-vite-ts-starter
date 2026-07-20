/**
 * Файл: `src/ui/button/button.styles.ts`
 * Определяет внешний вид компонента Button.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `ButtonStyleProps` и `ButtonIconPosition`
 * 2. Предоставить функцию `getButtonTextSize`
 * 3. Предоставить styled-узлы `StyledButton`, `StyledButtonText` и `StyledButtonIcon`
 *
 * Потребители:
 *  - `src/ui/button/index.tsx` — собирает компонент Button и реэкспортирует публичное API
 */

import styled from 'styled-components';

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
  DEFAULT_TONE,
  getToneColorKey,
  resolveColorMix,
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
 * resolveVeilBackground — возвращает значение шортката `background`: вуаль
 * `theme.colors.veil` слоем `linear-gradient` поверх собственной заливки узла.
 * Полупрозрачная вуаль не выражается одним `background-color` поверх непрозрачной
 * заливки, поэтому композиция собирается из слоя-градиента и цвета подложки.
 *
 * @param theme текущая тема
 * @param backgroundColor собственная заливка узла под вуалью
 * @returns значение для CSS-свойства `background`
 */
function resolveVeilBackground(theme: AppTheme, backgroundColor: string): string {
  return `linear-gradient(${theme.colors.veil}, ${theme.colors.veil}) ${backgroundColor}`;
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
 * Для нейтрального тона основа `surface`, наведение — вуаль поверх неё.
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
      activeBackground: resolveColorMix(theme.colors.border, theme.colors.surface, 40),
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
 * ButtonIconSurface — представляет заливки и цвета глифа секции иконки.
 *
 * @property activeBackground — заливка секции в состоянии `active`
 * @property backgroundColor — заливка секции в покое
 * @property color — цвет глифа
 * @property hoverBackground — заливка секции при наведении
 * @property hoverColor — цвет глифа при наведении
 */
type ButtonIconSurface = {
  activeBackground: string;
  backgroundColor: string;
  color: string;
  hoverBackground: string;
  hoverColor: string;
};

/**
 * resolveButtonIconSurface — возвращает заливки и цвета глифа секции иконки
 * по `iconTone` и `iconFill`. Для нейтральной иконки в состоянии `active`
 * подмешивает цвет варианта `tone`.
 *
 * @param theme текущая тема
 * @param tone семантический тон кнопки
 * @param iconTone тон секции иконки
 * @param iconFill тон глифа иконки
 * @returns заливки и цвета глифа секции иконки
 */
function resolveButtonIconSurface(
  theme: AppTheme,
  tone: TonePreset,
  iconTone: TonePreset,
  iconFill: TonePreset | undefined
): ButtonIconSurface {
  const colorKey = getToneColorKey(iconTone);

  let backgroundColor: string;
  let color: string;
  let hoverBackground: string;
  let activeBackground: string;

  if (!colorKey) {
    backgroundColor = theme.colors.surface;
    color = theme.colors.default;
    hoverBackground = resolveVeilBackground(theme, theme.colors.surface);

    const variantColorKey = getToneColorKey(tone);
    const variantColor = variantColorKey
      ? theme.colors[variantColorKey]
      : theme.colors.primary;

    activeBackground = resolveColorMix(variantColor, theme.colors.surface, 12);
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
    const fillColor = theme.colors[fillColorKey];

    return {
      activeBackground,
      backgroundColor,
      color: fillColor,
      hoverBackground,
      hoverColor: resolveColorMix(fillColor, theme.colors.shade),
    };
  }

  return {
    activeBackground,
    backgroundColor,
    color,
    hoverBackground,
    hoverColor: color,
  };
}

/**
 * StyledButtonText — задаёт узел лейбла компонента Button.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `display: flex` — оправданное исключение из grid по умолчанию: центрирует лейбл
 *    и даёт ему сжиматься вместе с многоточием, а grid с auto-треком тянет трек
 *    к `max-content` и ломает усечение
 *  - `flex: 1 1 auto` — лейбл занимает свободное место в ряду кнопки
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнере
 */
export const StyledButtonText = styled.span`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-inline-size: 0;
`;

/**
 * StyledButtonIcon — задаёт узел иконки компонента Button.
 * Базируется на `<span>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `place-items: center` — центрирует глиф в секции
 *  - `flex-shrink: 0` — секция иконки не сжимается при нехватке места
 *  - `align-self: stretch` — секция тянется на высоту кнопки
 */
export const StyledButtonIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  align-self: stretch;
`;

/**
 * ButtonIconPosition — представляет позицию иконки относительно лейбла.
 */
export type ButtonIconPosition = 'end' | 'start';

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
  iconPosition?: ButtonIconPosition;
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
  'active',
  'hasIcon',
  'iconFill',
  'iconPosition',
  'iconTone',
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
 * DEFAULT_BUTTON_ICON_POSITION — задаёт позицию иконки по умолчанию.
 * Используется, когда вызывающий код не передал проп `iconPosition`.
 */
const DEFAULT_BUTTON_ICON_POSITION: ButtonIconPosition = 'end';

/**
 * getButtonSplitStyles — возвращает CSS-правила для секций лейбла и иконки корня
 * `StyledButton`: заливка, шов, радиусы и состояния по `iconPosition`.
 *
 * @param props пропсы стилизации корня и текущая тема
 * @returns CSS-правила, каждое с новой строки
 */
function getButtonSplitStyles(props: ButtonStyledProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    active = DEFAULT_BUTTON_ACTIVE,
    iconFill,
    iconPosition = DEFAULT_BUTTON_ICON_POSITION,
    iconTone = DEFAULT_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const size = getMinBlockSize(sizePreset);
  const borderRadius = resolveBlockRadius(shape, size);
  const surface = resolveButtonSurface(theme, tone);
  const iconSurface = resolveButtonIconSurface(theme, tone, iconTone, iconFill);
  const isIconStart = iconPosition === 'start';

  // Шов виден только когда и кнопка, и иконка нейтральны — иначе контраст цвета достаточен.
  const showSeam = tone === DEFAULT_TONE && iconTone === DEFAULT_TONE;

  const styles = [
    `${StyledButtonText} {`,
    `padding-inline: ${getPaddingInline(sizePreset)};`,
    `background-color: ${surface.backgroundColor};`,
    isIconStart
      ? `border-start-end-radius: ${borderRadius};\nborder-end-end-radius: ${borderRadius};`
      : `border-start-start-radius: ${borderRadius};\nborder-end-start-radius: ${borderRadius};`,
    `}`,
    `${StyledButtonIcon} {`,
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
    `&:not(:disabled):hover ${StyledButtonText} {`,
    `background: ${surface.hoverBackground};`,
    `}`,
    `&:not(:disabled):hover ${StyledButtonIcon} {`,
    `color: ${iconSurface.hoverColor};`,
    `background: ${iconSurface.hoverBackground};`,
    `}`
  );

  if (active) {
    styles.push(
      `&:not(:disabled) ${StyledButtonText} {`,
      `background: ${surface.activeBackground};`,
      `}`,
      `&:not(:disabled) ${StyledButtonIcon} {`,
      `background: ${iconSurface.activeBackground};`,
      `}`
    );
  }

  return styles.join('\n');
}

/**
 * getButtonStyles — возвращает CSS-правила для корня `StyledButton`: размер, рамка,
 * радиус, тень, цвет текста и заливка в solid- или split-раскладке.
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
  ];

  // Split с иконкой и лейблом — заливка на секциях. Solid — заливка и `hover` на корне.
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
 *  - `align-items: stretch` — секции иконки тянутся на высоту кнопки
 *  - `inline-size: 100%` — кнопка занимает ширину контейнера
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнере
 *
 * Генерация стилей:
 *  - `getButtonStyles` — размер, рамка, радиус, тень, цвет, заливка solid или split
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !BUTTON_PROP_NAMES.has(prop),
})<ButtonStyledProps>`
  display: flex;
  align-items: stretch;
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
