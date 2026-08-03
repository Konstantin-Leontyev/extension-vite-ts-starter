/**
 * Файл: `src/ui/modal/modal.styles.ts`
 * Определяет внешний вид компонента Modal.
 *
 * Основные задачи:
 * 1. Хранить отступ модального окна от края вьюпорта в `MODAL_VIEWPORT_EDGE_INSET`
 * 2. Предоставить styled-узел `StyledModalDialog`
 *
 * Потребители:
 *  - `src/ui/modal/index.tsx` — собирает компонент Modal
 */

import styled from 'styled-components';

import { getSpacingValue, type SpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * MODAL_VIEWPORT_EDGE_INSET — задаёт отступ модального окна от края вьюпорта.
 * Собственная метрика Modal, с токеном края оболочки не смешивается.
 */
const MODAL_VIEWPORT_EDGE_INSET: SpacingValue = 32;

/**
 * getModalDialogStyles — возвращает CSS-правила для узла `StyledModalDialog`:
 * затемнение страницы под модальным окном через псевдоэлемент `::backdrop`.
 *
 * @param props объект с полем `theme` из styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getModalDialogStyles(props: { theme: AppTheme }): string {
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
 *  - `max-inline-size` и `max-block-size` — ограничивают размер панели отступом
 *    `MODAL_VIEWPORT_EDGE_INSET` от краёв вьюпорта
 *  - `padding: 0`, `background: transparent`, `border: none` — Card внутри задаёт оформление поверхности
 *  - `margin: auto` — центрирует dialog во вьюпорте
 *
 * Генерация стилей:
 *  - `getModalDialogStyles` — затемнение `::backdrop` из токена `overlay` темы
 */
export const StyledModalDialog = styled.dialog`
  max-inline-size: calc(100vw - ${getSpacingValue(MODAL_VIEWPORT_EDGE_INSET)});
  max-block-size: calc(100dvb - ${getSpacingValue(MODAL_VIEWPORT_EDGE_INSET)});
  padding: 0;
  margin: auto;
  background: transparent;
  border: none;
  ${(props) => getModalDialogStyles(props)}
`;
