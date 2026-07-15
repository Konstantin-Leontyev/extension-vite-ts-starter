/**
 * Файл: `src/pages/design-system/modal-settings/index.tsx`
 * Определяет панель настроек компонента Modal в витрине дизайн-системы.
 * Содержит контролы для изменения размера, фона, заголовка, подзаголовка
 * и текста тела в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ModalWidgetState`
 * 2. Экспортировать компонент `ModalSettings`
 *
 * Потребители:
 *  - `src/pages/design-system/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Modal
 */

import { type CSSProperties, type ChangeEvent } from 'react';

import { type CardBackground } from '@ui/card';
import { Checkbox } from '@ui/checkbox';
import { Input } from '@ui/input';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type TextSizePreset, type TextTone } from '@ui/text';

import { BackgroundListbox } from '../background-listbox';
import { StyledSettingsForm } from '../design-system.styles';
import { HeadingGroup } from '../heading-group';
import { SizeListbox } from '../size-listbox';

/**
 * ModalWidgetState — представляет состояние настроек компонента Modal в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Modal, кроме витринных ключей:
 * `showSubtitle` управляет передачей подзаголовка в превью, `sizePreset` задаёт ширину
 * через `inlineSize` в родительской витрине, `text` хранит содержимое `children`.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Modal.
 *
 * @property background — заливка карточки
 * @property showSubtitle — витринный ключ показа подзаголовка. Выключенный — в превью остаётся только заголовок
 * @property sizePreset — витринный ключ ширины панели. Витрина переводит его в `inlineSize` для Modal
 * @property subtitle — подзаголовок
 * @property subtitleAlign — выравнивание подзаголовка
 * @property subtitleSizePreset — размер подзаголовка
 * @property subtitleTone — тон подзаголовка
 * @property text — содержимое тела модального окна
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
  subtitleAlign: CSSProperties['textAlign'];
  subtitleSizePreset: TextSizePreset;
  subtitleTone: TextTone;
  text: string;
  title: string;
  titleAlign: CSSProperties['textAlign'];
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
        value={state.background}
        onChange={(background) => onChange('background', background)}
      />

      <HeadingGroup
        align={state.titleAlign}
        labelPrefix="Title"
        size={state.titleSizePreset}
        text={state.title}
        tone={state.titleTone}
        onAlignChange={(align) => onChange('titleAlign', align)}
        onSizeChange={(size) => onChange('titleSizePreset', size)}
        onTextChange={(text) => onChange('title', text)}
        onToneChange={(tone) => onChange('titleTone', tone)}
      />

      <Checkbox
        checked={state.showSubtitle}
        sizePreset="medium"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('showSubtitle', event.target.checked)
        }
      >
        Show subtitle
      </Checkbox>

      {state.showSubtitle && (
        <HeadingGroup
          align={state.subtitleAlign}
          labelPrefix="Subtitle"
          size={state.subtitleSizePreset}
          text={state.subtitle}
          tone={state.subtitleTone}
          onAlignChange={(align) => onChange('subtitleAlign', align)}
          onSizeChange={(size) => onChange('subtitleSizePreset', size)}
          onTextChange={(text) => onChange('subtitle', text)}
          onToneChange={(tone) => onChange('subtitleTone', tone)}
        />
      )}

      <Input
        label="Text:"
        reserveErrorSpace={false}
        value={state.text}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange('text', event.target.value)
        }
      />
    </StyledSettingsForm>
  );
}
