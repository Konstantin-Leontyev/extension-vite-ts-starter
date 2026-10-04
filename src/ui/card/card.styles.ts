/**
 * Файл: `src/ui/card/card.styles.ts`
 * Определяет внешний вид компонента Card.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CardStyleProps`
 * 2. Хранить внутренний отступ поверхности в `CARD_PADDING` и размер кнопок
 *    ряда действий в `CARD_HEADER_ACTION_SIZE_PRESET`
 * 3. Предоставить styled-узлы `StyledCard`, `StyledCardHeader`,
 *    `StyledCardHeaderFirstLine` и `StyledCardBody`
 *
 * Потребители:
 *  - `src/ui/card/index.tsx` — собирает компонент Card и реэкспортирует публичное API
 */

import styled from 'styled-components';

import {
  BORDER_PROP_NAMES,
  DEFAULT_SHOW_BORDER,
  DEFAULT_SHOW_SHADOW,
  getBorderStyles,
  type BorderProps,
} from '@ui/border';
import { getIconSize } from '@ui/icon';
import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
  type SizePreset,
} from '@ui/presets';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import {
  DEFAULT_SURFACE_BACKGROUND,
  getSurfaceBackgroundColor,
  type SurfaceBackgroundPreset,
} from '@ui/surface';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * CARD_HEADER_ACTION_SIZE_PRESET — задаёт размер кнопок ряда действий шапки.
 * Размер ряда — контракт Card, собственного пропа размера у действия нет:
 * под этот пресет всегда резервируется высота первой строки шапки,
 * заголовок не смещается при добавлении и удалении действий.
 * Габарит крупнее ряда через layout-пропсы на Icon в карточке ломает композицию.
 */
export const CARD_HEADER_ACTION_SIZE_PRESET: SizePreset = 'normal';

/**
 * CardStyleProps — представляет пропсы стилизации Card и layout-пропсы.
 *
 * @property background — заливка карточки
 * @property hasHeader — включает строку шапки в grid-раскладке корня
 */
export type CardStyleProps = LayoutProps &
  BorderProps & {
    background?: SurfaceBackgroundPreset;
    hasHeader: boolean;
  };

/**
 * CARD_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Card.
 */
const CARD_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  ...BORDER_PROP_NAMES,
  'background',
  'hasHeader',
]);

/**
 * CARD_PADDING — задаёт внутренний отступ поверхности карточки.
 * Ряд действий берёт `insetBlockStart` и `insetInlineEnd` через `resolvePaddingEdge`.
 * Запасное значение — эта константа.
 */
export const CARD_PADDING: SpacingValue = 16;

/**
 * getCardStyles — возвращает CSS-правила для корня `StyledCard`: grid-ряды,
 * заливку и рамку с тенью.
 *
 * @param props пропсы стилизации Card и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getCardStyles(props: CardStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_SURFACE_BACKGROUND,
    borderTone,
    hasHeader,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
  } = props;

  return `
    grid-template-rows: ${hasHeader ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)'};
    background-color: ${getSurfaceBackgroundColor(theme, background)};
    ${getBorderStyles(theme, showBorder, showShadow, borderTone)}
  `;
}

/**
 * StyledCard — задаёт корневой узел компонента Card.
 * Базируется на `<div>` и поддерживает все пропсы из `CardStyleProps`.
 *
 * Встроенные стили:
 *  - `position: relative` — якорь для абсолютного ряда действий шапки
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` и `min-block-size: 0` — сжимается во flex/grid-родителе
 *  - `padding` — внутренний отступ поверхности
 *  - `overflow: hidden` — обрезает содержимое по скруглению
 *  - `border-radius` — скругление поверхности через `resolveBlockRadius`
 *
 * Генерация стилей:
 *  - `getCardStyles` — grid-ряды, заливка и рамка с тенью
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !CARD_PROP_NAMES.has(prop),
})<CardStyleProps>`
  position: relative;
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  padding: ${getSpacingValue(CARD_PADDING)};
  overflow: hidden;
  border-radius: ${resolveBlockRadius(
    DEFAULT_SHAPE_PRESET,
    getMinBlockSize(DEFAULT_SIZE_PRESET)
  )};
  ${(props) => getCardStyles(props)}
  ${(props) => getLayoutStyles(props)}
`;

/**
 * StyledCardHeader — задаёт контейнер шапки карточки с заголовком и подзаголовком.
 * Базируется на `<header>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `row-gap` — отступ между первой строкой и подзаголовком
 *  - `margin-block-end` — отступ шапки от тела, чтобы содержимое с рамкой,
 *    например таблица или вложенная Card, не соприкасалось с кнопками действий
 */
export const StyledCardHeader = styled.header`
  display: grid;
  row-gap: ${getSpacingValue(4)};
  margin-block-end: ${getSpacingValue(12)};
`;

/**
 * StyledCardHeaderFirstLine — задаёт первую строку шапки: заголовок
 * или единственный подзаголовок без заголовка.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` — сжимается при длинном тексте рядом с действиями шапки
 *  - `align-content: center` — центрирует текст по высоте ряда действий
 *  - `min-block-size` — постоянный резерв высоты под ряд действий
 *    `CARD_HEADER_ACTION_SIZE_PRESET`: заголовок не смещается при их
 *    добавлении и удалении
 */
export const StyledCardHeaderFirstLine = styled.div`
  display: grid;
  align-content: center;
  min-inline-size: 0;
  min-block-size: ${getSpacingValue(getIconSize(CARD_HEADER_ACTION_SIZE_PRESET))};
`;

/**
 * StyledCardBody — задаёт основной контент карточки.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` и `min-block-size: 0` — сжимается во flex/grid-родителе
 *  - `background-color: inherit` — тело берёт заливку карточки
 */
export const StyledCardBody = styled.div`
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  background-color: inherit;
`;
