/**
 * Файл: `src/ui/card/card.styles.ts`
 * Определяет внешний вид компонента Card.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CardStyleProps` и `CardBackground`
 * 2. Предоставить константу `CARD_HEADER_ACTION_SIZE_PRESET` и перечень
 *    `CARD_BACKGROUND_KEYS`
 * 3. Предоставить styled-узлы `StyledCard`, `StyledCardHeader`,
 *    `StyledCardHeaderActions`, `StyledCardHeaderFirstLine` и `StyledCardBody`
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
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * CARD_HEADER_ACTION_SIZE_PRESET — задаёт размер кнопок ряда действий шапки.
 * Размер ряда — контракт Card, собственной оси размера у действия нет:
 * под этот пресет всегда резервируется высота первой строки шапки,
 * заголовок не смещается при добавлении и удалении действий.
 * Тип `SizePreset`: oversized-габарит через layout на Icon в хроме карточки
 * ломает композицию.
 */
export const CARD_HEADER_ACTION_SIZE_PRESET: SizePreset = 'normal';

/**
 * CardBackground — представляет заливку карточки: поверхность, фон страницы
 * или прозрачную. Рамка и тень — через `showBorder` и `showShadow`, не через заливку.
 */
export type CardBackground = 'background' | 'surface' | 'transparent';

/**
 * CARD_BACKGROUND_KEYS — задаёт перечень фонов карточки.
 * Используется в панелях настроек витрины дизайн-системы: `BackgroundListbox`
 * собирает из него опции для `Listbox`.
 */
export const CARD_BACKGROUND_KEYS = Object.freeze([
  'surface',
  'background',
  'transparent',
] as const satisfies readonly CardBackground[]);

/**
 * CardStyleProps — представляет пропсы стилизации Card и layout-пропсы.
 *
 * @property background — заливка карточки
 * @property hasHeader — включает строку шапки в grid-раскладке корня
 */
export type CardStyleProps = LayoutProps &
  BorderProps & {
    background?: CardBackground;
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
 * DEFAULT_CARD_BACKGROUND — задаёт фон карточки по умолчанию.
 * Используется, когда вызывающий код не передал проп `background`.
 */
const DEFAULT_CARD_BACKGROUND: CardBackground = 'surface';

/**
 * getCardStyles — возвращает CSS-правила для корня `StyledCard`: grid-ряды,
 * заливку, тень и рамку.
 *
 * @param props пропсы стилизации Card и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getCardStyles(props: CardStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const {
    background = DEFAULT_CARD_BACKGROUND,
    borderTone,
    hasHeader,
    showBorder = DEFAULT_SHOW_BORDER,
    showShadow = DEFAULT_SHOW_SHADOW,
  } = props;

  const backgroundColor =
    background === 'transparent'
      ? 'transparent'
      : background === 'background'
        ? theme.colors.background
        : theme.colors.surface;

  const styles = [
    hasHeader
      ? 'grid-template-rows: auto minmax(0, 1fr);'
      : 'grid-template-rows: minmax(0, 1fr);',
    `background-color: ${backgroundColor};`,
    getBorderStyles(theme, showBorder, showShadow, borderTone),
  ];

  return styles.join('\n');
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
 *  - `getCardStyles` — grid-ряды, заливка, тень и рамка
 *  - `getLayoutStyles` — отступы, позиционирование, размеры
 */
export const StyledCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !CARD_PROP_NAMES.has(prop),
})<CardStyleProps>`
  position: relative;
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  padding: ${getSpacingValue(16)};
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
 * StyledCardHeaderActions — задаёт ряд кнопок-действий в правом верхнем углу карточки.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `position: absolute` — поверх содержимого без сдвига grid-потока шапки
 *  - `inset-block-start` и `inset-inline-end` — совпадают с `padding` корня, фиксируют
 *    ряд в углу карточки
 *  - `z-index: 1` — ряд поверх содержимого шапки
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `grid-auto-flow: column` — горизонтальный ряд кнопок
 *  - `column-gap` — отступ между кнопками
 *  - `align-items: center` — выравнивание по центру строки действий
 */
export const StyledCardHeaderActions = styled.div`
  position: absolute;
  inset-block-start: ${getSpacingValue(16)};
  inset-inline-end: ${getSpacingValue(16)};
  z-index: 1;
  display: grid;
  grid-auto-flow: column;
  column-gap: ${getSpacingValue(8)};
  align-items: center;
`;

/**
 * StyledCardHeaderFirstLine — задаёт первую строку шапки: заголовок
 * или единственный подзаголовок без заголовка.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` — сжимается при длинном тексте рядом с actions
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
 *  - `position: relative` — якорь для вложенного позиционирования
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` и `min-block-size: 0` — сжимается во flex/grid-родителе
 *  - `background-color: inherit` — прозрачный фон карточки наследуется телом
 */
export const StyledCardBody = styled.div`
  position: relative;
  display: grid;
  min-inline-size: 0;
  min-block-size: 0;
  background-color: inherit;
`;
