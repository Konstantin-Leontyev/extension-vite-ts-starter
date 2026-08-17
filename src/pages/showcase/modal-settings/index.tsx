/**
 * Файл: `src/pages/showcase/modal-settings/index.tsx`
 * Определяет панель настроек компонента Modal в витрине дизайн-системы.
 * Содержит контролы для изменения размера, фона, заголовка и подзаголовка
 * в реальном времени. Не настраивает тело модального окна: превью передаёт
 * витринный плейсхолдер через `children`.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ModalWidgetState`
 * 2. Экспортировать компонент `ModalSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Modal
 */

import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type SurfaceBackground } from '@ui/surface';
import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';

import { BackgroundListbox } from '../background-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * ModalWidgetState — представляет состояние настроек компонента Modal в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Modal, кроме витринного ключа:
 * `sizePreset` задаёт ширину через `inlineSize` в родительской витрине.
 * Пустая строка заголовка или подзаголовка означает вызов без пропа. Отметка `Set*`
 * живёт внутри TextGroup.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Modal.
 *
 * @property background — заливка поверхности
 * @property sizePreset — витринный ключ ширины панели. Витрина переводит его в `inlineSize` для Modal
 * @property subtitle — подзаголовок
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleItalic — включает курсив подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property title — заголовок
 * @property titleAlign — выравнивание заголовка
 * @property titleItalic — включает курсив заголовка
 * @property titleSizePreset — размер заголовка
 * @property titleTone — тон заголовка
 */
export type ModalWidgetState = {
  background: SurfaceBackground;
  sizePreset: SizePreset;
  subtitle: string;
  subtitleAlign?: TextAlignPreset;
  subtitleItalic: boolean;
  subtitleSizePreset?: TextSizePreset;
  subtitleTone: TextTone;
  title: string;
  titleAlign?: TextAlignPreset;
  titleItalic: boolean;
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
        set
        size={state.titleSizePreset}
        tones={[
          {
            value: state.titleTone,
            onChange: (tone) => onChange('titleTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onItalicChange={(value) => onChange('titleItalic', value)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
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
        set
        size={state.subtitleSizePreset}
        tones={[
          {
            value: state.subtitleTone,
            onChange: (tone) => onChange('subtitleTone', tone),
          },
        ]}
        onAlignChange={(align) => onChange('subtitleAlign', align)}
        onItalicChange={(value) => onChange('subtitleItalic', value)}
        onSizeChange={(size) => onChange('subtitleSizePreset', size)}
      />
    </StyledSettingsForm>
  );
}
