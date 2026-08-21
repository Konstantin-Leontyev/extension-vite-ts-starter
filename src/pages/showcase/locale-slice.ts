/**
 * Файл: `src/pages/showcase/locale-slice.ts`
 * Содержит срез из 10 кодов языков для превью LocalePicker и Toolbar в витрине.
 *
 * Основные задачи:
 * 1. Хранить коды среза в `LOCALE_SLICE_CODES`
 * 2. Предоставить опции `LOCALE_SLICE_OPTIONS`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — передаёт срез в превью LocalePicker и в слот Toolbar
 */

import { getLocaleOptions } from '@ui/locale-picker';

/**
 * LOCALE_SLICE_CODES — задаёт перечень из 10 кодов языков витрины.
 * Перечень приватен для модуля, доступ к опциям — только через `LOCALE_SLICE_OPTIONS`.
 */
const LOCALE_SLICE_CODES = Object.freeze([
  'en',
  'ru',
  'de',
  'fr',
  'es',
  'ja',
  'zh',
  'ar',
  'pt',
  'ko',
] as const);

/**
 * LOCALE_SLICE_OPTIONS — формирует опции LocalePicker из `LOCALE_SLICE_CODES`.
 * Используется в превью LocalePicker и слоте Toolbar в `src/pages/showcase/index.tsx`.
 */
export const LOCALE_SLICE_OPTIONS = getLocaleOptions(LOCALE_SLICE_CODES);
