/**
 * Файл: `src/pages/showcase/showcase.styles.ts`
 * Определяет layout страницы и styled-обёртки витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить максимальную высоту страницы витрины через `PLAYGROUND_MAX_BLOCK_SIZE`
 * 2. Предоставить styled-узел `StyledMain` для корневого landmark страницы
 * 3. Предоставить styled-узлы `StyledShowcaseWidgets` и `StyledShowcaseWidgetFullRow`
 *    для сетки виджетов
 * 4. Предоставить styled-узлы `StyledSettingsForm` и `StyledSettingsField` для формы
 *    настроек в Sidebar
 * 5. Предоставить styled-узел демо-превью `StyledRadioButtonDemo`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — собирает layout витрины и оборачивает карточки
 *    виджетов
 *  - панели настроек витрины дизайн-системы — рендерят `StyledSettingsForm` и
 *    `StyledSettingsField` в Sidebar
 */
import styled from 'styled-components';

import { HEADER_BLOCK_SIZE } from '@components/header';
import { getSpacingValue } from '@ui/spacing';

/**
 * PLAYGROUND_MAX_BLOCK_SIZE — задаёт максимальную высоту страницы витрины.
 * Высота равна вьюпорту минус живая высота шапки из CSS-переменной
 * `--shell-header-block-size`, которую публикует шапка. При сворачивании шапки
 * в `autoHide` переменная уменьшается, и каркас занимает весь экран.
 * Единица `dvb` не зависит от grid-каркаса body, поэтому ScrollPort внутри
 * скроллит контент, не растягивая страницу. Каркасная альтернатива описана
 * в `@ui/sidebar`.
 * Используется в `StyledMain` как значение `max-block-size`.
 */
export const PLAYGROUND_MAX_BLOCK_SIZE = `calc(100dvb - var(--shell-header-block-size, ${HEADER_BLOCK_SIZE}))`;

/**
 * StyledMain — задаёт корневой landmark витрины дизайн-системы.
 * Базируется на `<main>`.
 *
 * Встроенные стили:
 *  - `display: grid` — раскладка по дефолту проекта
 *  - `grid-template-rows` и `grid-template-columns: minmax(0, 1fr)` — занимает доступную
 *    высоту и ширину без переполнения
 *  - `max-block-size` из `PLAYGROUND_MAX_BLOCK_SIZE` — заданная высота для каркаса Sidebar:
 *    габариты задаёт страница, сам Sidebar пропсов размеров не имеет
 *  - `min-block-size: 0` — предотвращает переполнение во flex-контейнерах
 */
export const StyledMain = styled.main`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr);
  min-block-size: 0;
  max-block-size: ${PLAYGROUND_MAX_BLOCK_SIZE};
`;

/**
 * StyledShowcaseWidgetFullRow — задаёт обёртку виджета на всю ширину сетки витрины
 * дизайн-системы.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-column: 1 / -1` — карточка растягивается на все колонки сетки
 *  - `block-size: 22rem` — фиксированная высота ряда для широких виджетов, например Table
 *  - `min-inline-size: 0` — предотвращает переполнение во flex-контейнерах
 */
export const StyledShowcaseWidgetFullRow = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-column: 1 / -1;
  min-inline-size: 0;
  block-size: 22rem;
  min-block-size: 0;
`;

/**
 * StyledShowcaseWidgets — задаёт сетку карточек виджетов витрины дизайн-системы.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-template-columns: repeat(auto-fit, minmax(16.75rem, 1fr))` — адаптивное число
 *    колонок
 *  - `gap` — отступ между карточками
 *  - `align-items: start` — карточки выравниваются по верхнему краю
 *  - `aspect-ratio: 1 / 1` на дочерних узлах, кроме `StyledShowcaseWidgetFullRow` —
 *    квадратные карточки превью
 */
export const StyledShowcaseWidgets = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16.75rem, 1fr));
  gap: ${getSpacingValue(8)};
  align-items: start;

  > :not(${StyledShowcaseWidgetFullRow}) {
    aspect-ratio: 1 / 1;
  }
`;

/**
 * StyledSettingsForm — задаёт форму настроек виджета в Sidebar витрины дизайн-системы.
 * Базируется на `<form>`.
 *
 * Встроенные стили:
 *  - `display: grid` — поля идут колонкой
 *  - `gap` — вертикальный отступ между полями
 */
export const StyledSettingsForm = styled.form`
  display: grid;
  gap: ${getSpacingValue(16)};
`;

/**
 * StyledSettingsField — задаёт поле настройки с подписью над контролом.
 * Базируется на `<div>`.
 * Используется для контролов без встроенной подписи, например Stepper.
 *
 * Встроенные стили:
 *  - `display: grid` — подпись над контролом
 *  - `gap` — отступ между подписью и контролом
 */
export const StyledSettingsField = styled.div`
  display: grid;
  gap: ${getSpacingValue(8)};
`;

/**
 * StyledRadioButtonDemo — задаёт обёртку демо RadioButton в карточке виджета.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` — вертикальный стек кнопок
 *  - `gap` — отступ между кнопками
 *  - `place-content: center` — центрирует стек в ячейке карточки
 */
export const StyledRadioButtonDemo = styled.div`
  display: grid;
  gap: ${getSpacingValue(8)};
  place-content: center;
`;
