import styled from 'styled-components';

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
import { getTheme } from '@ui/theme';

export { splitLayoutProps } from '@ui/layout';

/** Оси вида combobox: общие для корня, триггера и панели. */
export type ComboboxAxisProps = {
  shape?: ShapePreset;
  sizePreset?: SizePreset;
};

/** Публичные пропы: layout — на корень, оси вида — на триггер и панель. */
export type ComboboxStyleProps = LayoutProps & ComboboxAxisProps;

const COMBOBOX_AXIS_PROP_NAMES = new Set<string>(['shape', 'sizePreset']);

const shouldForwardAxis = (prop: string): boolean => !COMBOBOX_AXIS_PROP_NAMES.has(prop);

/** Радиус контрола из текущих осей вида. */
function comboboxRadius(props: ComboboxAxisProps): string {
  return radiusPreset(
    props.shape ?? DEFAULT_SHAPE_PRESET,
    props.sizePreset ?? DEFAULT_SIZE_PRESET
  );
}

export const StyledComboboxRoot = styled.div.withConfig({
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

/** Габарит обёртки шеврона; svg внутри заполняет её. */
export const StyledComboboxChevron = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  display: block;
  inline-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  block-size: ${(props) =>
    spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
`;

export const StyledComboboxChevronBox = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  display: grid;
  place-items: center;
  inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  min-inline-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  color: ${(props) => getTheme(props).colors.muted};
  border-inline-start: 1px solid ${(props) => getTheme(props).colors.border};
`;

/* Значение триггера: опциональная иконка-слот + текст. Flex, чтобы отсутствующая
   иконка не резервировала трек (см. ui-kit «условный соседний элемент»). */
export const StyledComboboxValue = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  display: flex;
  gap: ${spacingRem(8)};
  align-items: center;
  min-inline-size: 0;
  padding-inline: ${(props) =>
    spacingRem(controlPaddingInline[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
`;

export const StyledComboboxTrigger = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  text-align: start;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => comboboxRadius(props)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};

  /* Панель поиска встаёт на место триггера; прячем его, сохраняя место под строку. */
  &[data-open='true'] {
    visibility: hidden;
  }
`;

/** Иконка-слот перед label (флаг локали и т.п.); глиф — канон controlIconSize. */
export const StyledComboboxOptionIcon = styled.span.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  display: inline-grid;
  flex-shrink: 0;
  place-items: center;

  & > svg {
    inline-size: ${(props) =>
      spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
    block-size: ${(props) =>
      spacingRem(controlIconSize[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
  }
`;

export const StyledComboboxPanel = styled.div.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  position: fixed;
  inset-block-start: 0;
  inset-inline-start: 0;
  z-index: 2000;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  /* Итоговая max-block-size ставится в JS по доступной высоте вьюпорта;
     скролл списка — через ScrollPort (кросс-системный скроллбар, как в Table/Card). */
  overflow: hidden;
  background-color: ${(props) => getTheme(props).colors.surface};
  border: 1px solid ${(props) => getTheme(props).colors.border};
  border-radius: ${(props) => comboboxRadius(props)};
  box-shadow: ${(props) => getTheme(props).shadow.surface};
  /* Панель рендерится только в open-состоянии — фокус-кольцо всегда видно. */
  outline: 2px solid ${(props) => getTheme(props).colors.focusRing};
  outline-offset: 2px;
`;

/* Строка поиска = первая строка панели на месте контрола; высоту даёт сам Input.
   Зазор по краям, чтобы рамка Input не сливалась с рамкой панели (без линии-разделителя). */
export const StyledComboboxSearchRow = styled.div`
  display: grid;
  padding: ${spacingRem(4)};

  /* Фокус-кольцо несёт сама панель (outline на корне) — внутреннее кольцо Input
     избыточно и читается как лишняя рамка у списка; гасим только здесь. */
  & input:focus-visible {
    outline: none;
  }
`;

export const StyledComboboxList = styled.ul`
  display: grid;
  gap: ${spacingRem(4)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** Чек выбранной опции. */
export const StyledComboboxCheck = styled.span`
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  inline-size: ${spacingRem(20)};
  block-size: ${spacingRem(20)};
  margin-inline-start: auto;
  color: ${(props) => getTheme(props).colors.primary};
`;

export const StyledComboboxOption = styled.button.withConfig({
  shouldForwardProp: shouldForwardAxis,
})<ComboboxAxisProps>`
  position: relative;
  z-index: 0;
  display: flex;
  gap: ${spacingRem(12)};
  align-items: center;
  inline-size: 100%;
  min-block-size: ${(props) => blockSizeRem(props.sizePreset ?? DEFAULT_SIZE_PRESET)};
  padding-inline: ${(props) =>
    spacingRem(controlPaddingInline[props.sizePreset ?? DEFAULT_SIZE_PRESET])};
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
    border-radius: calc(${(props) => comboboxRadius(props)} - ${spacingRem(4)});
    transition: background-color 0.12s ease;
  }

  &:focus {
    outline: none;
  }

  /* Подсветка строки: клавиатура (data-active) и мышь/фокус — единый фон. */
  &[data-active='true']::before,
  &:hover:not(:disabled)::before,
  &:focus-visible::before {
    background-color: ${(props) => getTheme(props).colors.primary};
  }

  &[data-active='true'],
  &:hover:not(:disabled),
  &:focus-visible {
    color: ${(props) => getTheme(props).colors.inverse};
  }

  /* Чек перенимает цвет подсветки активной/наведённой строки. */
  &[data-active='true']
    ${StyledComboboxCheck},
    &:hover:not(:disabled)
    ${StyledComboboxCheck},
    &:focus-visible
    ${StyledComboboxCheck} {
    color: inherit;
  }
`;
