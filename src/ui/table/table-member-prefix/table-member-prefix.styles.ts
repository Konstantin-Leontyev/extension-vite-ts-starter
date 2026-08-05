/**
 * Файл: `src/ui/table/table-member-prefix/table-member-prefix.styles.ts`
 * Определяет внешний вид компонента TableMemberPrefix.
 *
 * Основные задачи:
 * 1. Предоставить styled-узел `StyledTableMemberPrefix`
 *
 * Потребители:
 *  - `src/ui/table/table-member-prefix/index.tsx` — собирает компонент TableMemberPrefix
 */

import styled from 'styled-components';

import { getTheme, type AppTheme } from '@ui/theme';

/**
 * getTableMemberPrefixStyles — возвращает CSS-правила для узла `StyledTableMemberPrefix`:
 * приглушённый цвет глифа.
 *
 * @param props объект с темой
 * @returns CSS-правила, каждое с новой строки
 */
function getTableMemberPrefixStyles(props: { theme: AppTheme }): string {
  return `color: ${getTheme(props).colors.muted};`;
}

/**
 * StyledTableMemberPrefix — задаёт префикс member-строки компонента TableMemberPrefix.
 * Базируется на `<span>` и принимает нативные атрибуты элемента.
 *
 * Встроенные стили:
 *  - `flex-shrink: 0` — префикс не сжимается при нехватке места
 *
 * Генерация стилей:
 *  - `getTableMemberPrefixStyles` — приглушённый цвет из темы
 */
export const StyledTableMemberPrefix = styled.span`
  flex-shrink: 0;
  ${(props) => getTableMemberPrefixStyles(props)}
`;
