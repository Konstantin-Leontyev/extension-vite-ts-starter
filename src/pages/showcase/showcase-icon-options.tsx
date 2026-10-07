/**
 * Файл: `src/pages/showcase/showcase-icon-options.tsx`
 * Определяет опции выбора иконок для витрины дизайн-системы.
 *
 * Основные задачи:
 * 1. Связать ключи иконок с функциями рендеринга в `ICONS`
 * 2. Типизировать ключи иконок через `IconKey`
 * 3. Предоставить функцию `getIcon`
 * 4. Предоставить функцию `resolveIconPaddingSizePreset`
 * 5. Предоставить опции `LIST_OPTIONS` и `ICON_OPTIONS`
 *
 * Потребители:
 *  - панели настроек витрины — выбирают иконку через `ICON_OPTIONS`:
 *     - `src/pages/showcase/button-settings/index.tsx`
 *     - `src/pages/showcase/search-field-settings/index.tsx`
 *     - `src/pages/showcase/segment-button-settings/index.tsx`
 *  - панель Icon и сателлит IconRowGroup — выбирают иконку через `ICON_OPTIONS`
 *    и ключ ряда отступа через `resolveIconPaddingSizePreset`:
 *     - `src/pages/showcase/icon-settings/index.tsx`
 *     - `src/pages/showcase/icon-row-group/index.tsx`
 *  - `src/pages/showcase/icon-row-group/icon-row-group.ts` — собирает глиф действия
 *    через `getIcon`
 *  - `src/pages/showcase/index.tsx` — подставляет глифы через `getIcon`, опции превью Listbox
 *    через `LIST_OPTIONS` и `ICON_OPTIONS`
 */

import { type ReactNode } from 'react';

import {
  AddCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  DualIcon,
  EarthIcon,
  EpisodeIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  SubtitlesIcon,
  UploadIcon,
} from '@icons';
import { ICON_SIZE_PRESET_KEYS, getIconPadding, type IconSizePreset } from '@ui/icon';
import { type ListboxOption } from '@ui/listbox';
import { type SpacingValue } from '@ui/spacing';

/**
 * ICONS — связывает ключи иконок с функциями рендеринга React-узлов.
 * Соответствие приватно для модуля, доступ к иконкам — только через `getIcon`.
 */
const ICONS = {
  'add-circle': () => <AddCircleIcon />,
  close: () => <CloseIcon />,
  'chevron-down': () => <ChevronDownIcon />,
  'chevron-up': () => <ChevronUpIcon />,
  clock: () => <ClockIcon />,
  copy: () => <CopyIcon />,
  download: () => <DownloadIcon />,
  dual: () => <DualIcon />,
  earth: () => <EarthIcon />,
  episode: () => <EpisodeIcon />,
  plus: () => <PlusIcon />,
  upload: () => <UploadIcon />,
  search: () => <SearchIcon />,
  settings: () => <SettingsIcon />,
  'sign-out': () => <SignOutIcon />,
  subtitles: () => <SubtitlesIcon />,
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
 * Если отступ совпадает с мостом от `size` — возвращает его.
 * Иначе берёт первый ключ ряда, у которого `getIconPadding` даёт то же значение.
 *
 * @param padding текущий отступ окна Icon
 * @param size предпочтительный ключ ряда, если отступ совпадает с его мостом
 * @returns ключ ряда для контрола отступа окна Icon
 */
export function resolveIconPaddingSizePreset(
  padding: SpacingValue,
  size: IconSizePreset
): IconSizePreset {
  if (getIconPadding(size) === padding) {
    return size;
  }

  return ICON_SIZE_PRESET_KEYS.find((key) => getIconPadding(key) === padding) ?? size;
}

/**
 * LIST_OPTIONS — формирует опции с подписью без иконки из ключей `ICONS`.
 * Используется в превью Listbox без иконок в `src/pages/showcase/index.tsx`.
 */
export const LIST_OPTIONS: readonly ListboxOption[] = Object.freeze(
  Object.keys(ICONS).map((key) => ({
    label: resolveIconLabel(key as IconKey),
    value: key,
  }))
);

/**
 * ICON_OPTIONS — формирует опции Listbox с иконкой и подписью из ключей `ICONS`.
 * Используется в выборе иконки в настройках Button, Icon, SearchField, SegmentButton
 * и IconRowGroup и в превью Listbox с иконками.
 */
export const ICON_OPTIONS: readonly ListboxOption[] = Object.freeze(
  Object.keys(ICONS).map((key) => ({
    icon: getIcon(key as IconKey),
    label: resolveIconLabel(key as IconKey),
    value: key,
  }))
);
