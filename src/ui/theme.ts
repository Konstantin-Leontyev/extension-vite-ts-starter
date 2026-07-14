/**
 * Файл: `src/ui/theme.ts`
 * Определяет систему тем для приложения.
 * Содержит цветовые палитры для светлой и тёмной тем, тени, глобальные стили
 * и вспомогательные утилиты для работы с темой в styled-components.
 *
 * Основные задачи:
 * 1. Типизировать тему через `ThemeColors` и `AppTheme`
 * 2. Предоставить готовые объекты `styledLightTheme` и `styledDarkTheme`
 * 3. Обеспечить доступ к текущей теме через `getTheme`
 * 4. Задать глобальные стили через `GlobalThemeStyle`
 * 5. Расширить `DefaultTheme` для корректной работы с TypeScript
 *
 * Потребители:
 *  - все `*.styles.ts` — читают тему через `getTheme(props)`
 *  - `ThemeProvider` из `src/context/theme/index.tsx` — подключает `GlobalThemeStyle`
 *    и передаёт тему приложению
 *
 * Сброс стилей `GlobalResetStyle` живёт отдельно в `@ui/reset`.
 */

import { createGlobalStyle } from 'styled-components';

import './fonts/inter.css';

/**
 * ThemeColors — представляет цветовую палитру темы.
 * Содержит цветовые роли для элементов интерфейса.
 *
 * @property background — фон страницы
 * @property surface — фон карточек и поверхностей
 * @property default — основной цвет текста
 * @property muted — второстепенный цвет текста
 * @property inverse — контрастный текст на цветной заливке, например на кнопке или плашке
 * @property primary — акцентный цвет бренда
 * @property danger — цвет ошибок и опасных действий
 * @property success — цвет успешных действий
 * @property warning — цвет предупреждений
 * @property border — цвет рамок и разделителей
 * @property focusRing — цвет кольца фокуса
 * @property invalidRing — цвет кольца для невалидных полей
 * @property scrollbarThumb — цвет бегунка скроллбара
 */
export type ThemeColors = {
  background: string;
  border: string;
  danger: string;
  default: string;
  focusRing: string;
  invalidRing: string;
  inverse: string;
  muted: string;
  primary: string;
  scrollbarThumb: string;
  success: string;
  surface: string;
  warning: string;
};

/**
 * AppTheme — представляет тему приложения.
 * Включает в себя цветовую схему, цвета и тени.
 *
 * @property colorScheme — режим темы для нативной части браузера
 * @property colors — объект с цветами текущей темы
 * @property shadow.surface — тень для поверхностей, используется в `box-shadow`
 */
export type AppTheme = {
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
  shadow: {
    surface: string;
  };
};

/**
 * DISABLED_OPACITY — задаёт прозрачность disabled-элементов.
 * Используется в стилях кнопок, полей ввода и других контролов.
 */
export const DISABLED_OPACITY = 0.55;

/**
 * lightColors — представляет цветовую палитру для светлой темы.
 * Все значения — hex-коды или CSS-функции, например `color-mix`.
 * Названия оттенков в inline-комментариях взяты из словаря https://get-color.ru/
 */
// prettier-ignore
const lightColors: ThemeColors = {
  background:     '#f3f4f6',                                        // Дымчато-белый
  border:         '#e5e4e2',                                        // Платиновый
  danger:         '#d53032',                                        // Клубнично-красный
  default:        '#1a162a',                                        // Темный пурпурно-синий
  focusRing:      'color-mix(in srgb, #1a73e8 35%, transparent)',
  invalidRing:    'color-mix(in srgb, #d93025 35%, transparent)',
  inverse:        '#f9fafb',                                        // Белоснежный
  muted:          '#606e8c',                                        // Голубино-синий
  primary:        '#1974d2',                                        // Темно-синий Крайола
  scrollbarThumb: '#c1caca',                                        // Очень бледный синий
  success:        '#177245',                                        // Темный весенне-зеленый
  surface:        '#ffffff',                                        // Белый
  warning:        '#ea7500',                                        // Темный мандарин
};

/**
 * darkColors — представляет цветовую палитру для тёмной темы.
 * Все значения — hex-коды или CSS-функции, например `color-mix`.
 * Названия оттенков в inline-комментариях взяты из словаря https://get-color.ru/
 */
// prettier-ignore
const darkColors: ThemeColors = {
  background:     '#131313',                                        // Почти черный
  border:         '#2f353b',                                        // Гранитовый серый
  danger:         '#e34234',                                        // Китайский красный
  default:        '#f9fafb',                                        // Белоснежный
  focusRing:      'color-mix(in srgb, #1a73e8 42%, transparent)',
  invalidRing:    'color-mix(in srgb, #ea4335 42%, transparent)',
  inverse:        '#f9fafb',                                        // Белоснежный
  muted:          '#b0b7c6',                                        // Кадетский синий Крайола
  primary:        '#1974d2',                                        // Темно-синий Крайола
  scrollbarThumb: '#414a4c',                                        // Космос
  success:        '#2e8b57',                                        // Зеленое море
  surface:        '#161a1e',                                        // Черновато-синий
  warning:        '#f9ab00',                                        // Дынно-желтый
};

/**
 * styledLightTheme — представляет готовую светлую тему приложения.
 * Содержит цветовую схему, все цвета и тени.
 */
export const styledLightTheme: AppTheme = {
  colorScheme: 'light',
  colors: { ...lightColors },
  shadow: {
    surface:
      '0 1px 2px rgb(15 23 42 / 10%), 0 2px 4px rgb(15 23 42 / 12%), 0 4px 12px -4px rgb(15 23 42 / 10%)',
  },
};

/**
 * styledDarkTheme — представляет готовую тёмную тему приложения.
 * Содержит цветовую схему и все цвета. Тени отключены.
 */
export const styledDarkTheme: AppTheme = {
  colorScheme: 'dark',
  colors: { ...darkColors },
  shadow: {
    surface: 'none',
  },
};

/**
 * getTheme — возвращает текущую тему.
 * Оборачивает `props.theme`, чтобы избежать прямого обращения к свойству.
 * Используется в CSS-шаблонах для доступа к значениям темы.
 *
 * @param props — объект с полем `theme` из styled-components
 * @returns текущая тема `AppTheme`
 *
 * @example
 * const StyledDiv = styled.div`
 *   color: ${(props) => getTheme(props).colors.default};
 * `;
 */
export function getTheme(props: { theme: AppTheme }): AppTheme {
  return props.theme;
}

/**
 * GlobalThemeStyle — задаёт глобальные стили, зависящие от темы.
 * Подключается в `ThemeProvider` из `src/context/theme/index.tsx`:
 * сначала `GlobalResetStyle` из `@ui/reset`, затем `GlobalThemeStyle`.
 *
 * Устанавливает:
 *  - `color-scheme` — для нативной части браузера: скроллбар, выделение
 *  - `background-color` и `color` для `<body>` — из текущей темы
 *  - шрифт `Inter` как основной с системными fallback-шрифтами. Локальные файлы
 *    шрифта живут в `ui/fonts/` и подключаются через `import './fonts/inter.css'`.
 *    Курсивные начертания подключены отдельными `@font-face` с `font-style: italic`
 */
export const GlobalThemeStyle = createGlobalStyle`
  :root {
    color-scheme: ${(props) => getTheme(props).colorScheme};
  }

  body {
    background-color: ${(props) => getTheme(props).colors.background};
    color: ${(props) => getTheme(props).colors.default};
    font-family:
      'Inter',
      -apple-system,
      system-ui,
      blinkmacsystemfont,
      'Helvetica Neue',
      sans-serif;
  }
`;

/**
 * Расширение `DefaultTheme` для styled-components.
 *
 * Объявляет, что `DefaultTheme` имеет структуру `AppTheme`.
 * Это позволяет TypeScript правильно типизировать `props.theme` в styled-components.
 *
 * Сделано по официальной документации styled-components v6:
 * https://styled-components.com/docs/api#create-a-declarations-file
 *
 * Блок запрещён к изменению.
 */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- интерфейс-алиас без собственных полей
  export interface DefaultTheme extends AppTheme {}
}
