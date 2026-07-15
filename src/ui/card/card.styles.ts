/**
 * Файл: `src/ui/card/card.styles.ts`
 * Определяет внешний вид компонента Card.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `CardStyleProps` и `CardBackground`
 * 2. Хранить перечень фонов в `CARD_BACKGROUND_KEYS`
 * 3. Предоставить функции `getCardStyles`, `getCardHeaderFirstLineStyles`
 *    и `resolveLargestHeaderActionSizePreset`
 * 4. Предоставить styled-узлы `StyledCard`, `StyledCardHeader`,
 *    `StyledCardHeaderActions`, `StyledCardHeaderFirstLine` и `StyledCardBody`
 *
 * Потребители:
 *  - `src/ui/card/index.tsx` — собирает компонент Card и реэкспортирует публичное API
 */

import styled from 'styled-components';

import { LAYOUT_PROP_NAMES, getLayoutStyles, type LayoutProps } from '@ui/layout';
import {
  DEFAULT_SHAPE_PRESET,
  DEFAULT_SIZE_PRESET,
  getMinBlockSize,
  resolveBlockRadius,
} from '@ui/presets';
import {
  DEFAULT_ROUND_BUTTON_SIZE_PRESET,
  roundButtonPresets,
  type RoundButtonSizePreset,
} from '@ui/round-button';
import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * CardBackground — представляет заливку карточки: surface, фон страницы
 * или прозрачную без тени.
 */
export type CardBackground = 'background' | 'default' | 'transparent';

/**
 * CardStyleProps — представляет пропсы стилизации Card и layout-пропсы.
 *
 * @property background — заливка карточки
 * @property hasHeader — включает строку шапки в grid-раскладке корня
 */
export type CardStyleProps = LayoutProps & {
  background?: CardBackground;
  hasHeader: boolean;
};

/**
 * CARD_BACKGROUND_KEYS — хранит перечень фонов карточки.
 * Используется в панелях настроек витрины дизайн-системы: значения передаются
 * в `Listbox` пропом `options`.
 */
export const CARD_BACKGROUND_KEYS = Object.freeze([
  'default',
  'background',
  'transparent',
] as const satisfies readonly CardBackground[]);

/**
 * DEFAULT_CARD_BACKGROUND — задаёт фон карточки по умолчанию.
 * Используется, когда вызывающий код не передал проп `background`.
 */
const DEFAULT_CARD_BACKGROUND: CardBackground = 'default';

/**
 * CARD_PROP_NAMES — объединяет имена layout-пропсов и пропсов стилизации Card.
 */
const CARD_PROP_NAMES = new Set<string>([
  ...LAYOUT_PROP_NAMES,
  'background',
  'hasHeader',
]);

/**
 * getCardStyles — возвращает CSS-правила для корня `StyledCard`: grid-ряды,
 * заливку, тень и рамку.
 *
 * @param props — пропсы стилизации Card и тема
 * @returns CSS-правила, каждое с новой строки
 */
export function getCardStyles(props: CardStyleProps & { theme: AppTheme }): string {
  const theme = getTheme(props);
  const { background = DEFAULT_CARD_BACKGROUND, hasHeader } = props;

  const styles: string[] = [
    hasHeader
      ? 'grid-template-rows: auto minmax(0, 1fr);'
      : 'grid-template-rows: minmax(0, 1fr);',
  ];

  if (background !== 'transparent') {
    const fill =
      background === 'background' ? theme.colors.background : theme.colors.surface;

    styles.push(`background-color: ${fill};`);
    styles.push(`box-shadow: ${theme.shadow.surface};`);
  }

  styles.push(`border: 1px solid ${theme.colors.border};`);

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
 * getRoundButtonMinBlockSize — возвращает ключ шкалы минимальной высоты RoundButton
 * для согласования высоты первой строки шапки карточки.
 *
 * @param sizePreset — размер RoundButton в ряду действий
 * @returns ключ шкалы `minBlockSize` из `@ui/round-button`
 */
function getRoundButtonMinBlockSize(sizePreset: RoundButtonSizePreset): SpacingValue {
  return roundButtonPresets[sizePreset].minBlockSize;
}

/**
 * resolveLargestHeaderActionSizePreset — вычисляет наибольший пресет в ряду действий
 * шапки. Под него резервируется высота первой строки, когда действия присутствуют.
 *
 * @param sizePresets — пресеты действий с уже подставленным дефолтом RoundButton
 * @returns наибольший пресет ряда
 */
export function resolveLargestHeaderActionSizePreset(
  sizePresets: readonly RoundButtonSizePreset[]
): RoundButtonSizePreset {
  return sizePresets.reduce<RoundButtonSizePreset>((largest, preset) => {
    return getRoundButtonMinBlockSize(preset) > getRoundButtonMinBlockSize(largest)
      ? preset
      : largest;
  }, DEFAULT_ROUND_BUTTON_SIZE_PRESET);
}

/**
 * CARD_HEADER_FIRST_LINE_PROP_NAMES — хранит имена пропсов стилизации первой строки шапки.
 */
const CARD_HEADER_FIRST_LINE_PROP_NAMES = new Set<string>([
  'actionsSizePreset',
  'hasActions',
]);

/**
 * CardHeaderFirstLineStyleProps — представляет пропсы стилизации первой строки шапки.
 *
 * @property actionsSizePreset — наибольший пресет ряда действий
 * @property hasActions — включает резерв высоты под ряд действий
 */
type CardHeaderFirstLineStyleProps = {
  actionsSizePreset: RoundButtonSizePreset;
  hasActions: boolean;
};

/**
 * getCardHeaderFirstLineStyles — возвращает CSS-правила для узла `StyledCardHeaderFirstLine`:
 * центрирование по высоте ряда действий и минимальную высоту строки.
 *
 * @param props — пропсы стилизации первой строки шапки
 * @returns CSS-правила, каждое с новой строки
 */
export function getCardHeaderFirstLineStyles(
  props: CardHeaderFirstLineStyleProps
): string {
  if (!props.hasActions) {
    return '';
  }

  const styles: string[] = [
    'align-content: center;',
    `min-block-size: ${getSpacingValue(getRoundButtonMinBlockSize(props.actionsSizePreset))};`,
  ];

  return styles.join('\n');
}

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
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `min-inline-size: 0` — сжимается при длинном тексте рядом с actions
 *
 * Генерация стилей:
 *  - `getCardHeaderFirstLineStyles` — выравнивание и минимальная высота под actions
 */
export const StyledCardHeaderFirstLine = styled.div.withConfig({
  shouldForwardProp: (prop) => !CARD_HEADER_FIRST_LINE_PROP_NAMES.has(prop),
})<CardHeaderFirstLineStyleProps>`
  display: grid;
  min-inline-size: 0;
  ${(props) => getCardHeaderFirstLineStyles(props)}
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
