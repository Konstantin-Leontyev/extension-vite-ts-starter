/**
 * Файл: theme.ts
 * Этот файл определяет систему тем для приложения.
 * Содержит цветовые палитры для светлой и тёмной тем, тени, глобальные стили
 * и вспомогательные утилиты для работы с темой в styled-components.
 *
 * Основные задачи:
 * 1. Определить типы ThemeColors и AppTheme
 * 2. Предоставить готовые объекты styledLightTheme и styledDarkTheme
 * 3. Обеспечить доступ к текущей теме через getTheme
 * 4. Задать глобальные стили через GlobalThemeStyle
 * 5. Расширить DefaultTheme для корректной работы с TypeScript
 */

import { createGlobalStyle } from 'styled-components';

import './fonts/inter.css';

/**
 * ThemeColors — тип, описывающий все цвета в теме.
 * Содержит роли цветов для различных элементов интерфейса.
 *
 * Категории цветов:
 * - background / surface — фон страницы и карточек
 * - default / muted — текст на нейтральном фоне
 * - inverse — контрастный текст на цветной заливке (кнопка, плашка)
 * - primary — основной акцентный цвет бренда
 * - danger, success, warning — статусные цвета для уведомлений
 * - border — цвет рамок и разделителей
 * - focusRing / invalidRing — цвета для колец фокуса
 * - scrollbarThumb — цвет бегунка скроллбара
 *
 * Названия оттенков в комментариях приведены по словарю https://get-color.ru/
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
 * AppTheme — основной тип темы приложения.
 * Включает в себя цветовую схему (colorScheme), цвета и тени.
 *
 * @property colorScheme — режим темы ('light' | 'dark') для нативной части браузера
 * @property colors — объект с цветами из ThemeColors
 * @property shadow — тени для различных элементов (например, surface)
 */
export type AppTheme = {
  /** Режим темы для нативной хром-части (скроллбар и т.п.) через CSS color-scheme. */
  colorScheme: 'light' | 'dark';
  colors: ThemeColors;
  shadow: {
    surface: string;
  };
};

/**
 * lightColors — цветовая палитра для светлой темы.
 * Все значения — hex-коды или CSS-функции (color-mix).
 * Названия оттенков в inline-комментариях взяты из словаря get-color.ru.
 */
const lightColors: ThemeColors = {
  background: '#f3f4f6',     // Дымчато-белый
  border: '#e5e4e2',         // Платиновый
  danger: '#d53032',         // Клубнично-красный
  default: '#1a162a',        // Темный пурпурно-синий
  focusRing: 'color-mix(in srgb, #1a73e8 35%, transparent)',
  invalidRing: 'color-mix(in srgb, #d93025 35%, transparent)',
  inverse: '#f9fafb',        // Белоснежный
  muted: '#606e8c',          // Голубино-синий
  primary: '#1974d2',        // Темно-синий Крайола
  scrollbarThumb: '#c1caca', // Очень бледный синий
  success: '#177245',        // Темный весенне-зеленый
  surface: '#ffffff',        // Белый
  warning: '#ea7500',        // Темный мандарин
};

/**
 * darkColors — цветовая палитра для тёмной темы.
 * Подобрана так, чтобы сохранять контрастность и читаемость.
 */
const darkColors: ThemeColors = {
  background: '#131313',     // Почти черный
  border: '#2f353b',         // Гранитовый серый
  danger: '#e34234',         // Китайский красный
  default: '#f9fafb',        // Белоснежный
  focusRing: 'color-mix(in srgb, #1a73e8 42%, transparent)',
  invalidRing: 'color-mix(in srgb, #ea4335 42%, transparent)',
  inverse: '#f9fafb',        // Белоснежный
  muted: '#b0b7c6',          // Кадетский синий Крайола
  primary: '#1974d2',        // Темно-синий Крайола
  scrollbarThumb: '#414a4c', // Космос
  success: '#2e8b57',        // Зеленое море
  surface: '#161a1e',        // Черновато-синий
  warning: '#f9ab00',        // Дынно-желтый
};

/**
 * styledLightTheme — готовая светлая тема для использования в приложении.
 * Содержит цветовую схему 'light', все цвета и тени.
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
 * styledDarkTheme — готовая тёмная тема для использования в приложении.
 * Содержит цветовую схему 'dark', все цвета и отключённые тени (none).
 */
export const styledDarkTheme: AppTheme = {
  colorScheme: 'dark',
  colors: { ...darkColors },
  shadow: {
    surface: 'none',
  },
};

/**
 * getTheme — вспомогательная функция для получения текущей темы в styled-components.
 *
 * Используется в CSS-шаблонах для доступа к значениям темы.
 * Оборачивает props.theme, чтобы избежать прямого обращения к свойству.
 *
 * @param props — объект с полем theme (из styled-components)
 * @returns текущий объект AppTheme
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
 * DISABLED_OPACITY — единый источник значения прозрачности для disabled-элементов.
 * Используется для кнопок, полей ввода и других контролов.
 */
export const DISABLED_OPACITY = 0.55;

/**
 * GlobalThemeStyle — глобальные стили, зависящие от темы.
 * Подключается в ThemeProvider после GlobalResetStyle (`context/theme/index.tsx`).
 *
 * Устанавливает:
 * - color-scheme — для нативной части браузера (скроллбар, выделение)
 * - background-color и color для body — из текущей темы
 * - Шрифт Inter (локальные файлы в ui/fonts/, import './fonts/inter.css') как основной,
 *   с системными fallback-шрифтами
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
 * Расширение DefaultTheme для styled-components.
 *
 * Объявляет, что DefaultTheme (используемый в ThemeProvider) имеет структуру AppTheme.
 * Это позволяет TypeScript правильно типизировать props.theme в styled-components.
 *
 * Сделано по официальной документации styled-components v6:
 * https://styled-components.com/docs/api#create-a-declarations-file
 */
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- интерфейс-алиас без собственных полей
  export interface DefaultTheme extends AppTheme {}
}
