/**
 * Файл: `src/ui/table/table-cell/table-cell.styles.ts`
 * Определяет внешний вид компонента TableCell.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `TableCellAlign` и `TableCellStyleProps`
 * 2. Предоставить функции `getTableCellEdgeStyles`
 * 3. Предоставить styled-узлы `StyledTableCell` и `StyledTableCellLead`
 *
 * Потребители:
 *  - `src/ui/table/table-cell/index.tsx` — собирает компонент TableCell и реэкспортирует публичное API
 *  - `src/ui/table/index.tsx` — использует `StyledTableCellLead` в раскладке строк Table
 *  - `src/ui/table/table.styles.ts` — берёт `getTableCellEdgeStyles` для шва подвала
 */

import styled from 'styled-components';

import { DEFAULT_SIZE_PRESET, getPaddingInline, type SizePreset } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getEllipsisStyles } from '@ui/text';
import { getTheme, type AppTheme } from '@ui/theme';
import { resolveColorMix } from '@ui/tones';

/**
 * TABLE_EDGE_BORDER_WIDTH — задаёт толщину шва секции шапки и подвала.
 * Используется в `getTableCellEdgeStyles`.
 */
const TABLE_EDGE_BORDER_WIDTH = '2px';

/**
 * TABLE_HEAD_FILL_MIX_PERCENT — задаёт долю цвета рамки в смеси заливки шапки и подвала.
 * Подбирает приглушённый фон относительно `surface` Card.
 */
const TABLE_HEAD_FILL_MIX_PERCENT = 22;

/**
 * resolveTableHeadFill — возвращает приглушённую заливку шапки и подвала.
 * Контрастирует с телом таблицы на поверхности Card.
 *
 * @param theme текущая тема
 * @returns значение для CSS-свойства `background-color`
 */
function resolveTableHeadFill(theme: AppTheme): string {
  return resolveColorMix(
    theme.colors.border,
    theme.colors.surface,
    TABLE_HEAD_FILL_MIX_PERCENT
  );
}

/**
 * getTableCellEdgeStyles — возвращает CSS-правила заливки и шва секции шапки
 * или подвала.
 * Ячейка с `head` пишет нижний шов сама. Подвал ещё адресует ячейки селектором
 * и берёт те же CSS-правила, чтобы толщина и заливка не разъехались.
 *
 * @param theme текущая тема
 * @param side сторона блочного шва
 * @returns CSS-правила, каждое с новой строки
 */
export function getTableCellEdgeStyles(
  theme: AppTheme,
  side: 'block-end' | 'block-start'
): string {
  return `
    background-color: ${resolveTableHeadFill(theme)};
    border-${side}: ${TABLE_EDGE_BORDER_WIDTH} solid ${theme.colors.border};
  `;
}

/**
 * TableCellAlign — представляет горизонтальное выравнивание содержимого ячейки.
 */
export type TableCellAlign = 'center' | 'end' | 'start';

/**
 * DEFAULT_TABLE_CELL_TEXT_ALIGN — задаёт горизонтальное выравнивание ячейки по умолчанию.
 * Используется, когда вызывающий код не передал проп `textAlign`.
 */
const DEFAULT_TABLE_CELL_TEXT_ALIGN: TableCellAlign = 'center';

/**
 * TableCellStyleProps — представляет пропсы стилизации TableCell.
 *
 * @property ellipsis — включает обрезку с многоточием
 * @property head — включает заливку и нижний шов секции шапки
 * @property nowrap — включает запрет переноса строк
 * @property size — размер ячейки
 * @property textAlign — горизонтальное выравнивание содержимого
 */
export type TableCellStyleProps = {
  ellipsis?: boolean;
  head?: boolean;
  nowrap?: boolean;
  size?: SizePreset;
  textAlign?: TableCellAlign;
};

/**
 * TABLE_CELL_PROP_NAMES — хранит имена пропсов стилизации TableCell.
 */
const TABLE_CELL_PROP_NAMES = new Set<string>([
  'ellipsis',
  'head',
  'nowrap',
  'size',
  'textAlign',
]);

/**
 * getTableCellStyles — возвращает CSS-правила для корня `StyledTableCell`: отступы,
 * выравнивание, режим переноса или обрезки и при `head` заливку с нижним швом
 * секции шапки.
 *
 * Как работает:
 * 1. Берёт `size` или `DEFAULT_SIZE_PRESET` и задаёт `padding-inline`
 * 2. Задаёт `vertical-align: middle` и `text-align` по `textAlign`
 * 3. При `ellipsis` подставляет `getEllipsisStyles`, при `nowrap` — `white-space: nowrap`,
 *    иначе `overflow-wrap: break-word`
 * 4. При `head` добавляет заливку и нижний шов секции через `getTableCellEdgeStyles`
 *
 * @param props пропсы стилизации ячейки и тема
 * @returns CSS-правила, каждое с новой строки
 */
function getTableCellStyles(props: TableCellStyleProps & { theme: AppTheme }): string {
  const size = props.size ?? DEFAULT_SIZE_PRESET;
  const styles = [
    `padding-inline: ${getPaddingInline(size)};`,
    'vertical-align: middle;',
    `text-align: ${props.textAlign ?? DEFAULT_TABLE_CELL_TEXT_ALIGN};`,
  ];

  if (props.ellipsis === true) {
    styles.push(getEllipsisStyles());
  } else if (props.nowrap === true) {
    styles.push('white-space: nowrap;');
  } else {
    styles.push('overflow-wrap: break-word;');
  }

  if (props.head) {
    styles.push(getTableCellEdgeStyles(getTheme(props), 'block-end'));
  }

  return styles.join('\n');
}

/**
 * StyledTableCell — задаёт корневой узел компонента TableCell.
 * Базируется на `<td>` и поддерживает все пропсы из `TableCellStyleProps`.
 *
 * Генерация стилей:
 *  - `getTableCellStyles` — отступы, выравнивание, перенос или обрезка,
 *    при `head` — заливка и нижний шов секции шапки
 *
 * На `td` и `th` нельзя задавать `display: grid` или `display: flex`: теряется
 * форматный контекст ячейки таблицы, высота строки и `vertical-align`. Горизонталь
 * задаётся через `text-align`, вертикаль через `vertical-align`. Нестандартный бокс —
 * обёртка внутри ячейки, например `StyledTableCellLead`.
 */
export const StyledTableCell = styled.td.withConfig({
  shouldForwardProp: (prop) => !TABLE_CELL_PROP_NAMES.has(prop),
})<TableCellStyleProps>`
  ${(props) => getTableCellStyles(props)}
`;

/**
 * StyledTableCellLead — задаёт лид-слот ячейки TableCell.
 * Базируется на `<span>`: чекбокс или раскрытие группы и контент в одну линию.
 *
 * Встроенные стили:
 *  - `display: inline-flex` — оправданное исключение из grid по умолчанию: отсутствующий
 *    условный сосед не занимает место. Контент, последний ребёнок, забирает остаток
 *    ширины и сжимается с обрезкой; лид-контролы остаются фиксированными
 *  - `gap` — отступ между лид-контролами и контентом
 *  - `inline-size: 100%` — занимает ширину ячейки
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 */
export const StyledTableCellLead = styled.span`
  display: inline-flex;
  gap: ${getSpacingValue(8)};
  align-items: center;
  inline-size: 100%;
  min-inline-size: 0;

  & > :last-child {
    flex: 1 1 auto;
    min-inline-size: 0;
  }
`;
