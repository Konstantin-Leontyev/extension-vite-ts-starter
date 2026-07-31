/**
 * Файл: `src/pages/showcase/showcase-icon-options.tsx`
 * Определяет опции выбора иконок для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Связать ключи иконок с функциями рендеринга в `ICONS`
 * 2. Типизировать ключи иконок через `IconKey`
 * 3. Предоставить функцию `getIcon`
 * 4. Предоставить опции `LIST_OPTIONS` и `COMBOBOX_OPTIONS`
 *
 * Потребители:
 *  - `src/pages/showcase/button-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/icon-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/segment-button-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/card-settings/index.tsx` — выбирает иконку через `COMBOBOX_OPTIONS`
 *  - `src/pages/showcase/index.tsx` — подставляет глифы через `getIcon`, опции превью Combobox
 *    через `LIST_OPTIONS` и `COMBOBOX_OPTIONS`
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
 * resolveIconLabel — преобразует ключ иконки в читаемую подпись.
 *
 * @param key ключ иконки
 * @returns подпись с заглавной первой буквой
 */
function resolveIconLabel(key: IconKey): string {
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
 * LIST_OPTIONS — формирует опции с подписью без иконки из ключей `ICONS`.
 * Используется в превью Combobox без иконок в `src/pages/showcase/index.tsx`.
 */
export const LIST_OPTIONS: readonly ComboboxOption[] = Object.freeze(
  Object.keys(ICONS).map((key) => ({
    label: resolveIconLabel(key as IconKey),
    value: key,
  }))
);

/**
 * COMBOBOX_OPTIONS — формирует опции Combobox с иконкой и подписью из ключей `ICONS`.
 * Используется в выборе иконки в настройках Button, Icon, SegmentButton и Card
 * и в превью Combobox с иконками.
 */
export const COMBOBOX_OPTIONS: readonly ComboboxOption[] = Object.freeze(
  Object.keys(ICONS).map((key) => ({
    icon: getIcon(key as IconKey),
    label: resolveIconLabel(key as IconKey),
    value: key,
  }))
);
