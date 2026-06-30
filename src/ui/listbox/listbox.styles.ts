import styled, { css } from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  blockSizeRem,
  controlIconSize,
  controlPaddingInline,
  radiusPreset,
  type ShapePreset,
  type SizePreset,
} from '@ui/presets';
import { spacingRem } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Оси вида listbox: общие для корня, панели и строк. */
export type ListboxAxisProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/** Публичные пропы: layout — на корень, оси вида — на триггер и панель. */
export type ListboxStyleProps = LayoutProps & ListboxAxisProps;

const LISTBOX_AXIS_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

const shouldForwardAxis = (prop: string): boolean => !LISTBOX_AXIS_PROP_NAMES.has(prop);

/** Радиус контрола из текущих осей вида. */
function listboxRadius(props: ListboxAxisProps): string {
  return radiusPreset(
    props.shape ?? DEFAULT_SHAPE_PRESET,
    props.sizePreset ?? DEFAULT_SIZE_PRESET
  );
}

/** Габарит обёртки шеврона; svg внутри заполняет её. */
export const StyledListboxChevron = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ListboxAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  block-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
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
  align-items: center;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  text-align: start;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => listboxRadius(props)};
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
  gap: ${spacingRem(8)};
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
  inline-size: ${spacingRem(20)};
  block-size: ${spacingRem(20)};
  margin-inline-end: ${spacingRem(12)};
  color: ${(props) => getTheme(props).colors.primary};
`;

/** База строки: раскладка + inset-pill подсветки (::before под контентом). */
const optionRowBase = css<ListboxAxisProps>`
  position: relative;
  z-index: 0;
  display: flex;
  gap: ${spacingRem(12)};
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
    inset: ${spacingRem(4)};
    z-index: -1;
    pointer-events: none;
    content: '';
    background-color: transparent;
    border-radius: calc(${(props) => listboxRadius(props)} - ${spacingRem(4)});
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
    spacingRem(controlPaddingInline[props.sizePreset ?? DEFAULT_SIZE_PRESET])};

  /* Текст-слот заполняет строку (забирает остаток места) — идёт сразу за чекбоксом. */
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
    `border-radius: ${listboxRadius(props)};`,
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
