/**
 * Файл: pages/design-system/showcase-icon-options.tsx
 * Утилиты для работы с иконками в витрине дизайн-системы.
 *
 * Основные задачи:
 * 1. Предоставить карту иконок для рендеринга
 * 2. Предоставить опции для Listbox (без иконки) и Combobox (с иконкой)
 *
 * Потребители: страницы дизайн-системы (настройки Button, RoundButton, Card, Combobox).
 */

import { type ReactNode } from 'react';

import {
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
 * ICONS — карта иконок по ключу.
 * Единственный источник истины для списка доступных иконок.
 */
const ICONS = {
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

/** Доступные иконки для выбора в витрине ДС. */
export type IconKey = keyof typeof ICONS;

/**
 * formatIconLabel — форматирует ключ иконки в читаемый лейбл.
 *
 * @param key — ключ иконки
 * @returns лейбл с заглавной буквы
 */
export function formatIconLabel(key: IconKey): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * getIcon — возвращает React-узел иконки по ключу.
 *
 * @param key — ключ иконки
 * @returns React-узел иконки
 */
export function getIcon(key: IconKey): ReactNode {
  return ICONS[key]();
}

/**
 * LIST_OPTIONS — опции для Listbox: только подпись.
 * Используется в настройках Combobox (поле Value)
 * и в превью Combobox без иконок (`withIcon: false`) как `ComboboxOption[]`.
 */
export const LIST_OPTIONS: ListboxOption[] = Object.keys(ICONS).map((key) => ({
  label: formatIconLabel(key as IconKey),
  value: key,
}));

/**
 * COMBOBOX_OPTIONS — опции для Combobox: иконка + подпись.
 * Используется в пикере иконки (Button, RoundButton, Card)
 * и в превью Combobox с иконками (`withIcon: true`).
 */
export const COMBOBOX_OPTIONS: ComboboxOption[] = Object.keys(ICONS).map((key) => ({
  icon: getIcon(key as IconKey),
  label: formatIconLabel(key as IconKey),
  value: key,
}));
