import styled, { css } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { SPACING_REM, spacingRem, type SpacingPx } from '@ui/spacing';
import { type TextSizePreset } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

export type ListboxShape = 'default' | 'round';

/**
 * Пресеты размера: габарит строки, отступ значения, габарит шеврона и размер текста.
 * chevronSize — интринсик пресета (не публичный проп): меняется размер — меняется шеврон.
 */
export const listboxSizePresets = {
  small: {
    blockSize: 32,
    chevronSize: 12,
    textSizePreset: 'thin',
    valuePaddingInline: 8,
  },
  medium: {
    blockSize: 40,
    chevronSize: 20,
    textSizePreset: 'normal',
    valuePaddingInline: 12,
  },
  large: {
    blockSize: 48,
    chevronSize: 20,
    textSizePreset: 'normal',
    valuePaddingInline: 12,
  },
} as const satisfies Record<
  string,
  {
    blockSize: SpacingPx;
    chevronSize: SpacingPx;
    textSizePreset: TextSizePreset;
    valuePaddingInline: SpacingPx;
  }
>;

export type ListboxSizePreset = keyof typeof listboxSizePresets;

const DEFAULT_SIZE_PRESET: ListboxSizePreset = 'large';
const DEFAULT_SHAPE: ListboxShape = 'default';

/** Оси вида listbox: общие для корня, панели и строк. */
export type ListboxAxisProps = {
  shape?: ListboxShape;
  sizePreset?: ListboxSizePreset;
};

/** Публичные пропы: layout — на корень, оси вида — на триггер и панель. */
export type ListboxStyleProps = LayoutProps & ListboxAxisProps;

const LISTBOX_AXIS_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

/** Размер текста значения/опции для оси sizePreset — дефолт живёт здесь. */
export function listboxTextSizePreset(
  sizePreset: ListboxSizePreset = DEFAULT_SIZE_PRESET
): TextSizePreset {
  return listboxSizePresets[sizePreset].textSizePreset;
}

/** Горизонтальный отступ значения/опции для оси sizePreset. */
export function listboxValuePaddingInline(
  sizePreset: ListboxSizePreset = DEFAULT_SIZE_PRESET
): SpacingPx {
  return listboxSizePresets[sizePreset].valuePaddingInline;
}

function blockSizeRem(sizePreset: ListboxSizePreset): string {
  return spacingRem(listboxSizePresets[sizePreset].blockSize);
}

/** Радиус контрола по оси shape: round = половина высоты строки. */
function controlRadius(props: ListboxAxisProps): string {
  const { shape = DEFAULT_SHAPE, sizePreset = DEFAULT_SIZE_PRESET } = props;

  return shape === 'round' ? `calc(${blockSizeRem(sizePreset)} / 2)` : SPACING_REM[8];
}

const shouldForwardAxis = (prop: string): boolean => !LISTBOX_AXIS_PROP_NAMES.has(prop);

/** Габарит обёртки шеврона; svg внутри заполняет её. */
export const StyledListboxChevron = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(listboxSizePresets[props.sizePreset ?? DEFAULT_SIZE_PRESET].chevronSize)};
  block-size: ${(props) =>
    spacingRem(listboxSizePresets[props.sizePreset ?? DEFAULT_SIZE_PRESET].chevronSize)};
`;

export const StyledListboxIcon = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  display: grid;
  place-items: center;
  inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  min-inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  color: ${(props) => getTheme(props).colors.muted};
  border-inline-start: 1px solid ${(props) => getTheme(props).colors.border};
`;

export const StyledListboxTrigger = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  text-align: start;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => controlRadius(props)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  /* Панель перекрывает триггер; прячем его, сохраняя место под строку. */
  &[data-open='true'] {
    visibility: hidden;
  }
`;

export const StyledListboxRoot = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<LayoutProps>`
  position: relative;
  display: grid;
  gap: ${SPACING_REM[8]};
  inline-size: 100%;
  min-inline-size: 0;
  ${(props) => getLayoutStyles(props)}

  &[data-open='true'] {
    z-index: 50;
  }
`;

/** Чек выбранной опции (single-режим). */
export const StyledListboxCheck = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  inline-size: ${SPACING_REM[20]};
  block-size: ${SPACING_REM[20]};
  margin-inline-end: ${SPACING_REM[12]};
  color: ${(props) => getTheme(props).colors.primary};
`;

/** База строки: раскладка + inset-pill подсветки (::before под контентом). */
const optionRowBase = css<ListboxAxisProps>`
  position: relative;
  z-index: 0;
  display: flex;
  gap: ${SPACING_REM[12]};
  align-items: center;
  justify-content: space-between;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  padding: 0;
  text-align: start;
  cursor: pointer;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: none;

  &::before {
    position: absolute;
    inset: ${SPACING_REM[4]};
    z-index: -1;
    pointer-events: none;
    content: '';
    background-color: transparent;
    border-radius: calc(${(props) => controlRadius(props)} - ${SPACING_REM[4]});
    transition: background-color 0.12s ease;
  }
`;

export const StyledListboxOptionButton = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  ${optionRowBase}

  &:focus {
    outline: none;
  }

  &:hover:not(:disabled)::before,
  &:focus-visible::before {
    background-color: ${(props) => getTheme(props).colors.primary};
  }

  &:hover:not(:disabled),
  &:focus-visible {
    color: ${(props) => getTheme(props).colors.inverse};
  }

  &:hover:not(:disabled) ${StyledListboxCheck}, &:focus-visible ${StyledListboxCheck} {
    color: ${(props) => getTheme(props).colors.inverse};
  }
`;

export const StyledListboxOptionRow = styled.label.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  ${optionRowBase}
  padding-inline-start: ${(props) =>
    spacingRem(
      listboxSizePresets[props.sizePreset ?? DEFAULT_SIZE_PRESET].valuePaddingInline
    )};

  /* Текст-слот заполняет строку (распределение места, как было у label flex:1) — идёт сразу за чекбоксом. */
  & > :last-child {
    flex: 1 1 auto;
  }

  &:has(input:disabled) {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:not(:has(input:disabled)):hover::before,
  &:focus-within::before {
    background-color: ${(props) => getTheme(props).colors.primary};
  }

  &:not(:has(input:disabled)):hover,
  &:focus-within {
    color: ${(props) => getTheme(props).colors.inverse};
  }
`;

function getPanelStyles(props: ListboxAxisProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { sizePreset = DEFAULT_SIZE_PRESET } = props;
  const rowRem = blockSizeRem(sizePreset);

  return [
    'position: fixed;',
    'inset-block-start: 0;',
    'inset-inline-start: 0;',
    'z-index: 2000;',
    `max-block-size: calc(${rowRem} * 6);`,
    'overflow: hidden auto;',
    `background-color: ${theme.colors.surface};`,
    `border: 1px solid ${theme.colors.border};`,
    `border-radius: ${controlRadius(props)};`,
    `box-shadow: ${theme.shadow.surface};`,
    /* Панель рендерится только в open-состоянии — фокус-кольцо всегда видно. */
    `outline: 2px solid ${theme.colors.focusRing};`,
    'outline-offset: 2px;',
  ].join('\n');
}

export const StyledListboxPanel = styled.ul.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  ${(props) => getPanelStyles(props)}
`;
