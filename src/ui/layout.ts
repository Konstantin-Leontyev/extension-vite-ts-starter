import {
  POSITIONING_PROP_NAMES,
  getPositioningStyles,
  type PositioningProps,
} from '@ui/positioning';
import { SIZING_PROP_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';
import { SPACING_PROP_NAMES, getSpacingStyles, type SpacingProps } from '@ui/spacing';

export {
  POSITIONING_PROP_NAMES,
  getPositioningStyles,
  type InsetValue,
  type LayoutDisplay,
  type LayoutPosition,
  type PositioningProps,
} from '@ui/positioning';

export { SIZING_PROP_NAMES, getSizingStyles, type SizingProps } from '@ui/sizing';

export {
  SPACING_PROP_NAMES,
  SPACING_REM,
  getSpacingStyles,
  spacingRem,
  type SpacingProps,
  type SpacingPx,
} from '@ui/spacing';

export type LayoutProps = SpacingProps & PositioningProps & SizingProps;

export const LAYOUT_PROP_NAMES = new Set<string>([
  ...SPACING_PROP_NAMES,
  ...POSITIONING_PROP_NAMES,
  ...SIZING_PROP_NAMES,
]);

export function getLayoutStyles(props: LayoutProps): string {
  return [getSpacingStyles(props), getPositioningStyles(props), getSizingStyles(props)]
    .filter(Boolean)
    .join('\n');
}

/**
 * Делит смешанные пропы примитива на две группы по LAYOUT_PROP_NAMES:
 * layout — на корень-обёртку, rest — на вложенный DOM-узел (input и т.п.).
 */
export function splitLayoutProps<T extends Partial<LayoutProps>>(
  props: T
): { layout: LayoutProps; rest: Omit<T, keyof LayoutProps> } {
  const layout: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (LAYOUT_PROP_NAMES.has(key)) {
      layout[key] = value;
    } else {
      rest[key] = value;
    }
  }

  return {
    layout: layout as LayoutProps,
    rest: rest as Omit<T, keyof LayoutProps>,
  };
}
