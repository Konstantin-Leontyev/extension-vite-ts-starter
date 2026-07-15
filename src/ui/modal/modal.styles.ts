/**
 * Файл: `src/ui/modal/modal.styles.ts`
 * Определяет внешний вид компонента Modal.
 *
 * Основные задачи:
 * 1. Предоставить функцию `getModalDialogStyles` и styled-узел `StyledModalDialog`
 *
 * Потребители:
 *  - `src/ui/modal/index.tsx` — собирает компонент Modal
 */

import styled from 'styled-components';

import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * getModalDialogStyles — возвращает CSS-правила для узла `StyledModalDialog`:
 * затемнение страницы под модальным окном через псевдоэлемент `::backdrop`.
 *
 * @param props — объект с полем `theme` из styled-components
 * @returns CSS-правило псевдоэлемента `::backdrop`
 */
export function getModalDialogStyles(props: { theme: AppTheme }): string {
  const theme = getTheme(props);

  return `
    &::backdrop {
      background-color: ${theme.colors.overlay};
    }
  `;
}

/**
 * StyledModalDialog — задаёт корневой узел компонента Modal.
 * Базируется на `<dialog>`.
 *
 * Встроенные стили:
 *  - `max-inline-size` и `max-block-size` — ограничивают размер панели отступом от краёв viewport
 *  - `padding: 0`, `background: transparent`, `border: none` — Card внутри задаёт оформление поверхности
 *  - `margin: auto` — центрирует dialog в viewport
 *
 * Генерация стилей:
 *  - `getModalDialogStyles` — затемнение `::backdrop` из токена `overlay` темы
 */
export const StyledModalDialog = styled.dialog`
  max-inline-size: calc(100vw - ${getSpacingValue(32)});
  max-block-size: calc(100dvb - ${getSpacingValue(32)});
  padding: 0;
  margin: auto;
  background: transparent;
  border: none;
  ${(props) => getModalDialogStyles(props)}
`;
