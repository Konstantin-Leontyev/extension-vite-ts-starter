/**
 * Файл: `src/pages/showcase/sidebar-settings/index.tsx`
 * Определяет панель настроек компонента Sidebar в витрине дизайн-системы.
 * Содержит контролы для изменения рамки и тени, фона, заголовка, подзаголовка,
 * рамки и тени действий, набора действий и открытого состояния в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `SidebarWidgetState`
 * 2. Экспортировать компонент `SidebarSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета боковой панели
 */

import { type ChangeEvent } from 'react';

import { CARD_HEADER_ACTION_SIZE_PRESET } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { getIconPadding } from '@ui/icon';
import { type SurfaceBackgroundPreset } from '@ui/surface';
import {
  type TextAlignPreset,
  type TextSizePreset,
  type TextTonePreset,
} from '@ui/text';
import { type TonePreset } from '@ui/tones';

import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { IconRowGroup, type IconRowGroupAction } from '../icon-row-group';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * SidebarWidgetState — представляет состояние настроек компонента Sidebar в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Sidebar.
 * `headerActions` хранит демо-ряд действий с ключом иконки, подсказкой, отступом окна
 * Icon и флагами `active` и `disabled` вместо `ReactNode` и обработчика.
 * Пустая строка заголовка или подзаголовка означает вызов без пропа. Отметка `Set*`
 * живёт внутри TextGroup.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Sidebar.
 *
 * @property background — заливка панели
 * @property borderTone — тон рамки
 * @property headerActions — демо-ряд действий шапки
 * @property open — включает открытое состояние панели
 * @property showActionBorder — включает рамку действий шапки
 * @property showActionShadow — включает тень действий шапки при включённой рамке
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 * @property subtitle — подзаголовок
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleItalic — включает курсив подзаголовка
 * @property subtitleSize — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleItalic — включает курсив заголовка
 * @property titleSize — размер заголовка
 * @property titleTone — тон заголовка
 */
export type SidebarWidgetState = {
  background: SurfaceBackgroundPreset;
  borderTone: TonePreset;
  headerActions: IconRowGroupAction[];
  open: boolean;
  showActionBorder: boolean;
  showActionShadow: boolean;
  showBorder: boolean;
  showShadow: boolean;
  subtitle: string;
  subtitleAlign?: TextAlignPreset;
  subtitleItalic: boolean;
  subtitleSize?: TextSizePreset;
  subtitleTone: TextTonePreset;
  title: string;
  titleAlign?: TextAlignPreset;
  titleItalic: boolean;
  titleSize: TextSizePreset;
  titleTone: TextTonePreset;
};

/**
 * SidebarSettingsProps — представляет пропсы компонента SidebarSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек боковой панели
 */
type SidebarSettingsProps = {
  onChange: <K extends keyof SidebarWidgetState>(
    key: K,
    value: SidebarWidgetState[K]
  ) => void;
  state: SidebarWidgetState;
};

/**
 * SidebarSettings — отображает панель настроек Sidebar в витрине дизайн-системы.
 *
 * @example
 * <SidebarSettings state={sidebar} onChange={updateSidebar} />
 */
export function SidebarSettings({ onChange, state }: SidebarSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <BorderGroup
        borderTone={state.borderTone}
        showBorder={state.showBorder}
        showShadow={state.showShadow}
        onBorderToneChange={(tone) => onChange('borderTone', tone)}
        onShowBorderChange={(show) => onChange('showBorder', show)}
        onShowShadowChange={(show) => onChange('showShadow', show)}
      />

      <BackgroundListbox
        label="Background:"
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      <TextGroup
        align={state.titleAlign}
        contents={[
          {
            value: state.title,
            onChange: (value) => onChange('title', value),
          },
        ]}
        italic={state.titleItalic}
        labelPrefix="Title"
        size={state.titleSize}
        tones={[
          {
            value: state.titleTone,
            onChange: (tone) => onChange('titleTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onItalicChange={(value) => onChange('titleItalic', value)}
        onSizeChange={(size) => onChange('titleSize', size)}
      />

      <TextGroup
        align={state.subtitleAlign}
        contents={[
          {
            value: state.subtitle,
            onChange: (value) => onChange('subtitle', value),
          },
        ]}
        italic={state.subtitleItalic}
        labelPrefix="Subtitle"
        size={state.subtitleSize}
        tones={[
          {
            value: state.subtitleTone,
            onChange: (tone) => onChange('subtitleTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('subtitleAlign', align)}
        onItalicChange={(value) => onChange('subtitleItalic', value)}
        onSizeChange={(size) => onChange('subtitleSize', size)}
      />

      <Checkbox
        checked={state.showActionBorder}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showActionBorder', event.target.checked)
        }
      >
        Show action border
      </Checkbox>

      {state.showActionBorder && (
        <Checkbox
          checked={state.showActionShadow}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChange('showActionShadow', event.target.checked)
          }
        >
          Show action shadow
        </Checkbox>
      )}

      <IconRowGroup
        actions={state.headerActions}
        defaultIconPadding={getIconPadding(CARD_HEADER_ACTION_SIZE_PRESET)}
        onActionsChange={(actions) => onChange('headerActions', actions)}
      />

      <Checkbox
        checked={state.open}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('open', event.target.checked)
        }
      >
        Open
      </Checkbox>
    </StyledSettingsForm>
  );
}
