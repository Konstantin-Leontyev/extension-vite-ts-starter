/**
 * Файл: `src/components/header/header.styles.ts`
 * Определяет внешний вид компонента Header.
 *
 * Основные задачи:
 * 1. Типизировать пропсы через `HeaderStyleProps`
 * 2. Хранить высоту шапки в `HEADER_BLOCK_SIZE`
 * 3. Предоставить дефолт `DEFAULT_HEADER_AUTO_HIDE` и глобальные стили `HeaderShellStyle`
 * 4. Предоставить styled-узлы `StyledHeader`, `StyledHeaderBar`, `StyledHeaderBrand`,
 *    `StyledHeaderProject` и `StyledHeaderActions`
 *
 * Потребители:
 *  - `src/components/header/index.tsx` — собирает компонент Header и реэкспортирует публичное API
 */

import { NavLink } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { getShellTransitionStyles } from '@ui/motion';
import { getMinBlockSize, type SizePreset } from '@ui/presets';
import { getSpacingValue } from '@ui/spacing';
import { getTheme, type AppTheme } from '@ui/theme';

/**
 * HEADER_PADDING_BLOCK — задаёт вертикальный отступ шапки.
 * Используется в `HEADER_BLOCK_SIZE` и `StyledHeaderBar`.
 */
const HEADER_PADDING_BLOCK = 12;

/**
 * HEADER_CONTROL_SIZE_PRESET — задаёт размер контролов шапки.
 * Используется в `HEADER_BLOCK_SIZE` и `StyledHeaderProject`.
 */
const HEADER_CONTROL_SIZE_PRESET: SizePreset = 'medium';

/**
 * HEADER_BLOCK_SIZE — формирует высоту шапки из размера контролов и вертикальных отступов.
 * Задаёт высоту самой шапки и полосу оверлеев, центрируемых по ней.
 * Используется в `StyledHeaderBar`, `getHeaderStyles`, `HeaderShellStyle` и через реэкспорт
 * из `@components/header`.
 */
export const HEADER_BLOCK_SIZE = `calc(${getMinBlockSize(HEADER_CONTROL_SIZE_PRESET)} + ${getSpacingValue(HEADER_PADDING_BLOCK)} * 2)`;

/**
 * COLLAPSED_INSET — задаёт высоту свёрнутого слота шапки.
 * Совпадает с верхним отступом страницы.
 * Используется в `getHeaderStyles` и `HeaderShellStyle`.
 */
const COLLAPSED_INSET = getSpacingValue(8);

/**
 * getHeaderBarStyles — возвращает CSS-правила для узла `StyledHeaderBar`: фон полосы.
 *
 * @param props объект с полем `theme` из styled-components
 * @returns CSS-правила, каждое с новой строки
 */
function getHeaderBarStyles(props: { theme: AppTheme }): string {
  const styles = [`background-color: ${getTheme(props).colors.background};`];

  return styles.join('\n');
}

/**
 * StyledHeaderBar — задаёт видимую полосу компонента Header.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `display: grid` и `grid-template-columns: 1fr auto 1fr` — бренд, центр и действия
 *  - `align-items: center` — выравнивает содержимое по вертикали
 *  - `block-size` — фиксированная высота из `HEADER_BLOCK_SIZE`
 *  - `padding-block` и `padding-inline` — внутренние отступы полосы
 *
 * Генерация стилей:
 *  - `getHeaderBarStyles` — фон полосы из темы
 */
export const StyledHeaderBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  block-size: ${HEADER_BLOCK_SIZE};
  padding-block: ${getSpacingValue(HEADER_PADDING_BLOCK)};
  padding-inline: ${getSpacingValue(16)};
  ${(props) => getHeaderBarStyles(props)}
`;

/**
 * HeaderStyleProps — представляет пропсы стилизации Header.
 *
 * @property autoHide — включает режим скрытия шапки
 */
type HeaderStyleProps = { autoHide?: boolean };

/**
 * HEADER_PROP_NAMES — хранит имена пропсов стилизации Header.
 */
const HEADER_PROP_NAMES = new Set<string>(['autoHide']);

/**
 * DEFAULT_HEADER_AUTO_HIDE — задаёт режим скрытия шапки по умолчанию.
 * Используется, когда вызывающий код не передал проп `autoHide`.
 */
export const DEFAULT_HEADER_AUTO_HIDE = false;

/**
 * getHeaderStyles — возвращает CSS-правила для корня `StyledHeader`: режим `autoHide`.
 *
 * Как работает:
 * 1. Подставляет дефолт `autoHide`, когда проп не передан
 * 2. Без `autoHide` возвращает пустую строку
 * 3. Задаёт высоту слота `HEADER_BLOCK_SIZE`, обрезку полосы и переходы
 * 4. В свёрнутом состоянии уменьшает слот до `COLLAPSED_INSET` и сдвигает полосу вверх
 * 5. В состоянии `:focus-within` разворачивает слот и снимает сдвиг для клавиатуры
 *
 * @param props пропсы стилизации Header
 * @returns CSS-правила, каждое с новой строки
 */
function getHeaderStyles(props: HeaderStyleProps): string {
  const { autoHide = DEFAULT_HEADER_AUTO_HIDE } = props;

  if (!autoHide) {
    return '';
  }

  const styles = [
    `block-size: ${HEADER_BLOCK_SIZE};`,
    'overflow: hidden;',
    getShellTransitionStyles('block-size'),
    `${StyledHeaderBar} {`,
    getShellTransitionStyles('transform'),
    '}',
    `&:not([data-revealed='true']) {`,
    `block-size: ${COLLAPSED_INSET};`,
    '}',
    `&:not([data-revealed='true']) ${StyledHeaderBar} {`,
    'transform: translateY(-100%);',
    '}',
    `&:focus-within {`,
    `block-size: ${HEADER_BLOCK_SIZE};`,
    '}',
    `&:focus-within ${StyledHeaderBar} {`,
    'transform: none;',
    '}',
  ];

  return styles.join('\n');
}

/**
 * StyledHeader — задаёт корневой узел компонента Header.
 * Базируется на `<header>` и поддерживает проп `autoHide`.
 *
 * Встроенные стили:
 *  - `position: sticky` и `inset-block-start: 0` — шапка закреплена у верхнего края
 *  - `z-index: 10` — шапка выше основного контента
 *
 * Генерация стилей:
 *  - `getHeaderStyles` — правила режима `autoHide`: высота слота, обрезка полосы,
 *    анимация и разворот по `:focus-within`
 *
 * Без `autoHide` генератор не отдаёт правил, шапка остаётся `sticky` на полной высоте.
 */
export const StyledHeader = styled.header.withConfig({
  shouldForwardProp: (prop) => !HEADER_PROP_NAMES.has(prop),
})<HeaderStyleProps>`
  position: sticky;
  inset-block-start: 0;
  z-index: 10;

  ${(props) => getHeaderStyles(props)}
`;

/**
 * HeaderShellStyle — задаёт CSS-переменную высоты слота шапки на `body`.
 * Публикует `--shell-header-block-size`, чтобы соседний контент считал высоту реактивно
 * к режиму `autoHide`. Переменная зарегистрирована через `@property` как `<length>`,
 * поэтому смена значения плавно интерполируется.
 * Подключается в Header из `src/components/header/index.tsx`.
 *
 * Устанавливает:
 *  - `@property --shell-header-block-size` — регистрирует длину для интерполяции
 *  - `--shell-header-block-size` на `body` — `HEADER_BLOCK_SIZE` в развёрнутом состоянии
 *  - `--shell-header-block-size` при свёрнутой шапке — `COLLAPSED_INSET`
 */
export const HeaderShellStyle = createGlobalStyle`
  @property --shell-header-block-size {
    syntax: '<length>';
    inherits: true;
    initial-value: 0;
  }

  body {
    --shell-header-block-size: ${HEADER_BLOCK_SIZE};
    ${getShellTransitionStyles('--shell-header-block-size')}
  }

  body:has(> header[data-revealed='false']):not(:has(> header:focus-within)) {
    --shell-header-block-size: ${COLLAPSED_INSET};
  }
`;

/**
 * StyledHeaderBrand — задаёт слот бренда компонента Header.
 * Базируется на `NavLink` из react-router-dom.
 *
 * Встроенные стили:
 *  - `justify-self: start` — бренд в начале первой колонки грида
 */
export const StyledHeaderBrand = styled(NavLink)`
  justify-self: start;
`;

/**
 * StyledHeaderProject — задаёт центральную колонку компонента Header.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-column: 2` — колонка названия проекта по центру грида полосы
 *  - `place-items: center` и `justify-self: center` — содержимое по центру ячейки
 *  - `min-block-size` — высота ячейки согласована с контролами шапки
 *  - `padding-inline` — боковые отступы вокруг содержимого
 */
export const StyledHeaderProject = styled.div`
  display: grid;
  grid-column: 2;
  place-items: center;
  justify-self: center;
  min-block-size: ${getMinBlockSize(HEADER_CONTROL_SIZE_PRESET)};
  padding-inline: ${getSpacingValue(4)};
`;

/**
 * StyledHeaderActions — задаёт ряд действий компонента Header.
 * Базируется на `<div>`.
 *
 * Встроенные стили:
 *  - `grid-column: 3` — третья колонка грида полосы `1fr auto 1fr`
 *  - `grid-auto-flow: column` — контролы в один ряд
 *  - `gap` — отступ между контролами
 *  - `justify-self: end` — ряд у правого края полосы
 */
export const StyledHeaderActions = styled.div`
  display: grid;
  grid-column: 3;
  grid-auto-flow: column;
  gap: ${getSpacingValue(12)};
  align-items: center;
  justify-self: end;
`;
