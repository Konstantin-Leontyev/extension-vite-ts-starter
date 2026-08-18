/**
 * Файл: `src/pages/showcase/modal-settings/index.tsx`
 * Определяет панель настроек компонента Modal в витрине дизайн-системы.
 * Содержит контролы для изменения размера, рамки и тени, фона, заголовка,
 * подзаголовка и формы окна действия шапки в реальном времени. Не настраивает
 * тело модального окна: превью передаёт витринный плейсхолдер через `children`.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `ModalWidgetState`
 * 2. Экспортировать компонент `ModalSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Modal
 */

import { ICON_SHAPE_PRESET_KEYS, type IconShapePreset } from '@ui/icon';
import { SIZE_PRESET_KEYS, type SizePreset } from '@ui/presets';
import { type SurfaceBackground } from '@ui/surface';
import { type TextAlignPreset, type TextSizePreset, type TextTonePreset } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { SizeListbox } from '../size-listbox';
import { TextGroup } from '../text-group';

/**
 * ModalWidgetState — представляет состояние настроек компонента Modal в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Modal, кроме витринных ключей: `size`
 * управляет передачей `inlineSize` в превью.
 * Пустая строка заголовка или подзаголовка означает вызов без пропа. Отметка `Set*`
 * живёт внутри TextGroup.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Modal.
 *
 * @property actionShape — форма окна действия шапки
 * @property background — заливка поверхности
 * @property borderTone — тон рамки
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
 * @property size — витринный ключ ширины панели
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
export type ModalWidgetState = {
  actionShape: IconShapePreset;
  background: SurfaceBackground;
  borderTone: TonePreset;
  showBorder: boolean;
  showShadow: boolean;
  size: SizePreset;
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
        value={state.size}
        onChange={(size) => onChange('size', size)}
      />

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
        set
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
        set
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

      <ShapeListbox
        label="Action shape:"
        shapes={ICON_SHAPE_PRESET_KEYS}
        value={state.actionShape}
        onChange={(shape) => onChange('actionShape', shape)}
      />
    </StyledSettingsForm>
  );
}
