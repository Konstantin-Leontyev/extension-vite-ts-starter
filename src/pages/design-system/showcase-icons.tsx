import { type ReactNode } from 'react';

import { ChevronDownIcon } from '@icons/chevron-down';
import { ChevronUpIcon } from '@icons/chevron-up';
import { CloseIcon } from '@icons/close';
import { CopyIcon } from '@icons/copy';
import { DownloadIcon } from '@icons/download';
import { SearchIcon } from '@icons/search';
import { SettingsIcon } from '@icons/settings';
import { SignOutIcon } from '@icons/sign-out';
import { UploadIcon } from '@icons/upload';
import { type ComboboxOption } from '@ui/combobox';
import { type ListboxOption } from '@ui/listbox';

/** Иконки, доступные для выбора в витрине ДС (Button, RoundButton, Combobox option icon). */
export type ShowcaseIconKey =
  | 'chevron-down'
  | 'chevron-up'
  | 'close'
  | 'copy'
  | 'download'
  | 'search'
  | 'settings'
  | 'sign-out'
  | 'upload';

export const SHOWCASE_ICON_OPTIONS: ListboxOption[] = [
  { label: 'close', value: 'close' },
  { label: 'chevron-down', value: 'chevron-down' },
  { label: 'chevron-up', value: 'chevron-up' },
  { label: 'copy', value: 'copy' },
  { label: 'download', value: 'download' },
  { label: 'upload', value: 'upload' },
  { label: 'search', value: 'search' },
  { label: 'settings', value: 'settings' },
  { label: 'sign-out', value: 'sign-out' },
];

const SHOWCASE_ICON_RENDERERS: Record<ShowcaseIconKey, () => ReactNode> = {
  close: () => <CloseIcon />,
  'chevron-down': () => <ChevronDownIcon />,
  'chevron-up': () => <ChevronUpIcon />,
  copy: () => <CopyIcon />,
  download: () => <DownloadIcon />,
  upload: () => <UploadIcon />,
  search: () => <SearchIcon />,
  settings: () => <SettingsIcon />,
  'sign-out': () => <SignOutIcon />,
};

export function formatShowcaseIconLabel(key: ShowcaseIconKey): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function renderShowcaseIcon(key: ShowcaseIconKey): ReactNode {
  return SHOWCASE_ICON_RENDERERS[key]();
}

/** Combobox-опции showcase-иконок: подпись + слот `icon` (Button, RoundButton, Combobox в ДС). */
export const SHOWCASE_ICON_COMBOBOX_OPTIONS: ComboboxOption[] =
  SHOWCASE_ICON_OPTIONS.map(({ value }) => {
    const iconKey = value as ShowcaseIconKey;

    return {
      icon: renderShowcaseIcon(iconKey),
      label: formatShowcaseIconLabel(iconKey),
      value,
    };
  });

export function isShowcaseIconKey(value: string): value is ShowcaseIconKey {
  return Object.hasOwn(SHOWCASE_ICON_RENDERERS, value);
}
