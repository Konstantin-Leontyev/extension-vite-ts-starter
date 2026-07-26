/**
 * Файл: `src/pages/showcase/modal-settings/index.tsx`
 * Определяет панель настроек компонента Modal в витрине дизайн-системы.
 * Содержит контролы для изменения размера, фона, заголовка и подзаголовка
 * в реальном времени. Тело модального окна — `children`, панелью не настраивается:
 * превью передаёт витринный плейсхолдер.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ModalWidgetState`
 * 2. Экспортировать компонент `ModalSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Modal
 */

import { type ChangeEvent } from 'react';

import { type CardBackground } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';

import { BackgroundListbox } from '../background-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TitleGroup } from '../title-group';

/**
 * ModalWidgetState — представляет состояние настроек компонента Modal в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Modal, кроме витринных ключей:
 * `showSubtitle` управляет передачей подзаголовка в превью, `sizePreset` задаёт ширину
 * через `inlineSize` в родительской витрине.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Modal.
 *
 * @property background — заливка карточки
 * @property showSubtitle — витринный ключ показа подзаголовка. Выключенный — в превью остаётся только заголовок
 * @property sizePreset — витринный ключ ширины панели. Витрина переводит его в `inlineSize` для Modal
 * @property subtitle — подзаголовок
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 */
export type ModalWidgetState = {
  background: CardBackground;
  showSubtitle: boolean;
  sizePreset: SizePreset;
  subtitle: string;
  subtitleAlign: TextAlignPreset;
  subtitleSizePreset: TextSizePreset;
  subtitleTone: TextTone;
  title: string;
  titleAlign: TextAlignPreset;
  titleSizePreset: TextSizePreset;
  titleTone: TextTone;
};

/**
 * ModalSettingsProps — представляет пропсы компонента ModalSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек модального окна
 */
type ModalSettingsProps = {
  onChange: <K extends keyof ModalWidgetState>(
    key: K,
    value: ModalWidgetState[K]
  ) => void;
  state: ModalWidgetState;
};

/**
 * ModalSettings — отображает панель настроек Modal в витрине дизайн-системы.
 *
 * @example
 * <ModalSettings state={modal} onChange={updateModal} />
 */
export function ModalSettings({ onChange, state }: ModalSettingsProps) {
  return (
    <StyledSettingsForm onSubmit={(event) => event.preventDefault()}>
      <SizeListbox
        label="Size:"
        sizes={SIZE_PRESET_KEYS}
        value={state.sizePreset}
        onChange={(size) => onChange('sizePreset', size)}
      />

      <BackgroundListbox
        label="Background:"
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      <TitleGroup
        align={state.titleAlign}
        labelPrefix="Title"
        size={state.titleSizePreset}
        title={state.title}
        tone={state.titleTone}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
        onTitleChange={(title) => onChange('title', title)}
        onToneChange={(tone) => onChange('titleTone', tone)}
      />

      <Checkbox
        checked={state.showSubtitle}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showSubtitle', event.target.checked)
        }
      >
        Show subtitle
      </Checkbox>

      {state.showSubtitle && (
        <TitleGroup
          align={state.subtitleAlign}
          labelPrefix="Subtitle"
          size={state.subtitleSizePreset}
          title={state.subtitle}
          tone={state.subtitleTone}
          onAlignChange={(align) => onChange('subtitleAlign', align)}
          onSizeChange={(size) => onChange('subtitleSizePreset', size)}
          onTitleChange={(title) => onChange('subtitle', title)}
          onToneChange={(tone) => onChange('subtitleTone', tone)}
        />
      )}
    </StyledSettingsForm>
  );
}
