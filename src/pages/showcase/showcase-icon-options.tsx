/**
 * Файл: `src/pages/showcase/showcase-icon-options.tsx`
 * Определяет опции выбора иконок для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Связать ключи иконок с функциями рендеринга в `ICONS`
 * 2. Типизировать ключи иконок через `IconKey`
 * 3. Предоставить функции `formatIconLabel` и `getIcon`
 * 4. Предоставить опции `LIST_OPTIONS` и `COMBOBOX_OPTIONS` для Listbox и Combobox
 *
 * Потребители:
 *  - `src/pages/showcase/button-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/icon-button-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/segment-button-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/card-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/combobox-settings/index.tsx` — использует `LIST_OPTIONS` для поля Value
 *  - `src/pages/showcase/index.tsx` — подставляет иконки в превью Combobox
 */

import { type ReactNode } from 'react';

import {
  AddCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  UploadIcon,
} from '@icons';
import { type ComboboxOption } from '@ui/combobox';
import { type ListboxOption } from '@ui/listbox';

/**
 * ICONS — связывает ключи иконок с функциями рендеринга React-узлов.
 * Соответствие приватно для модуля, доступ к иконкам — только через `getIcon`.
 */
const ICONS = {
  'add-circle': () => <AddCircleIcon />,
  close: () => <CloseIcon />,
  'chevron-down': () => <ChevronDownIcon />,
  'chevron-up': () => <ChevronUpIcon />,
  copy: () => <CopyIcon />,
  download: () => <DownloadIcon />,
  upload: () => <UploadIcon />,
  search: () => <SearchIcon />,
  settings: () => <SettingsIcon />,
  'sign-out': () => <SignOutIcon />,
} satisfies Record<string, () => ReactNode>;

/**
 * IconKey — представляет доступные ключи иконок витрины дизайн-системы.
 */
export type IconKey = keyof typeof ICONS;

/**
 * formatIconLabel — преобразует ключ иконки в читаемую подпись.
 *
 * @param key ключ иконки
 * @returns подпись с заглавной первой буквой
 */
export function formatIconLabel(key: IconKey): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * getIcon — возвращает React-узел иконки по ключу.
 *
 * @param key ключ иконки
 * @returns React-узел иконки
 */
export function getIcon(key: IconKey): ReactNode {
  return ICONS[key]();
}

/**
 * LIST_OPTIONS — формирует опции Listbox с подписью без иконки из ключей `ICONS`.
 * Используется в настройках Combobox для поля Value и в превью Combobox без иконок.
 */
export const LIST_OPTIONS: ListboxOption[] = Object.keys(ICONS).map((key) => ({
  label: formatIconLabel(key as IconKey),
  value: key,
}));

/**
 * COMBOBOX_OPTIONS — формирует опции Combobox с иконкой и подписью из ключей `ICONS`.
 * Используется в выборе иконки в настройках Button, IconButton, SegmentButton и Card
 * и в превью Combobox с иконками.
 */
export const COMBOBOX_OPTIONS: ComboboxOption[] = Object.keys(ICONS).map((key) => ({
  icon: getIcon(key as IconKey),
  label: formatIconLabel(key as IconKey),
  value: key,
}));
