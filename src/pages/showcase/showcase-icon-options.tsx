/**
 * Файл: `src/pages/showcase/showcase-icon-options.tsx`
 * Определяет опции выбора иконок для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Связать ключи иконок с функциями рендеринга в `ICONS`
 * 2. Типизировать ключи иконок через `IconKey`
 * 3. Предоставить функцию `getIcon`
 * 4. Предоставить функцию `resolveIconPaddingSizePreset`
 * 5. Предоставить опции `LIST_OPTIONS` и `COMBOBOX_OPTIONS`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают иконку через `COMBOBOX_OPTIONS`:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *  - панель Icon и сателлит IconRowGroup — выбирают иконку через `COMBOBOX_OPTIONS`
 *    и ключ ряда отступа через `resolveIconPaddingSizePreset`:
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/icon-row-group/index.tsx`
 *  - `src/pages/showcase/index.tsx` — подставляет глифы через `getIcon`, опции превью Combobox
 *    через `LIST_OPTIONS` и `COMBOBOX_OPTIONS`
 */

import { type ReactNode } from 'react';

import {
  AddCircleIcon,
  CaptionIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  DualIcon,
  EarthIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  UploadIcon,
} from '@icons';
import { type ComboboxOption } from '@ui/combobox';
import { ICON_SIZE_PRESET_KEYS, getIconPadding, type IconSizePreset } from '@ui/icon';
import { type SpacingValue } from '@ui/spacing';

/**
 * ICONS — связывает ключи иконок с функциями рендеринга React-узлов.
 * Соответствие приватно для модуля, доступ к иконкам — только через `getIcon`.
 */
const ICONS = {
  'add-circle': () => <AddCircleIcon />,
  caption: () => <CaptionIcon />,
  close: () => <CloseIcon />,
  'chevron-down': () => <ChevronDownIcon />,
  'chevron-up': () => <ChevronUpIcon />,
  clock: () => <ClockIcon />,
  copy: () => <CopyIcon />,
  download: () => <DownloadIcon />,
  dual: () => <DualIcon />,
  earth: () => <EarthIcon />,
  plus: () => <PlusIcon />,
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
 * resolveIconPaddingSizePreset — возвращает ключ размерного ряда под текущий
 * отступ окна.
 * Если отступ совпадает с мостом от `sizePreset` — возвращает его.
 * Иначе берёт первый ключ ряда, у которого `getIconPadding` даёт то же значение.
 *
 * @param padding текущий отступ окна Icon
 * @param sizePreset предпочтительный ключ ряда, если отступ совпадает с его мостом
 * @returns ключ ряда для контрола отступа окна Icon
 */
export function resolveIconPaddingSizePreset(
  padding: SpacingValue,
  sizePreset: IconSizePreset
): IconSizePreset {
  if (getIconPadding(sizePreset) === padding) {
    return sizePreset;
  }

  return (
    ICON_SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === padding) ?? sizePreset
  );
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
 * Используется в выборе иконки в настройках Button, Icon, SearchField, SegmentButton
 * и IconRowGroup и в превью Combobox с иконками.
 */
export const COMBOBOX_OPTIONS: readonly ComboboxOption[] = Object.freeze(
  Object.keys(ICONS).map((key) => ({
    icon: getIcon(key as IconKey),
    label: resolveIconLabel(key as IconKey),
    value: key,
  }))
);
