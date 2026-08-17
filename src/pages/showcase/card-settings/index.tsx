/**
 * Файл: `src/pages/showcase/card-settings/index.tsx`
 * Определяет панель настроек компонента Card в витрине дизайн-системы.
 * Содержит контролы для изменения рамки и тени, фона, заголовка, подзаголовка,
 * формы действий шапки и набора действий в реальном времени.
 *
 * Основные задачи:
 * 1. Типизировать состояние витрины через `CardWidgetState`
 * 2. Экспортировать компонент `CardSettings`
 *
 * Потребители:
 *  - `src/pages/showcase/index.tsx` — подключает панель и синхронизирует состояние с превью виджета Card
 */

import { CARD_HEADER_ACTION_SIZE_PRESET } from '@ui/card';
import { ICON_SHAPE_PRESET_KEYS, getIconPadding, type IconShapePreset } from '@ui/icon';
import { type SurfaceBackground } from '@ui/surface';
import { type TextAlignPreset, type TextSizePreset, type TextTone } from '@ui/text';
import { type TonePreset } from '@ui/tones';

import { BackgroundListbox } from '../background-listbox';
import { BorderGroup } from '../border-group';
import { IconRowGroup, type IconRowGroupAction } from '../icon-row-group';
import { ShapeListbox } from '../shape-listbox';
import { StyledSettingsForm } from '../showcase.styles';
import { TextGroup } from '../text-group';

/**
 * DEFAULT_CARD_HEADER_ACTION_ICON_PADDING — задаёт отступ окна Icon действия шапки по умолчанию.
 * Совпадает с отступом окна для `CARD_HEADER_ACTION_SIZE_PRESET`.
 */
const DEFAULT_CARD_HEADER_ACTION_ICON_PADDING = getIconPadding(
  CARD_HEADER_ACTION_SIZE_PRESET
);

/**
 * CardWidgetState — представляет состояние настроек компонента Card в витрине дизайн-системы.
 * Ключи совпадают с именами пропов компонента Card, кроме витринного ключа:
 * `headerActions` хранит демо-ряд действий с ключом иконки, отступом окна Icon и флагом
 * `disabled` вместо `ReactNode` и обработчика.
 * Пустая строка заголовка или подзаголовка означает вызов без пропа. Отметка `Set*`
 * живёт внутри TextGroup.
 * Используется для синхронизации значений между панелью управления и демонстрационным виджетом Card.
 *
 * @property actionShape — форма окна действия шапки
 * @property background — заливка карточки
 * @property borderTone — тон рамки
 * @property headerActions — демо-ряд действий шапки
 * @property showBorder — включает рамку
 * @property showShadow — включает тень при включённой рамке
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
export type CardWidgetState = {
  actionShape: IconShapePreset;
  background: SurfaceBackground;
  borderTone: TonePreset;
  headerActions: IconRowGroupAction[];
  showBorder: boolean;
  showShadow: boolean;
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
 * CardSettingsProps — представляет пропсы компонента CardSettings.
 *
 * @property onChange — обработчик изменения поля состояния витрины
 * @property state — текущее состояние настроек карточки
 */
type CardSettingsProps = {
  onChange: <K extends keyof CardWidgetState>(key: K, value: CardWidgetState[K]) => void;
  state: CardWidgetState;
};

/**
 * CardSettings — отображает панель настроек Card в витрине дизайн-системы.
 *
 * @example
 * <CardSettings state={card} onChange={updateCard} />
 */
export function CardSettings({ onChange, state }: CardSettingsProps) {
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

      <ShapeListbox
        label="Action shape:"
        shapes={ICON_SHAPE_PRESET_KEYS}
        value={state.actionShape}
        onChange={(shape) => onChange('actionShape', shape)}
      />

      <IconRowGroup
        actions={state.headerActions}
        defaultIconPadding={DEFAULT_CARD_HEADER_ACTION_ICON_PADDING}
        onActionsChange={(actions) => onChange('headerActions', actions)}
      />
    </StyledSettingsForm>
  );
}
