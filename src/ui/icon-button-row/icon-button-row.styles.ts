/**
 * Файл: `src/ui/icon-button-row/icon-button-row.styles.ts`
 * Определяет внешний вид компонента IconButtonRow.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `IconButtonRowStyleProps`
 * 2. Предоставить styled-узлы `StyledIconButtonRow`, `StyledIconButtonRowSlot`
 *    и `StyledIconButtonRowSlotReserve`
 *
 * Потребители:
 *  - `src/ui/icon-button-row/index.tsx` — собирает компонент IconButtonRow
 */

import styled from 'styled-components';

import { getIconSize, type IconSizePreset } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import { DEFAULT_SIZE_PRESET } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';

/**
 * IconButtonRowStyleProps — представляет пропсы стилизации IconButtonRow и layout-пропсы.
 */
export type IconButtonRowStyleProps = LayoutProps;

/**
 * StyledIconButtonRow — задаёт корневой узел компонента IconButtonRow.
 * Базируется на `<div>` и поддерживает все пропсы из `IconButtonRowStyleProps`.
 *
 * Встроенные стили:
 *  - `position: relative` — якорит слот `control` на ряд
 *  - `grid-auto-flow: column` — кнопки в один ряд
 *  - `column-gap` — отступ между кнопками
 *  - `align-items: center` — выравнивает кнопки по поперечной оси ряда
 *
 * Генерация стилей:
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledIconButtonRow = styled.div.withConfig({
  shouldForwardProp: (prop) => !LAYOUT_PROP_NAMES.has(prop),
})<IconButtonRowStyleProps>`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  column-gap: ${getSpacingValue(8)};
  align-items: center;
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledIconButtonRowSlot — задаёт обёртку слота `control` компонента IconButtonRow.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `position: absolute` и `inset: 0` — корень контрола занимает ширину ряда
 *  - `place-items: center start` — ставит контрол в начало ряда и центрирует
 *    по поперечной оси. `justify-items: center` сдвинул бы его на середину
 *    растянутого слота и наложил на соседние кнопки
 *  - `pointer-events: none` — пустая область не перехватывает соседние кнопки
 *  - `> * { pointer-events: auto }` — контрол в слоте принимает жест
 */
export const StyledIconButtonRowSlot = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center start;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

/**
 * IconButtonRowSlotReserveStyleProps — представляет пропсы стилизации запасного места слота IconButtonRow.
 *
 * @property size — размер окна действия
 */
type IconButtonRowSlotReserveStyleProps = {
  size?: IconSizePreset;
};

/**
 * ICON_BUTTON_ROW_SLOT_RESERVE_PROP_NAMES — хранит имена пропсов стилизации запасного места слота IconButtonRow.
 */
const ICON_BUTTON_ROW_SLOT_RESERVE_PROP_NAMES = new Set<string>(['size']);

/**
 * getIconButtonRowSlotReserveStyles — возвращает CSS-правила для узла
 * `StyledIconButtonRowSlotReserve`: квадрат окна Icon и `pointer-events: none`.
 *
 * Как работает:
 * 1. Подставляет дефолт `size`
 * 2. Задаёт квадрат окна Icon и гасит события через `pointer-events: none`
 *
 * @param props пропсы запасного места слота
 * @returns CSS-правила, каждое с новой строки
 */
function getIconButtonRowSlotReserveStyles(
  props: IconButtonRowSlotReserveStyleProps
): string {
  const { size = DEFAULT_SIZE_PRESET } = props;

  return `
    inline-size: ${getSpacingValue(getIconSize(size))};
    block-size: ${getSpacingValue(getIconSize(size))};
    pointer-events: none;
  `;
}

/**
 * StyledIconButtonRowSlotReserve — задаёт запасное место под слот `control` компонента IconButtonRow.
 * Базируется на `<span>` и принимает проп `size`.
 *
 * Генерация стилей:
 *  - `getIconButtonRowSlotReserveStyles` — квадрат окна Icon и `pointer-events: none`
 *
 * Слот `control` вынут из потока через `position: absolute`. Без этого узла ряд
 * схлопнется, и соседние действия перекроют контрол слота.
 */
export const StyledIconButtonRowSlotReserve = styled.span.withConfig({
  shouldForwardProp: (prop) => !ICON_BUTTON_ROW_SLOT_RESERVE_PROP_NAMES.has(prop),
})<IconButtonRowSlotReserveStyleProps>`
  ${(props) => getIconButtonRowSlotReserveStyles(props)}
`;
