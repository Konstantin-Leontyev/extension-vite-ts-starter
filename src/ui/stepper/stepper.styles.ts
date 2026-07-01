import { type CSSProperties } from 'react';
import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlPaddingInline,
  controlValueTextStyles,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem, type SpacingPx } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Оси вида счётчика: layout — на корень, размер/форма/выравнивание — наполнение поля. */
export type StepperStyleProps = LayoutProps & {
  align?: CSSProperties['textAlign'];
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

const STEPPER_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'align',
  'shape',
  'sizePreset',
]);

/**
 * Габарит шеврона в половине колонки стрелок — меньше controlIconSize, иначе две
 * половинки по 16px в строке 32px раздувают высоту выше канона controlBlockSize.
 */
const stepperSpinIconSize = {
  small: 12,
  medium: 16,
  large: 20,
} as const satisfies Record<SizePreset, SpacingPx>;

/** Ячейка значения: поток инпут + опц. суффикс единицы. */
export const StyledStepperValue = styled.div`
  display: flex;
  min-inline-size: 0;
  align-items: center;
  gap: ${spacingRem(4)};
`;

/** Инпут значения: прозрачный, без рамки (рамку и кольцо фокуса несёт корень-поле). */
export const StyledStepperInput = styled.input`
  flex: 1 1 auto;
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0;
  color: inherit;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }
`;

/** Область стрелок: квадрат в высоту поля, делится пополам на ↑/↓. */
export const StyledStepperSpin = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  border-inline-start: 1px solid ${(props) => getTheme(props).colors.border};
`;

/** Половина области стрелок: шеврон по центру, делитель между верхней и нижней. */
export const StyledStepperButton = styled.button`
  display: grid;
  min-block-size: 0;
  color: ${(props) => getTheme(props).colors.muted};
  place-items: center;

  &:first-of-type {
    border-block-end: 1px solid ${(props) => getTheme(props).colors.border};
  }

  &:not(:disabled):hover,
  &:focus-visible {
    color: ${(props) => getTheme(props).colors.default};
    background-color: ${(props) => {
      const theme = getTheme(props);

      return `color-mix(in srgb, ${theme.colors.border} 35%, ${theme.colors.surface})`;
    }};
  }

  &:focus-visible {
    outline: none;
  }
`;

/** Габариты, рамка и типографика поля по оси sizePreset/shape (единый источник размеров). */
export function getStepperStyles(
  props: StepperStyleProps & { theme: AppTheme }
): string {
  const theme = getTheme(props);
  const {
    align,
    shape = DEFAULT_SHAPE_PRESET,
    sizePreset = DEFAULT_SIZE_PRESET,
  } = props;
  const square = blockSizeRem(sizePreset);
  const glyph = spacingRem(stepperSpinIconSize[sizePreset]);

  return [
    `block-size: ${square};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${radiusPreset(shape, sizePreset)};`,
    `background-color: ${theme.colors.surface};`,
    `box-shadow: ${theme.shadow.surface};`,
    `${StyledStepperValue} { padding-inline: ${spacingRem(controlPaddingInline[sizePreset])}; }`,
    `${StyledStepperInput} {`,
    controlValueTextStyles(sizePreset),
    align ? `text-align: ${align};` : '',
    `}`,
    `${StyledStepperSpin} { inline-size: ${square}; block-size: 100%; }`,
    `${StyledStepperButton} svg { inline-size: ${glyph}; block-size: ${glyph}; }`,
  ].join('\n');
}

/** Корень-поле: рамка, скругление по shape, кольцо фокуса на :focus-within. */
export const StyledStepperRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !STEPPER_PROP_NAMES.has(prop),
})<StepperStyleProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: stretch;
  inline-size: 100%;
  min-inline-size: 0;
  overflow: hidden;

  &:focus-within {
    outline: 2px solid ${(props) => getTheme(props).colors.focusRing};
    outline-offset: 2px;
  }

  ${(props) => getStepperStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;
