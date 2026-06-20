import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  controlBlockSize,
  controlIconSize,
  controlPaddingInline,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme, type ThemeColors } from '@ui/theme';

export type ButtonIconPosition = 'end' | 'start';

/**
 * Источник истины оси tone: тон → ключ цвета заливки в теме.
 * `default` без заливки — нейтральный (фон surface, текст default).
 * Тип ButtonTone выводится отсюда; `satisfies` держит значения ключами темы.
 */
const BUTTON_TONE_BACKGROUND = {
  default: undefined,
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
} as const satisfies Record<string, keyof ThemeColors | undefined>;

export type ButtonTone = keyof typeof BUTTON_TONE_BACKGROUND;

/** Цветные тона (с заливкой) — производная карты, единый источник для опций. */
export const BUTTON_COLORED_TONES = (
  Object.keys(BUTTON_TONE_BACKGROUND) as ButtonTone[]
).filter((tone) => BUTTON_TONE_BACKGROUND[tone] !== undefined);

const DEFAULT_TONE: ButtonTone = 'default';
const DEFAULT_ICON_POSITION: ButtonIconPosition = 'end';
const DEFAULT_ICON_TONE: ButtonTone = 'default';

export type ButtonStyleProps = LayoutProps & {
  active?: boolean;
  iconFill?: ButtonTone;
  iconPosition?: ButtonIconPosition;
  iconTone?: ButtonTone;
  shape?: ShapePreset;
  sizePreset?: SizePreset;
  tone?: ButtonTone;
};

/** hasIcon — внутренняя ось от index: split-раскладка vs solid. */
type ButtonRootStyleProps = ButtonStyleProps & { hasIcon?: boolean };

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
 * Тон текста (textColor) → цвет темы. Без override (наследует fg), когда тон
 * `default` или совпадает с `tone` кнопки — иначе текст слился бы с заливкой.
 */
export function buttonTextColor(
  theme: AppTheme,
  textColor: ButtonTone | undefined,
  tone: ButtonTone | undefined
): string | undefined {
  if (!textColor || textColor === 'default' || textColor === tone) {
    return undefined;
  }

  const key = BUTTON_TONE_BACKGROUND[textColor];

  return key ? theme.colors[key] : undefined;
}

/** Затемнение цвета: keepPct% исходного + остаток чёрный (hover/active цветных тонов). */
function darken(color: string, keepPct: number): string {
  return `color-mix(in srgb, ${color} ${keepPct}%, #000)`;
}

/** Подмешивание цвета поверх surface (нейтральные hover/active, мягкая подложка иконки). */
function mixOverSurface(theme: AppTheme, color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, ${theme.colors.surface})`;
}

type ToneSurface = { active: string; fg: string; fill: string; hover: string };

/** Заливка/текст/hover/active для тона — нейтральный из surface, цветной из темы. */
function resolveTone(theme: AppTheme, tone: ButtonTone): ToneSurface {
  const background = BUTTON_TONE_BACKGROUND[tone];

  // Нейтральный тон: фон surface, текст default, hover/active подмешивают border.
  if (!background) {
    return {
      fg: theme.colors.default,
      fill: theme.colors.surface,
      hover: mixOverSurface(theme, theme.colors.border, 28),
      active: mixOverSurface(theme, theme.colors.border, 40),
    };
  }

  // Цветной тон: заливка из темы, текст inverse, hover/active затемняют заливку.
  const color = theme.colors[background];

  return {
    fg: theme.colors.inverse,
    fill: color,
    hover: darken(color, 88),
    active: darken(color, 80),
  };
}

type IconSurface = {
  bg: string;
  bgActive: string;
  bgHover: string;
  fg: string;
  fgHover: string;
};

/**
 * Секция иконки: фон по iconTone, цвет глифа по iconFill (override),
 * active для нейтральной иконки — мягкая подложка под цвет варианта (tone).
 */
function resolveIcon(
  theme: AppTheme,
  tone: ButtonTone,
  iconTone: ButtonTone,
  iconFill: ButtonTone | undefined
): IconSurface {
  const background = BUTTON_TONE_BACKGROUND[iconTone];

  let bg: string;
  let fg: string;
  let bgHover: string;
  let bgActive: string;

  if (!background) {
    bg = theme.colors.surface;
    fg = theme.colors.default;
    bgHover = mixOverSurface(theme, theme.colors.border, 28);

    const variantKey = BUTTON_TONE_BACKGROUND[tone];
    const variantColor = variantKey ? theme.colors[variantKey] : theme.colors.primary;

    bgActive = mixOverSurface(theme, variantColor, 12);
  } else {
    const color = theme.colors[background];

    bg = color;
    fg = theme.colors.inverse;
    bgHover = darken(color, 88);
    bgActive = darken(color, 80);
  }

  // iconFill красит только глиф и применяется, если задан, не default и отличен от iconTone.
  const fillKey =
    iconFill && iconFill !== 'default' && iconFill !== iconTone
      ? BUTTON_TONE_BACKGROUND[iconFill]
      : undefined;

  if (fillKey) {
    fg = theme.colors[fillKey];

    return {
      bg,
      bgActive,
      bgHover,
      fg,
      fgHover: darken(theme.colors[fillKey], 88),
    };
  }

  return { bg, bgActive, bgHover, fg, fgHover: fg };
}

export const StyledButtonText = styled.span`
  /* flex (не grid): центрированный лейбл, сжимаемый с ellipsis; grid с auto-треком
     тянет трек к max-content и ломает усечение. */
  display: flex;
  flex: 1 1 auto;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
`;

export const StyledButtonIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  align-self: stretch;
`;

/** Split-раскладка: заливка лейбла/иконки, шов, радиусы и состояния по позиции. */
function getButtonSplitStyles(
  props: ButtonRootStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    active = false,
    iconFill,
    iconPosition = DEFAULT_ICON_POSITION,
    iconTone = DEFAULT_ICON_TONE,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const radius = radiusPreset(shape, sizePreset);
  const surface = resolveTone(theme, tone);
  const icon = resolveIcon(theme, tone, iconTone, iconFill);

  const isStart = iconPosition === 'start';
  const labelRadius = isStart
    ? `border-start-end-radius: ${radius};\nborder-end-end-radius: ${radius};`
    : `border-start-start-radius: ${radius};\nborder-end-start-radius: ${radius};`;
  const iconRadius = isStart
    ? `border-start-start-radius: ${radius};\nborder-end-start-radius: ${radius};`
    : `border-start-end-radius: ${radius};\nborder-end-end-radius: ${radius};`;

  // Шов виден только когда и кнопка, и иконка нейтральны — иначе контраст цвета достаточен.
  const seam =
    tone === 'default' && iconTone === 'default' ? theme.colors.border : 'transparent';
  const seamShadow = isStart
    ? `box-shadow: inset -1px 0 0 ${seam};`
    : `box-shadow: inset 1px 0 0 ${seam};`;

  const glyph = spacingRem(controlIconSize[sizePreset]);
  const square = spacingRem(controlBlockSize[sizePreset]);

  return [
    `${StyledButtonText} {`,
    `padding-inline: ${spacingRem(controlPaddingInline[sizePreset])};`,
    `background-color: ${surface.fill};`,
    labelRadius,
    `}`,
    `${StyledButtonIcon} {`,
    `inline-size: ${square};`,
    `min-inline-size: ${square};`,
    `color: ${icon.fg};`,
    `background-color: ${icon.bg};`,
    iconRadius,
    seamShadow,
    `& svg {`,
    `inline-size: ${glyph};`,
    `block-size: ${glyph};`,
    `}`,
    `}`,
    `&:not(:disabled):hover ${StyledButtonText} {`,
    `background-color: ${surface.hover};`,
    `}`,
    `&:not(:disabled):hover ${StyledButtonIcon} {`,
    `color: ${icon.fgHover};`,
    `background-color: ${icon.bgHover};`,
    `}`,
    active
      ? [
          `&:not(:disabled) ${StyledButtonText} {`,
          `background-color: ${surface.active};`,
          `}`,
          `&:not(:disabled) ${StyledButtonIcon} {`,
          `background-color: ${icon.bgActive};`,
          `}`,
        ].join('\n')
      : '',
  ].join('\n');
}

export function getButtonStyles(
  props: ButtonRootStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    hasIcon = false,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
    tone = DEFAULT_TONE,
  } = props;
  const surface = resolveTone(theme, tone);

  const base = [
    `min-block-size: ${spacingRem(controlBlockSize[sizePreset])};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${radiusPreset(shape, sizePreset)};`,
    `box-shadow: ${theme.shadow.surface};`,
    `color: ${surface.fg};`,
  ];

  // Split (иконка + лейбл) — заливка на секциях; solid — заливка и hover на корне.
  if (hasIcon) {
    base.push(getButtonSplitStyles(props));

    return base.join('\n');
  }

  base.push(`padding-inline: ${spacingRem(controlPaddingInline[sizePreset])};`);
  base.push(`background-color: ${surface.fill};`);
  base.push(`&:not(:disabled):hover { background-color: ${surface.hover}; }`);

  return base.join('\n');
}

export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !BUTTON_PROP_NAMES.has(prop),
})<ButtonRootStyleProps>`
  /* flex (не grid): ряд [иконка?][лейбл][иконка?], лейбл растёт, иконки тянутся на
     высоту (align-items: stretch), позиция иконки задаётся порядком в JSX; grid
     потребовал бы динамических шаблонов под наличие/позицию иконки. */
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: stretch;
  ${(props) => getButtonStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
